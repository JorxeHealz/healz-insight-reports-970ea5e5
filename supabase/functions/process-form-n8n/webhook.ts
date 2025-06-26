import { MinimalFormData } from './types.ts';

export function buildDynamicWebhookUrl(baseUrl: string | undefined, formId: string): string {
  const baseWebhookUrl = baseUrl || 'https://joinhealz.app.n8n.cloud/webhook';
  
  // Check if the base URL already ends with '/formulario'
  if (baseWebhookUrl.endsWith('/formulario')) {
    return `${baseWebhookUrl}/${formId}`;
  } else {
    return `${baseWebhookUrl}/formulario/${formId}`;
  }
}

export function prepareMinimalData(form: any, patient: any, queueEntry: any): MinimalFormData {
  return {
    form_id: form.id,
    patient: {
      id: patient.id,
      name: `${patient.first_name} ${patient.last_name}`,
      email: patient.email,
      gender: patient.gender || null
    },
    form_token: form.form_token,
    completed_at: form.completed_at,
    created_at: form.created_at,
    processing: {
      queue_id: queueEntry.id
    },
    supabase_config: {
      url: Deno.env.get('SUPABASE_URL') || '',
      service_role_key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      completion_webhook_url: `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/n8n-processing-complete`
    },
    instructions: {
      message: "Use the provided Supabase credentials to extract all form answers and files. Call the completion webhook when done.",
      queries_to_run: [
        "SELECT * FROM questionnaire_answers WHERE form_id = '" + form.id + "'",
        "SELECT * FROM form_files WHERE form_id = '" + form.id + "'",
        "SELECT * FROM form_questions WHERE form_id = '" + form.id + "'"
      ]
    }
  };
}

export async function callN8nWebhook(webhookUrl: string, data: MinimalFormData): Promise<any> {
  console.log(`🌐 Calling n8n webhook with corrected URL: ${webhookUrl}`);
  console.log('📤 Payload size:', JSON.stringify(data).length, 'characters');
  console.log(`🎯 Processing form ID: ${data.form_id} for patient: ${data.patient.name}`);

  const webhookResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  console.log('📡 Webhook response status:', webhookResponse.status);
  console.log('📡 Corrected URL used:', webhookUrl);

  if (!webhookResponse.ok) {
    const errorText = await webhookResponse.text();
    console.error('❌ N8N webhook failed with status:', webhookResponse.status);
    console.error('❌ N8N webhook error response:', errorText);
    console.error('❌ Failed URL:', webhookUrl);
    
    throw new Error(`N8N webhook failed: ${webhookResponse.status} - ${errorText}`);
  }

  let n8nResult;
  try {
    const responseText = await webhookResponse.text();
    console.log('📥 Raw webhook response:', responseText);
    
    if (responseText) {
      n8nResult = JSON.parse(responseText);
      console.log('✅ Parsed n8n response:', JSON.stringify(n8nResult, null, 2));
    } else {
      console.log('ℹ️ Empty response from n8n webhook');
      n8nResult = {};
    }
  } catch (parseError) {
    console.error('⚠️ Could not parse n8n response as JSON:', parseError);
    n8nResult = { raw_response: await webhookResponse.text() };
  }

  return n8nResult;
}
