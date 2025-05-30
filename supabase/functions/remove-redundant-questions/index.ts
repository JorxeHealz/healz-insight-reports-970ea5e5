
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Remove redundant questions that ask for patient information already known
    const { error: deleteError } = await supabaseClient
      .from('form_questions')
      .delete()
      .ilike('question_text', '%nombre%completo%')
      .eq('category', 'general_info');

    if (deleteError) {
      console.error('Error removing redundant questions:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to remove redundant questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also remove any questions asking for email, phone if they exist
    await supabaseClient
      .from('form_questions')
      .delete()
      .or('question_text.ilike.%email%,question_text.ilike.%teléfono%,question_text.ilike.%telefono%')
      .eq('category', 'general_info');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Redundant patient information questions removed successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in remove-redundant-questions:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
