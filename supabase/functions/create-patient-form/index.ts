
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

    const { patient_id, notes } = await req.json();

    if (!patient_id) {
      return new Response(
        JSON.stringify({ error: 'patient_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el paciente existe y el usuario tiene acceso
    const { data: patient, error: patientError } = await supabaseClient
      .from('patients')
      .select('id, first_name, last_name')
      .eq('id', patient_id)
      .single();

    if (patientError || !patient) {
      return new Response(
        JSON.stringify({ error: 'Patient not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generar token único y seguro
    const formToken = crypto.randomUUID() + '-' + Date.now().toString(36);

    // Obtener el usuario actual
    const { data: { user } } = await supabaseClient.auth.getUser();

    // Crear el formulario
    const { data: form, error: formError } = await supabaseClient
      .from('patient_forms')
      .insert({
        patient_id,
        form_token: formToken,
        created_by: user?.id,
        notes: notes || null
      })
      .select()
      .single();

    if (formError) {
      console.error('Error creating form:', formError);
      return new Response(
        JSON.stringify({ error: 'Failed to create form' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generar URL del formulario
    const formUrl = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/form/${formToken}`;

    console.log(`Form created for patient ${patient.first_name} ${patient.last_name} with token: ${formToken}`);

    return new Response(
      JSON.stringify({
        success: true,
        form: {
          id: form.id,
          token: formToken,
          url: formUrl,
          patient: {
            id: patient.id,
            name: `${patient.first_name} ${patient.last_name}`
          },
          expires_at: form.expires_at,
          status: form.status
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-patient-form:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
