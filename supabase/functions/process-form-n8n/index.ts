
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ProcessFormRequest } from './types.ts';
import { getFormData, getPatientData, createQueueEntry, updateQueueStatus } from './database.ts';
import { buildDynamicWebhookUrl, prepareMinimalData, callN8nWebhook } from './webhook.ts';

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

    let requestBody: ProcessFormRequest;
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

    console.log(`🔎 Processing form ${form_id} for n8n with dynamic URL`);

    // Get form and patient data
    const form = await getFormData(supabaseClient, form_id);
    const patient = await getPatientData(supabaseClient, form.patient_id);

    // Build dynamic webhook URL
    const dynamicWebhookUrl = buildDynamicWebhookUrl(n8n_webhook_url, form_id);

    // Create queue entry
    const queueEntry = await createQueueEntry(supabaseClient, form_id, form.patient_id, dynamicWebhookUrl);

    // Prepare data for n8n
    const minimalData = prepareMinimalData(form, patient, queueEntry);

    console.log('📦 Prepared data for n8n - Patient:', minimalData.patient.name);

    // Update queue status to processing
    await updateQueueStatus(supabaseClient, queueEntry.id, 'processing');

    try {
      // Call n8n webhook
      const n8nResult = await callN8nWebhook(dynamicWebhookUrl, minimalData);
      
      // Update with n8n execution ID if available
      if (n8nResult.execution_id) {
        console.log('🔄 Updating queue with n8n execution ID:', n8nResult.execution_id);
        await updateQueueStatus(supabaseClient, queueEntry.id, 'processing', { 
          n8n_execution_id: n8nResult.execution_id 
        });
      }

      console.log('🎉 Successfully sent form to n8n webhook');
      console.log('🎯 Form processed:', form_id);

    } catch (webhookError) {
      console.error('❌ Error calling n8n webhook:', webhookError);
      console.error('❌ Failed URL:', dynamicWebhookUrl);
      console.error('❌ Form ID:', form_id);
      
      // Mark as failed
      await updateQueueStatus(supabaseClient, queueEntry.id, 'failed', {
        error_message: webhookError.message
      });

      return new Response(
        JSON.stringify({ 
          error: 'Failed to call n8n webhook', 
          details: webhookError.message,
          queue_id: queueEntry.id,
          attempted_url: dynamicWebhookUrl
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Process completed successfully');
    console.log('🎯 Dynamic URL processing successful for form:', form_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form data sent to n8n for processing with dynamic URL',
        queue_id: queueEntry.id,
        webhook_url: dynamicWebhookUrl,
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
