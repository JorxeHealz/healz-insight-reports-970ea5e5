
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { prepareAnswersForInsertion, saveFileRecords } from './formProcessor.ts'
import { processFiles, updateAnswersWithFiles } from './fileUtils.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Starting submit-patient-form function')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    const body = await req.json()
    console.log('📥 Received data:', Object.keys(body))
    
    const { form_token: formToken, answers, files_data } = body
    
    if (!formToken) {
      throw new Error('Form token is required')
    }

    console.log('📝 Processing form token:', formToken)

    // Get form information
    const { data: formRecord, error: formError } = await supabase
      .from('patient_forms')
      .select('*, patients(*)')
      .eq('form_token', formToken)
      .eq('status', 'pending')
      .single()

    if (formError || !formRecord) {
      console.error('❌ Form not found or already completed:', formError)
      throw new Error('Form not found or already completed')
    }

    const patient = Array.isArray(formRecord.patients) ? formRecord.patients[0] : formRecord.patients
    console.log('👤 Found patient:', patient.first_name, patient.last_name)

    // Process file uploads if any
    let uploadedFiles: any[] = []
    if (files_data && Object.keys(files_data).length > 0) {
      console.log(`📎 Processing ${Object.keys(files_data).length} files`)
      uploadedFiles = await processFiles(supabase, files_data, formRecord.id)
      console.log(`✅ Uploaded ${uploadedFiles.length} files`)
      
      // Save file records to database
      await saveFileRecords(supabase, uploadedFiles, formRecord)
    }

    // Update answers with file URLs
    const updatedAnswers = updateAnswersWithFiles(answers, files_data || {}, uploadedFiles)
    
    // Get all active questions for validation
    const { data: questions, error: questionsError } = await supabase
      .from('form_questions')
      .select('*')
      .eq('is_active', true)
    
    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError)
      throw new Error('Error fetching form questions')
    }
    
    // Process form responses  
    const answerRecords = prepareAnswersForInsertion(updatedAnswers, questions, formRecord)
    console.log(`📝 Prepared ${answerRecords.length} answer records`)
    
    // Insert answers into database
    if (answerRecords.length > 0) {
      const { error: answersError } = await supabase
        .from('questionnaire_answers')
        .insert(answerRecords)
        
      if (answersError) {
        console.error('❌ Error inserting answers:', answersError)
        throw new Error('Error saving form responses')
      }
      
      console.log(`✅ Saved ${answerRecords.length} form responses`)
    }

    // Mark form as completed
    const { error: updateError } = await supabase
      .from('patient_forms')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', formRecord.id)

    if (updateError) {
      console.error('❌ Error updating form status:', updateError)
      throw updateError
    }

    console.log('✅ Form marked as completed')

    // Return success response without n8n processing
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Formulario enviado correctamente',
        form_id: formRecord.id,
        responses_count: answerRecords?.length || 0,
        files_count: uploadedFiles.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in submit-patient-form:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error processing form submission'
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
