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
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other'
          status: 'active' | 'inactive' | 'pending'
          notes: string | null
          last_visit: string | null
          next_visit: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          date_of_birth?: string | null
          gender: 'male' | 'female' | 'other'
          status?: 'active' | 'inactive' | 'pending'
          notes?: string | null
          last_visit?: string | null
          next_visit?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other'
          status?: 'active' | 'inactive' | 'pending'
          notes?: string | null
          last_visit?: string | null
          next_visit?: string | null
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
    "hormonas"|"vitalidad"|"riesgo_cardiaco"|"perdida_peso"|"fuerza"|"salud_cerebral"|"salud_sexual"|"longevidad",
    "low"|"medium"|"high"
  >;
  summary: string;           // 3-5 líneas markdown
}
