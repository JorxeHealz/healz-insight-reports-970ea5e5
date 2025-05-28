
export interface PatientForm {
  id: string;
  patient_id: string;
  form_token: string;
  status: 'pending' | 'completed' | 'processed' | 'expired';
  created_by?: string;
  created_at: string;
  completed_at?: string;
  expires_at: string;
  notes?: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface FormQuestion {
  id: string;
  question_text: string;
  question_type: 'text' | 'number' | 'select' | 'textarea' | 'file' | 'boolean';
  required: boolean;
  order_number: number;
  options?: string[];
  category: 'symptoms' | 'lifestyle' | 'medical_history' | 'files';
  created_at: string;
  is_active: boolean;
}

export interface FormAnswer {
  id: string;
  form_id: string;
  patient_id: string;
  question_id: string;
  answer: string;
  answer_type: string;
  file_url?: string;
  date: string;
}

export interface FormFile {
  id: string;
  form_id: string;
  patient_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  upload_date: string;
}

export interface ProcessingQueue {
  id: string;
  form_id: string;
  patient_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  webhook_url?: string;
  n8n_execution_id?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;
  created_at: string;
}

export interface FormSubmissionData {
  form_token: string;
  answers: Record<string, any>;
  files?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}
