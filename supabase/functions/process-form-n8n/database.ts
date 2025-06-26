
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
