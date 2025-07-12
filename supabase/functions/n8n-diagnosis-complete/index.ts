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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { 
      queue_id, 
      form_id,
      patient_id,
      report_id,
      processing_result,
      execution_id,
      status = 'completed',
      error_message
    } = await req.json();

    console.log('N8N diagnosis completion webhook received:', {
      queue_id,
      form_id,
      patient_id,
      report_id,
      status,
      execution_id
    });

    if (!queue_id) {
      return new Response(
        JSON.stringify({ error: 'queue_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update processing queue status
    const updateData: any = {
      status: status,
      completed_at: new Date().toISOString()
    };

    if (execution_id) {
      updateData.n8n_execution_id = execution_id;
    }

    if (error_message) {
      updateData.error_message = error_message;
    }

    const { error: updateQueueError } = await supabaseClient
      .from('processing_queue')
      .update(updateData)
      .eq('id', queue_id);

    if (updateQueueError) {
      console.error('Error updating queue status:', updateQueueError);
      return new Response(
        JSON.stringify({ error: 'Failed to update queue status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If processing was successful and report_id is provided, update the report
    if (status === 'completed' && report_id) {
      const { error: reportUpdateError } = await supabaseClient
        .from('reports')
        .update({ 
          status: 'completed',
          n8n_generated_at: new Date().toISOString()
        })
        .eq('id', report_id);

      if (reportUpdateError) {
        console.error('Error updating report status:', reportUpdateError);
      }
    }

    // Mark form as processed if form_id is provided
    if (status === 'completed' && form_id) {
      const { error: formUpdateError } = await supabaseClient
        .from('patient_forms')
        .update({ status: 'processed' })
        .eq('id', form_id);

      if (formUpdateError) {
        console.error('Error updating form status:', formUpdateError);
      }
    }

    const responseMessage = status === 'completed' 
      ? `N8N diagnosis processing completed successfully for queue ${queue_id}`
      : `N8N diagnosis processing ${status} for queue ${queue_id}${error_message ? `: ${error_message}` : ''}`;

    console.log(responseMessage);

    return new Response(
      JSON.stringify({
        success: true,
        message: responseMessage,
        queue_id: queue_id,
        form_id: form_id,
        report_id: report_id,
        status: status
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in n8n-diagnosis-complete:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});