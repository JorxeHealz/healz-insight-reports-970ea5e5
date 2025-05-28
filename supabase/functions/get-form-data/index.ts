
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Service role para acceso público a formularios
    );

    const url = new URL(req.url);
    const formToken = url.searchParams.get('token');

    if (!formToken) {
      return new Response(
        JSON.stringify({ error: 'Form token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar el formulario por token
    const { data: form, error: formError } = await supabaseClient
      .from('patient_forms')
      .select(`
        *,
        patients!inner(first_name, last_name, email)
      `)
      .eq('form_token', formToken)
      .single();

    if (formError || !form) {
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar estado y expiración
    if (form.status === 'completed') {
      return new Response(
        JSON.stringify({ error: 'Form already completed' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date(form.expires_at) < new Date()) {
      // Marcar como expirado
      await supabaseClient
        .from('patient_forms')
        .update({ status: 'expired' })
        .eq('id', form.id);

      return new Response(
        JSON.stringify({ error: 'Form has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener preguntas del formulario
    const { data: questions, error: questionsError } = await supabaseClient
      .from('form_questions')
      .select('*')
      .eq('is_active', true)
      .order('order_number');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch form questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Organizar preguntas por categoría
    const questionsByCategory = questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {} as Record<string, any[]>);

    return new Response(
      JSON.stringify({
        success: true,
        form: {
          id: form.id,
          token: form.form_token,
          status: form.status,
          expires_at: form.expires_at,
          patient: {
            name: `${form.patients.first_name} ${form.patients.last_name}`,
            email: form.patients.email
          }
        },
        questions: questions,
        questionsByCategory: questionsByCategory
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-form-data:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
