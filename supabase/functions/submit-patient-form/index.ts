
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Usar service role para formularios públicos
    );

    const { form_token, answers, files_data } = await req.json();

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
    const uploadedFiles: any[] = [];
    const updatedAnswers = { ...answers };

    if (files_data && Object.keys(files_data).length > 0) {
      console.log('Processing files:', Object.keys(files_data).length);
      
      for (const [questionId, fileData] of Object.entries(files_data) as [string, any][]) {
        try {
          console.log(`Uploading file for question ${questionId}:`, fileData.name);
          
          // Generate unique filename
          const fileExt = fileData.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${form.id}/${fileName}`;
          
          // Convert base64 to Uint8Array
          const fileBuffer = Uint8Array.from(atob(fileData.data), c => c.charCodeAt(0));
          
          // Upload file to storage
          const { error: uploadError } = await supabaseClient.storage
            .from('patient-files')
            .upload(filePath, fileBuffer, {
              contentType: fileData.type,
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error(`Upload error for question ${questionId}:`, uploadError);
            throw new Error(`Error uploading file: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabaseClient.storage
            .from('patient-files')
            .getPublicUrl(filePath);

          // Save file info
          uploadedFiles.push({
            name: fileData.name,
            url: publicUrl,
            type: fileData.type,
            size: fileData.size
          });

          // Update answer with file URL
          updatedAnswers[questionId] = publicUrl;
          
          console.log(`File uploaded successfully for question ${questionId}: ${publicUrl}`);
          
        } catch (error) {
          console.error(`Error processing file for question ${questionId}:`, error);
          // Continue with form submission but log the error
          updatedAnswers[questionId] = `Error al subir: ${fileData.name}`;
        }
      }
    }

    // Mapear question_type a answer_type válido
    const mapQuestionTypeToAnswerType = (questionType: string): string => {
      switch (questionType) {
        case 'radio':
        case 'select':
        case 'frequency':
          return 'text';
        case 'checkbox_multiple':
          return 'text';
        case 'number':
        case 'scale':
          return 'number';
        case 'textarea':
          return 'textarea';
        case 'file':
          return 'file';
        case 'boolean':
          return 'boolean';
        case 'text':
        default:
          return 'text';
      }
    };

    // Insertar respuestas
    const answersToInsert = Object.entries(updatedAnswers).map(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      const answerType = question ? mapQuestionTypeToAnswerType(question.question_type) : 'text';
      
      // Convertir arrays a string para checkbox_multiple
      let processedAnswer = answer;
      if (Array.isArray(answer)) {
        processedAnswer = answer.join(', ');
      }
      
      return {
        form_id: form.id,
        patient_id: form.patient_id,
        question_id: questionId,
        answer: typeof processedAnswer === 'string' ? processedAnswer : JSON.stringify(processedAnswer),
        answer_type: answerType,
        date: new Date().toISOString()
      };
    });

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
    if (uploadedFiles.length > 0) {
      console.log('Saving file records:', uploadedFiles.length);
      const filesToInsert = uploadedFiles.map((file: any) => ({
        form_id: form.id,
        patient_id: form.patient_id,
        file_name: file.name,
        file_url: file.url,
        file_type: file.type,
        file_size: file.size || 0
      }));

      const { error: filesError } = await supabaseClient
        .from('form_files')
        .insert(filesToInsert);

      if (filesError) {
        console.error('Error inserting files:', filesError);
        // No fallar por errores de archivos, pero loggear
      } else {
        console.log('Files saved successfully');
      }
    }

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
