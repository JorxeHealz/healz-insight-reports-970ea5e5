
export interface FormSubmissionRequest {
  form_token: string;
  answers: Record<string, any>;
  files_data?: Record<string, FileData>;
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  data: string;
}

export interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface AnswerRecord {
  form_id: string;
  patient_id: string;
  question_id: string;
  answer: string;
  answer_type: string;
  date: string;
}
