
export interface ProcessFormRequest {
  form_id: string;
  n8n_webhook_url?: string;
}

export interface MinimalFormData {
  form_id: string;
  patient: {
    id: string;
    name: string;
    email: string;
    gender: string | null;
  };
  form_token: string;
  completed_at: string;
  created_at: string;
  processing: {
    queue_id: string;
  };
  supabase_config: {
    url: string;
    service_role_key: string;
    completion_webhook_url: string;
  };
  instructions: {
    message: string;
    queries_to_run: string[];
  };
}

export interface QueueEntry {
  id: string;
  form_id: string;
  patient_id: string;
  webhook_url: string;
  status: string;
}
