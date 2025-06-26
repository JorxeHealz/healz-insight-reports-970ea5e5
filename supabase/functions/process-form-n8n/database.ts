
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function getFormData(supabaseClient: any, formId: string) {
  console.log('📊 Step 1: Querying form data...');
  const { data: form, error: formError } = await supabaseClient
    .from('patient_forms')
    .select('*')
    .eq('id', formId)
    .eq('status', 'completed')
    .single();

  if (formError) {
    console.error('❌ Form query error:', JSON.stringify(formError, null, 2));
    throw new Error(`Failed to fetch form data: ${formError.message}`);
  }

  if (!form) {
    console.error('❌ Form not found or not completed');
    throw new Error('Form not found or not completed');
  }

  console.log('✅ Found form:', form.id, 'for patient:', form.patient_id);
  return form;
}

export async function getPatientData(supabaseClient: any, patientId: string) {
  console.log('👤 Step 2: Querying patient data...');
  const { data: patient, error: patientError } = await supabaseClient
    .from('patients')
    .select('id, first_name, last_name, email, gender')
    .eq('id', patientId)
    .single();

  if (patientError) {
    console.error('❌ Patient query error:', JSON.stringify(patientError, null, 2));
    throw new Error(`Failed to fetch patient data: ${patientError.message}`);
  }

  if (!patient) {
    console.error('❌ Patient not found for ID:', patientId);
    throw new Error(`Patient not found: ${patientId}`);
  }

  console.log('✅ Found patient:', `${patient.first_name} ${patient.last_name}`);
  return patient;
}

export async function getPdfUrl(supabaseClient: any, formId: string): Promise<string | null> {
  console.log('📄 Step 3: Querying PDF from Storage for form:', formId);
  
  try {
    // List files in the form's folder within patient-files bucket
    const { data: files, error: listError } = await supabaseClient.storage
      .from('patient-files')
      .list(`${formId}/`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      console.error('⚠️ Error listing files from storage:', JSON.stringify(listError, null, 2));
      return null;
    }

    if (!files || files.length === 0) {
      console.log('ℹ️ No files found in storage for form:', formId);
      return null;
    }

    // Find PDF files
    const pdfFiles = files.filter(file => 
      file.name && file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      console.log('ℹ️ No PDF files found for form:', formId);
      return null;
    }

    // Get the first (most recent) PDF file
    const pdfFile = pdfFiles[0];
    const filePath = `${formId}/${pdfFile.name}`;
    
    console.log('📎 Found PDF file:', pdfFile.name);

    // Generate signed URL for the PDF (valid for 1 hour)
    const { data: signedUrl, error: urlError } = await supabaseClient.storage
      .from('patient-files')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (urlError) {
      console.error('⚠️ Error creating signed URL:', JSON.stringify(urlError, null, 2));
      return null;
    }

    if (signedUrl && signedUrl.signedUrl) {
      console.log('✅ Generated signed PDF URL:', signedUrl.signedUrl);
      return signedUrl.signedUrl;
    } else {
      console.log('ℹ️ No signed URL generated for form:', formId);
      return null;
    }

  } catch (error) {
    console.error('💥 Unexpected error getting PDF URL:', error);
    return null;
  }
}

export async function createQueueEntry(supabaseClient: any, formId: string, patientId: string, webhookUrl: string) {
  console.log('📝 Creating processing queue entry...');
  const { data: queueEntry, error: queueError } = await supabaseClient
    .from('processing_queue')
    .insert({
      form_id: formId,
      patient_id: patientId,
      webhook_url: webhookUrl,
      status: 'pending'
    })
    .select()
    .single();

  if (queueError) {
    console.error('❌ Error creating queue entry:', JSON.stringify(queueError, null, 2));
    throw new Error(`Failed to create processing queue entry: ${queueError.message}`);
  }

  console.log('✅ Created queue entry:', queueEntry.id);
  return queueEntry;
}

export async function updateQueueStatus(supabaseClient: any, queueId: string, status: string, additionalData?: any) {
  const updateData = {
    status,
    ...additionalData
  };

  if (status === 'processing') {
    updateData.started_at = new Date().toISOString();
  } else if (status === 'failed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { error: updateError } = await supabaseClient
    .from('processing_queue')
    .update(updateData)
    .eq('id', queueId);

  if (updateError) {
    console.error(`⚠️ Warning: Could not update queue status to ${status}:`, updateError);
  } else {
    console.log(`✅ Queue status updated to ${status}`);
  }
}

export async function cleanupStuckProcessingEntries(supabaseClient: any) {
  console.log('🧹 Cleaning up stuck processing entries...');
  
  // Mark entries that have been "processing" for more than 30 minutes as failed
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  const { data: stuckEntries, error: selectError } = await supabaseClient
    .from('processing_queue')
    .select('id, form_id')
    .eq('status', 'processing')
    .lt('started_at', thirtyMinutesAgo);

  if (selectError) {
    console.error('⚠️ Error selecting stuck entries:', selectError);
    return;
  }

  if (stuckEntries && stuckEntries.length > 0) {
    console.log(`🔄 Found ${stuckEntries.length} stuck entries to clean up`);
    
    const { error: updateError } = await supabaseClient
      .from('processing_queue')
      .update({
        status: 'failed',
        error_message: 'Processing timeout - cleaned up by system',
        completed_at: new Date().toISOString()
      })
      .eq('status', 'processing')
      .lt('started_at', thirtyMinutesAgo);

    if (updateError) {
      console.error('⚠️ Error cleaning up stuck entries:', updateError);
    } else {
      console.log(`✅ Cleaned up ${stuckEntries.length} stuck processing entries`);
    }
  } else {
    console.log('ℹ️ No stuck processing entries found');
  }
}
