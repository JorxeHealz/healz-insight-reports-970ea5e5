
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { processFormData } from './formProcessor.ts'
import { uploadFiles } from './fileUtils.ts'

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

    const formData = await req.formData()
    const formToken = formData.get('form_token') as string
    
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

    // Process form responses
    const responses = await processFormData(formData, formRecord.id, patient.id, supabase)
    console.log(`✅ Processed ${responses.length} form responses`)

    // Handle file uploads if any
    const files = formData.getAll('files') as File[]
    let uploadedFiles: any[] = []
    
    if (files && files.length > 0) {
      console.log(`📎 Processing ${files.length} files`)
      uploadedFiles = await uploadFiles(files, formRecord.id, patient.id, supabase)
      console.log(`✅ Uploaded ${uploadedFiles.length} files`)
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
        responses_count: responses.length,
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
