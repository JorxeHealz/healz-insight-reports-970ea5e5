
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

    console.log(`Processing form ${form_id} for n8n`);

    // Verificar que el formulario existe y está completado
    const { data: form, error: formError } = await supabaseClient
      .from('patient_forms')
      .select(`
        *,
        patients!inner(
          id,
          first_name,
          last_name,
          email,
          age,
          gender
        )
      `)
      .eq('id', form_id)
      .eq('status', 'completed')
      .single();

    if (formError || !form) {
      console.error('Form not found or not completed:', formError);
      return new Response(
        JSON.stringify({ error: 'Form not found or not completed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found completed form for patient: ${form.patients.first_name} ${form.patients.last_name}`);

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

    console.log(`Created queue entry ${queueEntry.id} for form ${form_id}`);

    // Preparar datos mínimos para n8n
    const minimalData = {
      form_id: form_id,
      patient: {
        id: form.patient_id,
        name: `${form.patients.first_name} ${form.patients.last_name}`,
        email: form.patients.email,
        age: form.patients.age || null,
        gender: form.patients.gender || null
      },
      form_token: form.form_token,
      completed_at: form.completed_at,
      created_at: form.created_at,
      processing: {
        queue_id: queueEntry.id
      },
      supabase_config: {
        url: Deno.env.get('SUPABASE_URL'),
        service_role_key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        completion_webhook_url: `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/n8n-processing-complete`
      },
      instructions: {
        message: "Use the provided Supabase credentials to extract all form answers and files. Call the completion webhook when done.",
        queries_to_run: [
          "SELECT * FROM questionnaire_answers WHERE form_id = '" + form_id + "'",
          "SELECT * FROM form_files WHERE form_id = '" + form_id + "'",
          "SELECT * FROM form_questions WHERE form_id = '" + form_id + "'"
        ]
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

    // Enviar datos mínimos a n8n
    const webhookUrl = n8n_webhook_url || Deno.env.get('N8N_WEBHOOK_URL');
    
    if (webhookUrl) {
      try {
        console.log(`Sending minimal data to n8n webhook: ${webhookUrl}`);
        
        const n8nResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(minimalData)
        });

        if (!n8nResponse.ok) {
          throw new Error(`N8N webhook failed: ${n8nResponse.status} - ${await n8nResponse.text()}`);
        }

        const n8nResult = await n8nResponse.json();
        
        // Actualizar con ID de ejecución de n8n si está disponible
        if (n8nResult.execution_id) {
          await supabaseClient
            .from('processing_queue')
            .update({ n8n_execution_id: n8nResult.execution_id })
            .eq('id', queueEntry.id);
        }

        console.log(`Successfully sent form ${form_id} to n8n webhook for processing`);

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
    } else {
      console.error('No webhook URL provided');
      return new Response(
        JSON.stringify({ error: 'No webhook URL configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form data sent to n8n for processing',
        queue_id: queueEntry.id,
        sent_data: {
          form_id: form_id,
          patient_name: minimalData.patient.name,
          patient_email: minimalData.patient.email
        },
        note: 'N8N will extract all form data using Supabase credentials and update status when complete'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-form-n8n:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
