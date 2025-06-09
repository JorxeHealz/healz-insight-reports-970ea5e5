
export async function callN8nWebhook(formId: string): Promise<void> {
  try {
    console.log(`Calling n8n webhook for form_id: ${formId}`);
    
    const webhookResponse = await fetch('https://joinhealz.app.n8n.cloud/webhook-test/formulario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_id: formId
      }),
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });

    if (webhookResponse.ok) {
      const responseText = await webhookResponse.text();
      console.log(`n8n webhook successful for form_id ${formId}:`, responseText);
    } else {
      console.error(`n8n webhook failed for form_id ${formId}. Status: ${webhookResponse.status}`);
    }
  } catch (webhookError) {
    console.error(`Error calling n8n webhook for form_id ${formId}:`, webhookError);
    // Don't fail the main process if webhook fails
  }
}
