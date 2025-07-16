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

  const startTime = new Date().toISOString()
  let analytics_id = 'unknown'

  try {
    console.log('🚀 Starting process-analytics-n8n function at', startTime)
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    const { analytics_id: reqAnalyticsId, n8n_webhook_url }: ProcessAnalyticsRequest = await req.json()
    analytics_id = reqAnalyticsId
    
    if (!analytics_id) {
      throw new Error('Analytics ID is required')
    }

    const webhookUrl = n8n_webhook_url || 'https://joinhealz.app.n8n.cloud/webhook/analitica'
    console.log('🔍 Processing analytics:', analytics_id)
    console.log('📡 Target webhook URL:', webhookUrl)

    // Reset stuck analytics before processing
    const { data: resetResult } = await supabase.rpc('reset_stuck_analytics')
    if (resetResult && resetResult.length > 0 && resetResult[0].reset_count > 0) {
      console.log('🔄 Reset', resetResult[0].reset_count, 'stuck analytics')
    }

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

    console.log('📊 Current analytics status:', analyticsData.status)
    console.log('📅 Last updated:', analyticsData.updated_at)

    // Check if analytics is already being processed to prevent duplicates
    if (analyticsData.status === 'processing') {
      const timeDiff = new Date().getTime() - new Date(analyticsData.updated_at).getTime()
      const minutesDiff = Math.floor(timeDiff / (1000 * 60))
      
      console.log('⚠️ Analytics is already being processed for', minutesDiff, 'minutes')
      
      // If it's been processing for more than 30 minutes, reset it
      if (minutesDiff > 30) {
        console.log('🔄 Resetting analytics that has been processing too long')
        await supabase
          .from('patient_analytics')
          .update({ status: 'uploaded', updated_at: new Date().toISOString() })
          .eq('id', analytics_id)
      } else {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Analytics is already being processed',
            analytics_id: analytics_id,
            current_status: analyticsData.status,
            minutes_processing: minutesDiff
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }
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
    console.log('👤 Found patient:', patient.first_name, patient.last_name, '- ID:', patient.id)

    // Update status to processing with timestamp
    const processingStartTime = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('patient_analytics')
      .update({ 
        status: 'processing',
        updated_at: processingStartTime
      })
      .eq('id', analytics_id)

    if (updateError) {
      console.error('❌ Error updating analytics status:', updateError)
      throw updateError
    }

    console.log('✅ Analytics status updated to processing at', processingStartTime)

    // Extract file path from the file_url
    const urlParts = analyticsData.file_url.split('/storage/v1/object/public/patient-files/')
    if (urlParts.length !== 2) {
      console.error('❌ Invalid file URL format:', analyticsData.file_url)
      throw new Error('Invalid file URL format')
    }
    
    const filePath = urlParts[1]
    console.log('📁 Extracted file path:', filePath)
    console.log('📂 Original file URL:', analyticsData.file_url)

    // Create signed URL for the file with 2 hour expiration
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('patient-files')
      .createSignedUrl(filePath, 7200) // 7200 seconds = 2 hours

    if (signedUrlError) {
      console.error('❌ Error creating signed URL:', signedUrlError)
      console.error('❌ File path attempted:', filePath)
      throw signedUrlError
    }

    console.log('🔐 Created signed URL for file access (2h expiration)')

    // Prepare payload for N8N with callback URL
    const callbackUrl = `${supabaseUrl}/functions/v1/analytics-processing-complete`
    const payload = {
      patient_id: patient.id,
      download_url: signedUrlData.signedUrl,
      analytics_id: analyticsData.id,
      callback_url: callbackUrl,
      processing_started_at: processingStartTime
    }

    console.log('📤 Sending payload to N8N webhook:', webhookUrl)
    console.log('📊 Payload structure:', {
      patient_id: payload.patient_id,
      analytics_id: payload.analytics_id,
      callback_url: payload.callback_url,
      has_download_url: !!payload.download_url,
      processing_started_at: payload.processing_started_at
    })

    // Call N8N webhook with timeout
    const webhookPromise = fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Set timeout for 30 seconds
    const timeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Webhook timeout after 30 seconds')), 30000)
    )

    const webhookResponse = await Promise.race([webhookPromise, timeoutPromise])
    console.log('📡 Webhook response status:', webhookResponse.status)
    console.log('📡 Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()))

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('❌ N8N webhook failed with status:', webhookResponse.status)
      console.error('❌ N8N webhook error body:', errorText)
      
      // Update status to failed with error details
      await supabase
        .from('patient_analytics')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', analytics_id)
      
      throw new Error(`N8N webhook failed (${webhookResponse.status}): ${errorText}`)
    }

    const webhookResult = await webhookResponse.json()
    console.log('✅ N8N webhook response:', webhookResult)

    const endTime = new Date().toISOString()
    const processingTime = new Date(endTime).getTime() - new Date(startTime).getTime()
    console.log('🎯 Analytics processing initiated successfully in', processingTime, 'ms')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Analytics processing started',
        analytics_id: analytics_id,
        patient_name: `${patient.first_name} ${patient.last_name}`,
        webhook_response: webhookResult,
        processing_time_ms: processingTime,
        callback_url: callbackUrl
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    const errorTime = new Date().toISOString()
    console.error('❌ Error in process-analytics-n8n at', errorTime, ':', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Analytics ID:', analytics_id)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error processing analytics',
        analytics_id: analytics_id,
        timestamp: errorTime
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