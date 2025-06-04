
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
      form_id,
      biomarkers_processed,
      execution_id,
      status = 'completed',
      error_message
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

    // Actualizar el estado de la cola
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

    // Si el procesamiento fue exitoso, marcar el formulario como processed
    if (status === 'completed' && form_id) {
      const { error: formUpdateError } = await supabaseClient
        .from('patient_forms')
        .update({ status: 'processed' })
        .eq('id', form_id);

      if (formUpdateError) {
        console.error('Error updating form status:', formUpdateError);
        // No fallar todo el proceso por esto, solo loguear
      }
    }

    const responseMessage = status === 'completed' 
      ? `N8N processing completed successfully for queue ${queue_id}. ${biomarkers_processed || 0} biomarkers processed.`
      : `N8N processing ${status} for queue ${queue_id}${error_message ? `: ${error_message}` : ''}`;

    console.log(responseMessage);

    return new Response(
      JSON.stringify({
        success: true,
        message: responseMessage,
        queue_id: queue_id,
        form_id: form_id,
        biomarkers_processed: biomarkers_processed || 0,
        status: status
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in n8n-processing-complete:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
