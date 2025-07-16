
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessingCompleteRequest {
  analytics_id: string;
  status: 'processed' | 'failed';
  biomarkers?: Array<{
    name: string;
    value: number;
    unit: string;
    date?: string;
  }>;
  error_message?: string;
  extracted_data?: any;
  processing_time_ms?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = new Date().toISOString()
  let analytics_id = 'unknown'

  try {
    console.log('🎯 Analytics processing completion callback received at', startTime)
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    const { 
      analytics_id: reqAnalyticsId, 
      status, 
      biomarkers, 
      error_message,
      extracted_data,
      processing_time_ms 
    }: ProcessingCompleteRequest = await req.json()
    
    analytics_id = reqAnalyticsId
    
    if (!analytics_id) {
      throw new Error('Analytics ID is required')
    }

    console.log('📊 Processing completion for analytics:', analytics_id)
    console.log('📈 New status:', status)
    
    if (error_message) {
      console.log('❌ Error message:', error_message)
    }
    
    if (biomarkers && biomarkers.length > 0) {
      console.log('🧬 Biomarkers to process:', biomarkers.length)
    }

    if (processing_time_ms) {
      console.log('⏱️ Processing time:', processing_time_ms, 'ms')
    }

    // Verify the analytics record exists and is in processing state
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('patient_analytics')
      .select('id, status, patient_id, patient:patients(*)')
      .eq('id', analytics_id)
      .single()

    if (analyticsError || !analyticsData) {
      console.error('❌ Analytics record not found:', analyticsError)
      throw new Error('Analytics record not found')
    }

    console.log('📋 Current analytics status:', analyticsData.status)

    // Only update if currently processing to prevent race conditions
    if (analyticsData.status !== 'processing') {
      console.log('⚠️ Analytics is not in processing state, current status:', analyticsData.status)
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Analytics is not in processing state',
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

    // Prepare update data
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    }

    // Store extracted data if provided
    if (extracted_data) {
      updateData.extract_pdf = JSON.stringify(extracted_data)
      console.log('💾 Storing extracted data')
    }

    // Update analytics status
    const { error: updateError } = await supabase
      .from('patient_analytics')
      .update(updateData)
      .eq('id', analytics_id)

    if (updateError) {
      console.error('❌ Error updating analytics status:', updateError)
      throw updateError
    }

    console.log('✅ Analytics status updated to', status)

    // If processing was successful and we have biomarkers, insert them
    if (status === 'processed' && biomarkers && biomarkers.length > 0) {
      console.log('📊 Processing', biomarkers.length, 'biomarkers')

      for (const biomarkerData of biomarkers) {
        try {
          // Find or create biomarker definition
          let { data: biomarkerDef, error: biomarkerDefError } = await supabase
            .from('biomarkers')
            .select('id')
            .eq('name', biomarkerData.name)
            .single()

          if (biomarkerDefError && biomarkerDefError.code === 'PGRST116') {
            // Biomarker doesn't exist, create it
            const { data: newBiomarker, error: createError } = await supabase
              .from('biomarkers')
              .insert({
                name: biomarkerData.name,
                unit: biomarkerData.unit,
                category: ['analitica'],
                conventional_min: 0,
                conventional_max: 999999,
                optimal_min: 0,
                optimal_max: 999999
              })
              .select('id')
              .single()

            if (createError) {
              console.error('❌ Error creating biomarker:', createError)
              continue
            }

            biomarkerDef = newBiomarker
            console.log('✅ Created new biomarker:', biomarkerData.name)
          } else if (biomarkerDefError) {
            console.error('❌ Error finding biomarker:', biomarkerDefError)
            continue
          }

          // Check if biomarker already exists for this analytics_id
          const { data: existingBiomarker, error: checkError } = await supabase
            .from('patient_biomarkers')
            .select('id, value')
            .eq('patient_id', analyticsData.patient_id)
            .eq('biomarker_id', biomarkerDef.id)
            .eq('analytics_id', analytics_id)
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('❌ Error checking existing biomarker:', checkError)
            continue
          }

          if (existingBiomarker) {
            // Update existing biomarker instead of inserting duplicate
            const { error: updateError } = await supabase
              .from('patient_biomarkers')
              .update({
                value: biomarkerData.value,
                date: biomarkerData.date ? new Date(biomarkerData.date) : new Date()
              })
              .eq('id', existingBiomarker.id)

            if (updateError) {
              console.error('❌ Error updating existing biomarker:', updateError)
              continue
            }

            console.log('🔄 Updated existing biomarker:', biomarkerData.name, '=', biomarkerData.value, '(was:', existingBiomarker.value, ')')
          } else {
            // Insert new biomarker record
            const { error: insertError } = await supabase
              .from('patient_biomarkers')
              .insert({
                patient_id: analyticsData.patient_id,
                biomarker_id: biomarkerDef.id,
                analytics_id: analytics_id,
                value: biomarkerData.value,
                date: biomarkerData.date ? new Date(biomarkerData.date) : new Date()
              })

            if (insertError) {
              console.error('❌ Error inserting patient biomarker:', insertError)
              continue
            }

            console.log('✅ Inserted new biomarker:', biomarkerData.name, '=', biomarkerData.value)
          }
        } catch (biomarkerError) {
          console.error('❌ Error processing biomarker:', biomarkerData.name, biomarkerError)
        }
      }

      console.log('🎯 All biomarkers processed successfully')
    }

    const endTime = new Date().toISOString()
    const callbackTime = new Date(endTime).getTime() - new Date(startTime).getTime()
    console.log('🎯 Analytics processing callback completed in', callbackTime, 'ms')

    return new Response(
      JSON.stringify({
        success: true,
        message: `Analytics processing ${status}`,
        analytics_id: analytics_id,
        previous_status: 'processing',
        new_status: status,
        biomarkers_processed: biomarkers?.length || 0,
        callback_time_ms: callbackTime,
        processing_time_ms: processing_time_ms
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
    console.error('❌ Error in analytics-processing-complete at', errorTime, ':', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Analytics ID:', analytics_id)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error handling processing completion',
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
