
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { form_id, n8n_webhook_url } = await req.json();

    if (!form_id) {
      return new Response(
        JSON.stringify({ error: 'form_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el formulario existe y está completado
    const { data: form, error: formError } = await supabaseClient
      .from('patient_forms')
      .select(`
        *,
        patients!inner(*)
      `)
      .eq('id', form_id)
      .eq('status', 'completed')
      .single();

    if (formError || !form) {
      return new Response(
        JSON.stringify({ error: 'Form not found or not completed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener respuestas del formulario
    const { data: answers, error: answersError } = await supabaseClient
      .from('questionnaire_answers')
      .select(`
        *,
        form_questions!inner(*)
      `)
      .eq('form_id', form_id);

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch form answers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener archivos del formulario
    const { data: files, error: filesError } = await supabaseClient
      .from('form_files')
      .select('*')
      .eq('form_id', form_id);

    if (filesError) {
      console.error('Error fetching files:', filesError);
    }

    // Crear entrada en la cola de procesamiento
    const { data: queueEntry, error: queueError } = await supabaseClient
      .from('processing_queue')
      .insert({
        form_id: form_id,
        patient_id: form.patient_id,
        webhook_url: n8n_webhook_url,
        status: 'pending'
      })
      .select()
      .single();

    if (queueError) {
      console.error('Error creating queue entry:', queueError);
      return new Response(
        JSON.stringify({ error: 'Failed to create processing queue entry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Preparar datos para n8n
    const patientData = {
      patient: {
        id: form.patient_id,
        name: `${form.patients.first_name} ${form.patients.last_name}`,
        email: form.patients.email,
        age: form.patients.age || null,
        gender: form.patients.gender || null
      },
      form: {
        id: form_id,
        token: form.form_token,
        completed_at: form.completed_at,
        created_at: form.created_at
      },
      answers: answers?.map(answer => ({
        question_id: answer.question_id,
        question_text: answer.form_questions?.question_text,
        question_category: answer.form_questions?.category,
        answer: answer.answer,
        answer_type: answer.answer_type
      })) || [],
      files: files?.map(file => ({
        id: file.id,
        name: file.file_name,
        url: file.file_url,
        type: file.file_type,
        size: file.file_size
      })) || [],
      processing: {
        queue_id: queueEntry.id,
        webhook_return_url: `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/n8n-webhook-response`
      }
    };

    // Actualizar cola como "processing"
    await supabaseClient
      .from('processing_queue')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', queueEntry.id);

    // Enviar datos a n8n
    const webhookUrl = n8n_webhook_url || Deno.env.get('N8N_WEBHOOK_URL');
    
    if (webhookUrl) {
      try {
        const n8nResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patientData)
        });

        if (!n8nResponse.ok) {
          throw new Error(`N8N webhook failed: ${n8nResponse.status}`);
        }

        const n8nResult = await n8nResponse.json();
        
        // Actualizar con ID de ejecución de n8n si está disponible
        if (n8nResult.execution_id) {
          await supabaseClient
            .from('processing_queue')
            .update({ n8n_execution_id: n8nResult.execution_id })
            .eq('id', queueEntry.id);
        }

        console.log(`Successfully sent form ${form_id} to n8n webhook`);

      } catch (webhookError) {
        console.error('Error calling n8n webhook:', webhookError);
        
        // Marcar como fallido
        await supabaseClient
          .from('processing_queue')
          .update({ 
            status: 'failed',
            error_message: webhookError.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', queueEntry.id);

        return new Response(
          JSON.stringify({ error: 'Failed to call n8n webhook', details: webhookError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Marcar formulario como "processed"
    await supabaseClient
      .from('patient_forms')
      .update({ status: 'processed' })
      .eq('id', form_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form sent to n8n for processing',
        queue_id: queueEntry.id,
        patient_data: patientData
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-form-n8n:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
