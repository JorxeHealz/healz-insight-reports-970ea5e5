
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessAnalyticsRequest {
  analytics_id: string;
  n8n_webhook_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Starting process-analytics-n8n function')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    const { analytics_id, n8n_webhook_url }: ProcessAnalyticsRequest = await req.json()
    
    if (!analytics_id) {
      throw new Error('Analytics ID is required')
    }

    const webhookUrl = n8n_webhook_url || 'https://joinhealz.app.n8n.cloud/webhook/analitica'
    console.log('🔍 Processing analytics:', analytics_id)

    // Get analytics record with patient data
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('patient_analytics')
      .select(`
        *,
        patient:patients(*)
      `)
      .eq('id', analytics_id)
      .single()

    if (analyticsError || !analyticsData) {
      console.error('❌ Analytics not found:', analyticsError)
      throw new Error('Analytics record not found')
    }

    // Check if analytics is already being processed to prevent duplicates
    if (analyticsData.status === 'processing') {
      console.log('⚠️ Analytics is already being processed, skipping to prevent duplicates')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Analytics is already being processed',
          analytics_id: analytics_id,
          current_status: analyticsData.status
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Check if analytics was already processed successfully
    if (analyticsData.status === 'processed') {
      console.log('✅ Analytics was already processed successfully, skipping')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Analytics was already processed',
          analytics_id: analytics_id,
          current_status: analyticsData.status
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    const patient = Array.isArray(analyticsData.patient) ? analyticsData.patient[0] : analyticsData.patient
    console.log('👤 Found patient:', patient.first_name, patient.last_name)

    // Update status to processing
    const { error: updateError } = await supabase
      .from('patient_analytics')
      .update({ status: 'processing' })
      .eq('id', analytics_id)

    if (updateError) {
      console.error('❌ Error updating analytics status:', updateError)
      throw updateError
    }

    console.log('✅ Analytics status updated to processing')

    // Extract file path from the file_url
    // Expected format: https://domain/storage/v1/object/public/patient-files/path/file.pdf
    const urlParts = analyticsData.file_url.split('/storage/v1/object/public/patient-files/')
    if (urlParts.length !== 2) {
      throw new Error('Invalid file URL format')
    }
    
    const filePath = urlParts[1] // This should be like "patient-id/filename.pdf"
    console.log('📁 Extracted file path:', filePath)

    // Create signed URL for the file with 1 hour expiration
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('patient-files')
      .createSignedUrl(filePath, 3600) // 3600 seconds = 1 hour

    if (signedUrlError) {
      console.error('❌ Error creating signed URL:', signedUrlError)
      throw signedUrlError
    }

    console.log('🔐 Created signed URL for file access (1h expiration)')

    // Prepare simplified payload for N8N
    const payload = {
      patient_id: patient.id,
      download_url: signedUrlData.signedUrl,
      analytics_id: analyticsData.id
    }

    console.log('📤 Sending payload to N8N webhook:', webhookUrl)
    console.log('📊 Payload:', payload)

    // Call N8N webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('📡 Webhook response status:', webhookResponse.status)

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('❌ N8N webhook failed:', errorText)
      
      // Update status to failed
      await supabase
        .from('patient_analytics')
        .update({ status: 'failed' })
        .eq('id', analytics_id)
      
      throw new Error(`N8N webhook failed: ${errorText}`)
    }

    const webhookResult = await webhookResponse.json()
    console.log('✅ N8N webhook response:', webhookResult)

    console.log('🎯 Analytics processing initiated successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Analytics processing started',
        analytics_id: analytics_id,
        patient_name: `${patient.first_name} ${patient.last_name}`,
        webhook_response: webhookResult
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in process-analytics-n8n:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error processing analytics'
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
