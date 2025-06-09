
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FormSubmissionRequest } from "./types.ts";
import { processFiles, updateAnswersWithFiles } from "./fileUtils.ts";
import { prepareAnswersForInsertion, saveFileRecords } from "./formProcessor.ts";
import { callN8nWebhook } from "./webhookUtils.ts";

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Usar service role para formularios públicos
    );

    const { form_token, answers, files_data }: FormSubmissionRequest = await req.json();

    console.log('Received form submission:', { 
      form_token, 
      answersCount: Object.keys(answers || {}).length, 
      filesDataCount: Object.keys(files_data || {}).length 
    });

    if (!form_token || !answers) {
      return new Response(
        JSON.stringify({ error: 'form_token and answers are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el formulario existe y no ha expirado
    const { data: form, error: formError } = await supabaseClient
      .from('patient_forms')
      .select('*')
      .eq('form_token', form_token)
      .eq('status', 'pending')
      .single();

    if (formError || !form) {
      console.error('Form not found:', formError);
      return new Response(
        JSON.stringify({ error: 'Form not found or already completed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el formulario no ha expirado
    if (new Date(form.expires_at) < new Date()) {
      console.log('Form expired, updating status');
      await supabaseClient
        .from('patient_forms')
        .update({ status: 'expired' })
        .eq('id', form.id);

      return new Response(
        JSON.stringify({ error: 'Form has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener las preguntas del formulario
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

    console.log('Found questions:', questions?.length);

    // Validar respuestas requeridas
    const missingRequired = questions
      .filter(q => q.required && q.question_type !== 'file')
      .filter(q => !answers[q.id] || answers[q.id].toString().trim() === '');

    if (missingRequired.length > 0) {
      console.log('Missing required answers:', missingRequired.map(q => q.question_text));
      return new Response(
        JSON.stringify({ 
          error: 'Missing required answers',
          missing_questions: missingRequired.map(q => q.question_text)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Procesar archivos si los hay
    const uploadedFiles = await processFiles(supabaseClient, files_data || {}, form.id);
    
    // Actualizar respuestas con URLs de archivos
    const updatedAnswers = updateAnswersWithFiles(answers, files_data || {}, uploadedFiles);

    // Insertar respuestas
    const answersToInsert = prepareAnswersForInsertion(updatedAnswers, questions, form);

    console.log('Inserting answers:', answersToInsert.length);

    const { error: answersError } = await supabaseClient
      .from('questionnaire_answers')
      .insert(answersToInsert);

    if (answersError) {
      console.error('Error inserting answers:', answersError);
      return new Response(
        JSON.stringify({ error: 'Failed to save answers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Answers inserted successfully');

    // Guardar información de archivos en form_files
    await saveFileRecords(supabaseClient, uploadedFiles, form);

    // Marcar formulario como completado
    const { error: updateError } = await supabaseClient
      .from('patient_forms')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', form.id);

    if (updateError) {
      console.error('Error updating form status:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to complete form' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Form ${form_token} completed successfully for patient ${form.patient_id}. Files uploaded: ${uploadedFiles.length}`);

    // Llamar al webhook de n8n después de completar exitosamente el formulario
    await callN8nWebhook(form.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        form_id: form.id,
        files_uploaded: uploadedFiles.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-patient-form:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
