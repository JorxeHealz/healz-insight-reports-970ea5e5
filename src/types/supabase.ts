
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          created_at: string
          first_name: string
          last_name: string
          email: string
          age: number
          gender: string
        }
        Insert: {
          id?: string
          created_at?: string
          first_name: string
          last_name: string
          email: string
          age: number
          gender: string
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string
          last_name?: string
          email?: string
          age?: number
          gender?: string
        }
      }
      biomarkers: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          type: string
          value: number
          unit: string
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          type: string
          value: number
          unit: string
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          type?: string
          value?: number
          unit?: string
          date?: string
        }
      }
      questionnaire_answers: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          question_id: string
          answer: string | number
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          question_id: string
          answer: string | number
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          question_id?: string
          answer?: string | number
          date?: string
        }
      }
      reports: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          diagnosis: Json
          pdf_url: string | null
          doctor_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          diagnosis: Json
          pdf_url?: string | null
          doctor_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          diagnosis?: Json
          pdf_url?: string | null
          doctor_id?: string | null
        }
      }
    }
    Views: {
      patient_snapshot: {
        Row: {
          patient_id: string
          biomarker_type: string
          latest_value: number
          unit: string
          latest_date: string
        }
      }
    }
    Functions: {
      generate_diagnosis: {
        Args: { patient_id: string }
        Returns: Json
      }
    }
  }
}

export type Patient = Database['public']['Tables']['patients']['Row']
export type Biomarker = Database['public']['Tables']['biomarkers']['Row']
export type QuestionnaireAnswer = Database['public']['Tables']['questionnaire_answers']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type PatientSnapshot = Database['public']['Views']['patient_snapshot']['Row']

export type Diagnosis = {
  vitalityScore: number;     // 0-100
  riskScore: number;         // 0-100
  riskProfile: Record<
    "cardio"|"mental"|"adrenal"|"metabolic",
    "low"|"medium"|"high"
  >;
  summary: string;           // 3-5 líneas markdown
}
