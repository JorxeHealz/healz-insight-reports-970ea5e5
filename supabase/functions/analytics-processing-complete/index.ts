
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
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Starting analytics-processing-complete function')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    const { analytics_id, status, biomarkers, error_message }: ProcessingCompleteRequest = await req.json()
    
    if (!analytics_id) {
      throw new Error('Analytics ID is required')
    }

    console.log('🔍 Processing completion for analytics:', analytics_id, 'Status:', status)

    // Get analytics record
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('patient_analytics')
      .select('*, patient:patients(*)')
      .eq('id', analytics_id)
      .single()

    if (analyticsError || !analyticsData) {
      console.error('❌ Analytics not found:', analyticsError)
      throw new Error('Analytics record not found')
    }

    // Update analytics status
    const { error: updateError } = await supabase
      .from('patient_analytics')
      .update({ status })
      .eq('id', analytics_id)

    if (updateError) {
      console.error('❌ Error updating analytics status:', updateError)
      throw updateError
    }

    console.log('✅ Analytics status updated to:', status)

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

          // Insert patient biomarker with simplified structure
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

          console.log('✅ Inserted biomarker:', biomarkerData.name, '=', biomarkerData.value)
        } catch (biomarkerError) {
          console.error('❌ Error processing biomarker:', biomarkerData.name, biomarkerError)
        }
      }

      console.log('🎯 All biomarkers processed successfully')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Processing completion handled successfully',
        analytics_id,
        status,
        biomarkers_processed: biomarkers?.length || 0
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in analytics-processing-complete:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error handling processing completion'
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
