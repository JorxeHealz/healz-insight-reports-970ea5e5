
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Service role para webhook de n8n
    );

    const { 
      queue_id, 
      diagnosis, 
      vitality_score, 
      risk_score, 
      risk_profile, 
      action_plan, 
      summary,
      execution_id,
      biomarkers,
      symptoms,
      clinical_notes
    } = await req.json();

    if (!queue_id) {
      return new Response(
        JSON.stringify({ error: 'queue_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar la entrada en la cola de procesamiento
    const { data: queueEntry, error: queueError } = await supabaseClient
      .from('processing_queue')
      .select('*')
      .eq('id', queue_id)
      .single();

    if (queueError || !queueEntry) {
      return new Response(
        JSON.stringify({ error: 'Queue entry not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Preparar datos de diagnóstico
    const diagnosisData = {
      vitalityScore: vitality_score || 0,
      riskScore: risk_score || 0,
      riskProfile: risk_profile || {},
      summary: summary || ''
    };

    // Crear o actualizar el reporte
    const { data: report, error: reportError } = await supabaseClient
      .from('reports')
      .upsert({
        patient_id: queueEntry.patient_id,
        form_id: queueEntry.form_id,
        processing_queue_id: queue_id,
        diagnosis: diagnosisData,
        action_plan: action_plan || {},
        n8n_generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating/updating report:', reportError);
      
      // Marcar cola como fallida
      await supabaseClient
        .from('processing_queue')
        .update({ 
          status: 'failed',
          error_message: 'Failed to create report',
          completed_at: new Date().toISOString()
        })
        .eq('id', queue_id);

      return new Response(
        JSON.stringify({ error: 'Failed to create report' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Guardar biomarcadores del informe si están presentes
    if (biomarkers && Array.isArray(biomarkers)) {
      for (const biomarker of biomarkers) {
        await supabaseClient
          .from('patient_biomarkers')
          .insert({
            patient_id: queueEntry.patient_id,
            form_id: queueEntry.form_id,
            biomarker_id: biomarker.biomarker_id,
            value: biomarker.value,
            date: biomarker.date || new Date().toISOString(),
            is_out_of_range: biomarker.is_out_of_range || false,
            notes: biomarker.notes
          });
      }
    }

    // Guardar perfil de riesgo detallado
    if (risk_profile && typeof risk_profile === 'object') {
      for (const [category, data] of Object.entries(risk_profile)) {
        if (typeof data === 'object' && data !== null) {
          await supabaseClient
            .from('report_risk_profiles')
            .insert({
              report_id: report.id,
              form_id: queueEntry.form_id,
              category: category,
              risk_level: data.level || 'medium',
              percentage: data.percentage || null,
              description: data.description || null,
              recommendations: data.recommendations || null
            });
        }
      }
    }

    // Guardar planes de acción específicos
    if (action_plan && typeof action_plan === 'object') {
      for (const [category, plans] of Object.entries(action_plan)) {
        if (Array.isArray(plans)) {
          for (const plan of plans) {
            await supabaseClient
              .from('report_action_plans')
              .insert({
                report_id: report.id,
                form_id: queueEntry.form_id,
                category: category,
                title: plan.title || '',
                description: plan.description || '',
                dosage: plan.dosage || null,
                duration: plan.duration || null,
                priority: plan.priority || 'medium'
              });
          }
        }
      }
    }

    // Guardar notas clínicas
    if (clinical_notes && Array.isArray(clinical_notes)) {
      for (const note of clinical_notes) {
        await supabaseClient
          .from('report_comments')
          .insert({
            report_id: report.id,
            form_id: queueEntry.form_id,
            title: note.title || 'Nota clínica',
            content: note.content || '',
            author: note.author || 'Sistema',
            category: note.category || 'general',
            priority: note.priority || 'medium'
          });
      }
    }

    // Marcar cola como completada
    const { error: updateQueueError } = await supabaseClient
      .from('processing_queue')
      .update({ 
        status: 'completed',
        n8n_execution_id: execution_id,
        completed_at: new Date().toISOString()
      })
      .eq('id', queue_id);

    if (updateQueueError) {
      console.error('Error updating queue status:', updateQueueError);
    }

    console.log(`Successfully processed n8n response for queue ${queue_id}, created report ${report.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Report created successfully',
        report_id: report.id,
        queue_id: queue_id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in n8n-webhook-response:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
