
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

  console.log('🚀 Starting process-form-n8n function');
  console.log('Request method:', req.method);

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

    console.log('✅ Supabase client created successfully');

    let requestBody;
    try {
      requestBody = await req.json();
      console.log('📝 Request body parsed:', JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { form_id, n8n_webhook_url } = requestBody;

    console.log('🔍 Extracted parameters:');
    console.log('- form_id:', form_id);
    console.log('- n8n_webhook_url:', n8n_webhook_url);

    if (!form_id) {
      console.error('❌ Missing form_id parameter');
      return new Response(
        JSON.stringify({ error: 'form_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔎 Processing form ${form_id} for n8n`);

    // PASO 1: Primero obtener el formulario de forma simple
    console.log('📊 Step 1: Querying form data...');
    const { data: form, error: formError } = await supabaseClient
      .from('patient_forms')
      .select('*')
      .eq('id', form_id)
      .eq('status', 'completed')
      .single();

    if (formError) {
      console.error('❌ Form query error:', JSON.stringify(formError, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch form data', 
          details: formError.message,
          code: formError.code
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!form) {
      console.error('❌ Form not found or not completed');
      return new Response(
        JSON.stringify({ error: 'Form not found or not completed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Found form:', form.id, 'for patient:', form.patient_id);

    // PASO 2: Ahora obtener los datos del paciente por separado
    console.log('👤 Step 2: Querying patient data...');
    const { data: patient, error: patientError } = await supabaseClient
      .from('patients')
      .select('id, first_name, last_name, email, gender')
      .eq('id', form.patient_id)
      .single();

    if (patientError) {
      console.error('❌ Patient query error:', JSON.stringify(patientError, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch patient data', 
          details: patientError.message,
          patient_id: form.patient_id
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!patient) {
      console.error('❌ Patient not found for ID:', form.patient_id);
      return new Response(
        JSON.stringify({ error: 'Patient not found', patient_id: form.patient_id }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Found patient:', `${patient.first_name} ${patient.last_name}`);

    // Crear entrada en la cola de procesamiento
    console.log('📝 Creating processing queue entry...');
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
      console.error('❌ Error creating queue entry:', JSON.stringify(queueError, null, 2));
      return new Response(
        JSON.stringify({ error: 'Failed to create processing queue entry', details: queueError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Created queue entry:', queueEntry.id);

    // Preparar datos mínimos para n8n
    const minimalData = {
      form_id: form_id,
      patient: {
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
        gender: patient.gender || null
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

    console.log('📦 Prepared data for n8n - Patient:', minimalData.patient.name);

    // Actualizar cola como "processing"
    console.log('🔄 Updating queue status to processing...');
    const { error: updateError } = await supabaseClient
      .from('processing_queue')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', queueEntry.id);

    if (updateError) {
      console.error('⚠️ Warning: Could not update queue status:', updateError);
    } else {
      console.log('✅ Queue status updated to processing');
    }

    // Enviar datos mínimos a n8n
    const webhookUrl = n8n_webhook_url || Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('❌ No webhook URL provided');
      return new Response(
        JSON.stringify({ error: 'No webhook URL configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🌐 Calling n8n webhook: ${webhookUrl}`);
    console.log('📤 Payload size:', JSON.stringify(minimalData).length, 'characters');

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minimalData)
      });

      console.log('📡 Webhook response status:', webhookResponse.status);

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('❌ N8N webhook failed with status:', webhookResponse.status);
        console.error('❌ N8N webhook error response:', errorText);
        
        throw new Error(`N8N webhook failed: ${webhookResponse.status} - ${errorText}`);
      }

      let n8nResult;
      try {
        const responseText = await webhookResponse.text();
        console.log('📥 Raw webhook response:', responseText);
        
        if (responseText) {
          n8nResult = JSON.parse(responseText);
          console.log('✅ Parsed n8n response:', JSON.stringify(n8nResult, null, 2));
        } else {
          console.log('ℹ️ Empty response from n8n webhook');
          n8nResult = {};
        }
      } catch (parseError) {
        console.error('⚠️ Could not parse n8n response as JSON:', parseError);
        n8nResult = { raw_response: await webhookResponse.text() };
      }
      
      // Actualizar con ID de ejecución de n8n si está disponible
      if (n8nResult.execution_id) {
        console.log('🔄 Updating queue with n8n execution ID:', n8nResult.execution_id);
        await supabaseClient
          .from('processing_queue')
          .update({ n8n_execution_id: n8nResult.execution_id })
          .eq('id', queueEntry.id);
      }

      console.log('🎉 Successfully sent form to n8n webhook');

    } catch (webhookError) {
      console.error('❌ Error calling n8n webhook:', webhookError);
      
      // Marcar como fallido
      console.log('🔄 Marking queue entry as failed...');
      await supabaseClient
        .from('processing_queue')
        .update({ 
          status: 'failed',
          error_message: webhookError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', queueEntry.id);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to call n8n webhook', 
          details: webhookError.message,
          queue_id: queueEntry.id 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Process completed successfully');

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
    console.error('💥 Unexpected error in process-form-n8n:', error);
    console.error('💥 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        type: error.name 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
