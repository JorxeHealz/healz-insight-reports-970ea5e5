import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🧹 Starting cleanup-duplicate-biomarkers function')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    // Query to find duplicates: same patient_id, biomarker_id, and analytics_id
    const { data: duplicates, error: duplicatesError } = await supabase
      .from('patient_biomarkers')
      .select(`
        patient_id,
        biomarker_id,
        analytics_id,
        count(*) as duplicate_count
      `)
      .not('analytics_id', 'is', null)
      .group('patient_id, biomarker_id, analytics_id')
      .having('count(*)', 'gt', 1)

    if (duplicatesError) {
      console.error('❌ Error finding duplicates:', duplicatesError)
      throw duplicatesError
    }

    console.log(`🔍 Found ${duplicates?.length || 0} groups of duplicated biomarkers`)

    let totalRemoved = 0

    if (duplicates && duplicates.length > 0) {
      for (const duplicate of duplicates) {
        const { patient_id, biomarker_id, analytics_id, duplicate_count } = duplicate
        
        console.log(`🔍 Processing duplicates for patient ${patient_id}, biomarker ${biomarker_id}, analytics ${analytics_id}: ${duplicate_count} copies`)

        // Get all records for this combination, ordered by created_at DESC
        const { data: records, error: recordsError } = await supabase
          .from('patient_biomarkers')
          .select('id, created_at, value')
          .eq('patient_id', patient_id)
          .eq('biomarker_id', biomarker_id)
          .eq('analytics_id', analytics_id)
          .order('created_at', { ascending: false })

        if (recordsError || !records || records.length === 0) {
          console.error('❌ Error fetching records:', recordsError)
          continue
        }

        // Keep the most recent record (first in array), delete the rest
        const [keepRecord, ...deleteRecords] = records
        console.log(`📌 Keeping most recent record (${keepRecord.created_at}) with value ${keepRecord.value}`)
        console.log(`🗑️ Deleting ${deleteRecords.length} older records`)

        if (deleteRecords.length > 0) {
          const idsToDelete = deleteRecords.map(r => r.id)
          
          const { error: deleteError } = await supabase
            .from('patient_biomarkers')
            .delete()
            .in('id', idsToDelete)

          if (deleteError) {
            console.error('❌ Error deleting duplicates:', deleteError)
            continue
          }

          totalRemoved += deleteRecords.length
          console.log(`✅ Removed ${deleteRecords.length} duplicate records`)
        }
      }
    }

    console.log(`🎯 Cleanup completed. Total duplicate records removed: ${totalRemoved}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Duplicate biomarkers cleanup completed',
        duplicated_groups_found: duplicates?.length || 0,
        total_records_removed: totalRemoved,
        summary: duplicates?.map(d => ({
          patient_id: d.patient_id,
          biomarker_id: d.biomarker_id,
          analytics_id: d.analytics_id,
          had_duplicates: d.duplicate_count
        })) || []
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in cleanup-duplicate-biomarkers:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error cleaning up duplicate biomarkers'
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
