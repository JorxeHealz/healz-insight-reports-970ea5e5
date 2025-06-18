export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          patient_id: string
          type: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          patient_id: string
          type: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          patient_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      biomarkers: {
        Row: {
          category: string
          conventional_max: number
          conventional_min: number
          created_at: string
          description: string | null
          id: string
          name: string
          optimal_max: number
          optimal_min: number
          panel: string[] | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          conventional_max?: number
          conventional_min?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          optimal_max?: number
          optimal_min?: number
          panel?: string[] | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          conventional_max?: number
          conventional_min?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          optimal_max?: number
          optimal_min?: number
          panel?: string[] | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          id: string
          mood: number | null
          notes: string | null
          patient_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          mood?: number | null
          notes?: string | null
          patient_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          mood?: number | null
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      form_files: {
        Row: {
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          form_id: string
          id: string
          patient_id: string
          upload_date: string
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          form_id: string
          id?: string
          patient_id: string
          upload_date?: string
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          form_id?: string
          id?: string
          patient_id?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_files_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_files_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      form_questions: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          options: Json | null
          order_number: number
          question_text: string
          question_type: string
          required: boolean
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json | null
          order_number: number
          question_text: string
          question_type: string
          required?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json | null
          order_number?: number
          question_text?: string
          question_type?: string
          required?: boolean
        }
        Relationships: []
      }
      patient_assignments: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_biomarkers: {
        Row: {
          biomarker_id: string
          created_at: string
          created_by: string | null
          date: string
          form_id: string | null
          id: string
          is_out_of_range: boolean
          notes: string | null
          patient_id: string
          report_id: string | null
          trend: Database["public"]["Enums"]["trend"] | null
          value: number
        }
        Insert: {
          biomarker_id: string
          created_at?: string
          created_by?: string | null
          date?: string
          form_id?: string | null
          id?: string
          is_out_of_range?: boolean
          notes?: string | null
          patient_id: string
          report_id?: string | null
          trend?: Database["public"]["Enums"]["trend"] | null
          value: number
        }
        Update: {
          biomarker_id?: string
          created_at?: string
          created_by?: string | null
          date?: string
          form_id?: string | null
          id?: string
          is_out_of_range?: boolean
          notes?: string | null
          patient_id?: string
          report_id?: string | null
          trend?: Database["public"]["Enums"]["trend"] | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_biomarkers_biomarker_id_fkey"
            columns: ["biomarker_id"]
            isOneToOne: false
            referencedRelation: "biomarkers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_biomarkers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_biomarkers_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_biomarkers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_biomarkers_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_forms: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          expires_at: string
          form_token: string
          id: string
          notes: string | null
          patient_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string
          form_token: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string
          form_token?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_forms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          last_name: string
          last_visit: string | null
          next_visit: string | null
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["patient_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          last_name: string
          last_visit?: string | null
          next_visit?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          last_name?: string
          last_visit?: string | null
          next_visit?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
          updated_at?: string
        }
        Relationships: []
      }
      processing_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          form_id: string
          id: string
          n8n_execution_id: string | null
          patient_id: string
          retry_count: number | null
          started_at: string | null
          status: string
          webhook_url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          form_id: string
          id?: string
          n8n_execution_id?: string | null
          patient_id: string
          retry_count?: number | null
          started_at?: string | null
          status?: string
          webhook_url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          form_id?: string
          id?: string
          n8n_execution_id?: string | null
          patient_id?: string
          retry_count?: number | null
          started_at?: string | null
          status?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processing_queue_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processing_queue_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_answers: {
        Row: {
          answer: string | null
          answer_type: string | null
          created_at: string
          date: string
          file_url: string | null
          form_id: string | null
          id: string
          patient_id: string
          question_id: string
        }
        Insert: {
          answer?: string | null
          answer_type?: string | null
          created_at?: string
          date?: string
          file_url?: string | null
          form_id?: string | null
          id?: string
          patient_id: string
          question_id: string
        }
        Update: {
          answer?: string | null
          answer_type?: string | null
          created_at?: string
          date?: string
          file_url?: string | null
          form_id?: string | null
          id?: string
          patient_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_answers_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_answers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      report_action_plans: {
        Row: {
          category: string
          created_at: string
          description: string
          dosage: string | null
          duration: string | null
          form_id: string
          id: string
          priority: string
          report_id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          dosage?: string | null
          duration?: string | null
          form_id: string
          id?: string
          priority?: string
          report_id: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          dosage?: string | null
          duration?: string | null
          form_id?: string
          id?: string
          priority?: string
          report_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_comments: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          criticality_level: string | null
          date: string
          evaluation_score: number | null
          evaluation_type: string | null
          form_id: string
          id: string
          is_auto_generated: boolean | null
          priority: string
          recommendations: Json | null
          report_id: string
          target_id: string | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string
          content: string
          created_at?: string
          criticality_level?: string | null
          date?: string
          evaluation_score?: number | null
          evaluation_type?: string | null
          form_id: string
          id?: string
          is_auto_generated?: boolean | null
          priority?: string
          recommendations?: Json | null
          report_id: string
          target_id?: string | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          criticality_level?: string | null
          date?: string
          evaluation_score?: number | null
          evaluation_type?: string | null
          form_id?: string
          id?: string
          is_auto_generated?: boolean | null
          priority?: string
          recommendations?: Json | null
          report_id?: string
          target_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_comments_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_comments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_risk_profiles: {
        Row: {
          category: string
          created_at: string
          description: string | null
          form_id: string
          id: string
          percentage: number | null
          recommendations: Json | null
          report_id: string
          risk_level: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          form_id: string
          id?: string
          percentage?: number | null
          recommendations?: Json | null
          report_id: string
          risk_level: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          form_id?: string
          id?: string
          percentage?: number | null
          recommendations?: Json | null
          report_id?: string
          risk_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_risk_profiles_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_risk_profiles_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_summary_sections: {
        Row: {
          content: string
          created_at: string
          criticality_level: string | null
          evaluation_score: number | null
          evaluation_type: string | null
          form_id: string
          id: string
          is_auto_generated: boolean | null
          recommendations: Json | null
          report_id: string
          section_type: string
          target_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          criticality_level?: string | null
          evaluation_score?: number | null
          evaluation_type?: string | null
          form_id: string
          id?: string
          is_auto_generated?: boolean | null
          recommendations?: Json | null
          report_id: string
          section_type: string
          target_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          criticality_level?: string | null
          evaluation_score?: number | null
          evaluation_type?: string | null
          form_id?: string
          id?: string
          is_auto_generated?: boolean | null
          recommendations?: Json | null
          report_id?: string
          section_type?: string
          target_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          action_plan: Json | null
          created_at: string
          diagnosis: Json
          doctor_id: string | null
          form_id: string | null
          id: string
          manual_notes: string | null
          n8n_generated_at: string | null
          patient_id: string
          pdf_url: string | null
          processing_queue_id: string | null
        }
        Insert: {
          action_plan?: Json | null
          created_at?: string
          diagnosis: Json
          doctor_id?: string | null
          form_id?: string | null
          id?: string
          manual_notes?: string | null
          n8n_generated_at?: string | null
          patient_id: string
          pdf_url?: string | null
          processing_queue_id?: string | null
        }
        Update: {
          action_plan?: Json | null
          created_at?: string
          diagnosis?: Json
          doctor_id?: string | null
          form_id?: string | null
          id?: string
          manual_notes?: string | null
          n8n_generated_at?: string | null
          patient_id?: string
          pdf_url?: string | null
          processing_queue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_processing_queue_id_fkey"
            columns: ["processing_queue_id"]
            isOneToOne: false
            referencedRelation: "processing_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          patient_id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          patient_id: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          patient_id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      patient_snapshot: {
        Row: {
          biomarker_type: string | null
          latest_date: string | null
          latest_value: number | null
          patient_id: string | null
          unit: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_biomarkers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_patient_biomarker: {
        Args: {
          p_patient_id: string
          p_biomarker_id: string
          p_value: number
          p_date?: string
          p_notes?: string
        }
        Returns: string
      }
      find_patient_by_short_id: {
        Args: { short_id: string }
        Returns: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          date_of_birth: string
          gender: string
          status: string
          notes: string
          last_visit: string
          next_visit: string
          created_at: string
          updated_at: string
        }[]
      }
      generate_diagnosis: {
        Args: { patient_id: string }
        Returns: Json
      }
      get_assigned_patients: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          full_name: string
        }[]
      }
      get_biomarker_history: {
        Args: { p_patient_id: string; p_biomarker_id: string; p_limit?: number }
        Returns: {
          id: string
          value: number
          date: string
          is_out_of_range: boolean
          trend: Database["public"]["Enums"]["trend"]
          notes: string
        }[]
      }
      get_patient_biomarkers: {
        Args: {
          p_patient_id?: string
          p_biomarker_id?: string
          p_start_date?: string
          p_end_date?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          patient_id: string
          patient_name: string
          biomarker_id: string
          biomarker_name: string
          value: number
          unit: string
          date: string
          is_out_of_range: boolean
          trend: Database["public"]["Enums"]["trend"]
          reference_min: number
          reference_max: number
          notes: string
          created_at: string
          created_by: string
          creator_name: string
        }[]
      }
      get_report_biomarkers: {
        Args: { p_report_id: string }
        Returns: {
          id: string
          patient_id: string
          biomarker_id: string
          value: number
          date: string
          is_out_of_range: boolean
          trend: Database["public"]["Enums"]["trend"]
          notes: string
          created_at: string
          created_by: string
          form_id: string
          report_id: string
          biomarker_name: string
          unit: string
          description: string
          category: string
          panel: string[]
          conventional_min: number
          conventional_max: number
          optimal_min: number
          optimal_max: number
          biomarker_created_at: string
          biomarker_updated_at: string
        }[]
      }
      is_admin_or_coach: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      verify_biomarker_ranges: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          issue: string
        }[]
      }
    }
    Enums: {
      gender: "male" | "female" | "other"
      patient_status: "active" | "inactive" | "pending"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "completed" | "overdue"
      trend: "increasing" | "decreasing" | "stable"
      user_role: "admin" | "coach" | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender: ["male", "female", "other"],
      patient_status: ["active", "inactive", "pending"],
      task_priority: ["low", "medium", "high"],
      task_status: ["pending", "completed", "overdue"],
      trend: ["increasing", "decreasing", "stable"],
      user_role: ["admin", "coach", "support"],
    },
  },
} as const
