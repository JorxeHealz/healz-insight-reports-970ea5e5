
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Service role para webhook de n8n
    );

    const { 
      queue_id, 
      report_id, // New parameter from enhanced flow
      patient_id,
      vitality_score, 
      risk_score, 
      risk_profile, 
      summary, 
      biomarkers, 
      action_plan,
      clinical_notes,
      key_findings
    } = await req.json();

    console.log('📨 N8N Webhook Response received:', {
      queue_id,
      report_id, // Log the provided report_id
      patient_id,
      vitality_score,
      has_biomarkers: biomarkers?.length || 0,
      has_action_plan: !!action_plan,
      has_clinical_notes: clinical_notes?.length || 0,
      has_key_findings: key_findings?.length || 0
    });

    if (!queue_id) {
      return new Response(
        JSON.stringify({ error: 'Missing queue_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the processing queue entry
    const { data: queueEntry, error: queueError } = await supabaseClient
      .from('processing_queue')
      .select('*')
      .eq('id', queue_id)
      .single();

    if (queueError || !queueEntry) {
      console.error('Queue entry not found:', queueError);
      return new Response(
        JSON.stringify({ error: 'Queue entry not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare diagnosis data
    const diagnosisData = {
      vitalityScore: vitality_score || 0,
      riskScore: risk_score || 0,
      riskProfile: risk_profile || {},
      summary: summary || ''
    };

    // Update the existing report (instead of creating/upserting)
    let report;
    if (report_id) {
      console.log('📝 Updating existing report:', report_id);
      const { data: updatedReport, error: reportError } = await supabaseClient
        .from('reports')
        .update({
          diagnosis: diagnosisData,
          action_plan: action_plan || {},
          vitality_score: vitality_score || null,
          risk_score: risk_score || null,
          average_risk: risk_score || null,
          status: 'completed', // Mark as completed
          n8n_generated_at: new Date().toISOString()
        })
        .eq('id', report_id)
        .select()
        .single();

      if (reportError) {
        console.error('❌ Error updating report:', reportError);
        throw reportError;
      }
      
      report = updatedReport;
      console.log('✅ Report updated successfully');
    } else {
      // Fallback: create report if report_id not provided (backward compatibility)
      console.log('⚠️ No report_id provided, creating new report (fallback)');
      const { data: newReport, error: reportError } = await supabaseClient
        .from('reports')
        .insert({
          patient_id: queueEntry.patient_id,
          form_id: queueEntry.form_id,
          processing_queue_id: queue_id,
          diagnosis: diagnosisData,
          action_plan: action_plan || {},
          vitality_score: vitality_score || null,
          risk_score: risk_score || null,
          average_risk: risk_score || null,
          status: 'completed',
          n8n_generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (reportError) {
        console.error('❌ Error creating report:', reportError);
        throw reportError;
      }

      report = newReport;
      console.log('✅ Report created successfully');
    }

    // Update biomarkers with report_id if provided
    if (biomarkers && Array.isArray(biomarkers)) {
      console.log(`📊 Processing ${biomarkers.length} biomarkers`);
      for (const biomarker of biomarkers) {
        await supabaseClient
          .from('patient_biomarkers')
          .insert({
            patient_id: queueEntry.patient_id,
            form_id: queueEntry.form_id,
            report_id: report.id,
            biomarker_id: biomarker.biomarker_id,
            value: biomarker.value,
            date: biomarker.date || new Date().toISOString(),
            is_out_of_range: biomarker.is_out_of_range || false,
            notes: biomarker.notes
          });
      }
      console.log('✅ Biomarkers processed successfully');
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
