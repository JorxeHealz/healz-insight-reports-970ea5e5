
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ProcessFormRequest } from './types.ts';
import { getFormData, getPatientData, getPdfUrl, createQueueEntry, updateQueueStatus, cleanupStuckProcessingEntries } from './database.ts';
import { buildStaticWebhookUrl, prepareMinimalData, callN8nWebhook } from './webhook.ts';

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

    // Clean up stuck processing entries before starting new processing
    await cleanupStuckProcessingEntries(supabaseClient);

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

    console.log(`🔎 Processing form ${form_id} for n8n with static URL approach`);

    // Get form, patient data, and PDF URL
    const form = await getFormData(supabaseClient, form_id);
    const patient = await getPatientData(supabaseClient, form.patient_id);
    const pdfUrl = await getPdfUrl(supabaseClient, form_id);

    // Build static webhook URL
    const staticWebhookUrl = buildStaticWebhookUrl(n8n_webhook_url);
    console.log('🔗 Generated static webhook URL:', staticWebhookUrl);

    // Create queue entry
    const queueEntry = await createQueueEntry(supabaseClient, form_id, form.patient_id, staticWebhookUrl);

    // Prepare data for n8n (now includes PDF URL)
    const minimalData = prepareMinimalData(form, patient, queueEntry, pdfUrl);

    console.log('📦 Prepared data for n8n - Patient:', minimalData.patient.name);
    console.log('📎 PDF URL:', pdfUrl ? 'Available' : 'Not available');

    // Update queue status to processing
    await updateQueueStatus(supabaseClient, queueEntry.id, 'processing');

    try {
      // Call n8n webhook with static URL and form_id + pdf_url in body
      const n8nResult = await callN8nWebhook(staticWebhookUrl, minimalData);
      
      // Update with n8n execution ID if available
      if (n8nResult.execution_id) {
        console.log('🔄 Updating queue with n8n execution ID:', n8nResult.execution_id);
        await updateQueueStatus(supabaseClient, queueEntry.id, 'processing', { 
          n8n_execution_id: n8nResult.execution_id 
        });
      }

      console.log('🎉 Successfully sent form to n8n webhook with static URL');
      console.log('🎯 Form processed:', form_id);

    } catch (webhookError) {
      console.error('❌ Error calling n8n webhook:', webhookError);
      console.error('❌ Failed URL:', staticWebhookUrl);
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
          attempted_url: staticWebhookUrl
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Process completed successfully with static URL');
    console.log('🎯 Static URL processing successful for form:', form_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form data sent to n8n for processing with static URL',
        queue_id: queueEntry.id,
        webhook_url: staticWebhookUrl,
        sent_data: {
          form_id: form_id,
          patient_name: minimalData.patient.name,
          patient_email: minimalData.patient.email,
          pdf_url: pdfUrl
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
