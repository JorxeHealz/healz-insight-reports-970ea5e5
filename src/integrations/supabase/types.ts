export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      appointments: {
        Row: {
          appointment_type: string
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          meeting_url: string | null
          notes: string | null
          patient_id: string
          professional_id: string
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          appointment_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          meeting_url?: string | null
          notes?: string | null
          patient_id: string
          professional_id: string
          start_time: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          meeting_url?: string | null
          notes?: string | null
          patient_id?: string
          professional_id?: string
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      biomakers_pdf_not_found: {
        Row: {
          created_at: string
          id: number
          name_original: string | null
          unit: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name_original?: string | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name_original?: string | null
          unit?: string | null
          value?: number | null
        }
        Relationships: []
      }
      biomarkers: {
        Row: {
          aliases: string[] | null
          category: string[]
          conventional_max: number
          conventional_min: number
          created_at: string
          description: string | null
          id: string
          name: string
          optimal_max: number
          optimal_min: number
          unit: string
          updated_at: string
        }
        Insert: {
          aliases?: string[] | null
          category?: string[]
          conventional_max?: number
          conventional_min?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          optimal_max?: number
          optimal_min?: number
          unit: string
          updated_at?: string
        }
        Update: {
          aliases?: string[] | null
          category?: string[]
          conventional_max?: number
          conventional_min?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          optimal_max?: number
          optimal_min?: number
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
      patient_analytics: {
        Row: {
          created_at: string
          created_by: string | null
          extract_pdf: string | null
          file_name: string
          file_url: string
          id: string
          notes: string | null
          patient_id: string
          status: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          extract_pdf?: string | null
          file_name: string
          file_url: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          extract_pdf?: string | null
          file_name?: string
          file_url?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_analytics_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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
          analytics_id: string | null
          biomarker_id: string
          created_at: string
          created_by: string | null
          date: string
          id: string
          patient_id: string
          value: number
        }
        Insert: {
          analytics_id?: string | null
          biomarker_id: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          patient_id: string
          value: number
        }
        Update: {
          analytics_id?: string | null
          biomarker_id?: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          patient_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_biomarkers_analytics_id_fkey"
            columns: ["analytics_id"]
            isOneToOne: false
            referencedRelation: "patient_analytics"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "patient_biomarkers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      professional_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          professional_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          professional_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          professional_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "questionnaire_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "form_questions"
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
          report_id: string | null
          structured_content: Json | null
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
          report_id?: string | null
          structured_content?: Json | null
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
          report_id?: string | null
          structured_content?: Json | null
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
      report_action_plans_activity: {
        Row: {
          active: boolean | null
          activity_type: string | null
          created_at: string
          current_capacity: string | null
          equipment_needed: string[] | null
          form_id: string
          frequency_per_week: string
          id: string
          intensity_level: string | null
          monitoring_signals: Json | null
          patient_id: string | null
          phase1_duration: string | null
          phase1_focus: string | null
          priority: string
          progression_plan: string | null
          report_id: string | null
          rest_periods: string | null
          restrictions: Json | null
          session_duration: string | null
          specific_exercises: string[] | null
        }
        Insert: {
          active?: boolean | null
          activity_type?: string | null
          created_at?: string
          current_capacity?: string | null
          equipment_needed?: string[] | null
          form_id: string
          frequency_per_week: string
          id?: string
          intensity_level?: string | null
          monitoring_signals?: Json | null
          patient_id?: string | null
          phase1_duration?: string | null
          phase1_focus?: string | null
          priority?: string
          progression_plan?: string | null
          report_id?: string | null
          rest_periods?: string | null
          restrictions?: Json | null
          session_duration?: string | null
          specific_exercises?: string[] | null
        }
        Update: {
          active?: boolean | null
          activity_type?: string | null
          created_at?: string
          current_capacity?: string | null
          equipment_needed?: string[] | null
          form_id?: string
          frequency_per_week?: string
          id?: string
          intensity_level?: string | null
          monitoring_signals?: Json | null
          patient_id?: string | null
          phase1_duration?: string | null
          phase1_focus?: string | null
          priority?: string
          progression_plan?: string | null
          report_id?: string | null
          rest_periods?: string | null
          restrictions?: Json | null
          session_duration?: string | null
          specific_exercises?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_activity_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_activity_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_activity_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_action_plans_followup: {
        Row: {
          created_at: string
          escalation_criteria: string[] | null
          followup_type: string
          form_id: string
          id: string
          patient_id: string | null
          preparation_required: string[] | null
          priority: string
          provider_type: string | null
          report_id: string | null
          specific_tests: string[] | null
          success_metrics: string[] | null
          timeline: string
        }
        Insert: {
          created_at?: string
          escalation_criteria?: string[] | null
          followup_type: string
          form_id: string
          id?: string
          patient_id?: string | null
          preparation_required?: string[] | null
          priority?: string
          provider_type?: string | null
          report_id?: string | null
          specific_tests?: string[] | null
          success_metrics?: string[] | null
          timeline: string
        }
        Update: {
          created_at?: string
          escalation_criteria?: string[] | null
          followup_type?: string
          form_id?: string
          id?: string
          patient_id?: string | null
          preparation_required?: string[] | null
          priority?: string
          provider_type?: string | null
          report_id?: string | null
          specific_tests?: string[] | null
          success_metrics?: string[] | null
          timeline?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_followup_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_followup_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_followup_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_action_plans_foods: {
        Row: {
          active: boolean | null
          created_at: string
          diet_type: string | null
          dietary_pattern: string | null
          foods_to_add: string[] | null
          foods_to_avoid: string[] | null
          foods_to_include: Json | null
          form_id: string
          hydration_recommendation: string | null
          id: string
          main_goals: Json | null
          meal_examples: Json | null
          meal_timing: string | null
          patient_id: string | null
          portion_guidelines: string | null
          preparation_notes: string | null
          priority: string
          report_id: string | null
          special_considerations: Json | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          diet_type?: string | null
          dietary_pattern?: string | null
          foods_to_add?: string[] | null
          foods_to_avoid?: string[] | null
          foods_to_include?: Json | null
          form_id: string
          hydration_recommendation?: string | null
          id?: string
          main_goals?: Json | null
          meal_examples?: Json | null
          meal_timing?: string | null
          patient_id?: string | null
          portion_guidelines?: string | null
          preparation_notes?: string | null
          priority?: string
          report_id?: string | null
          special_considerations?: Json | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          diet_type?: string | null
          dietary_pattern?: string | null
          foods_to_add?: string[] | null
          foods_to_avoid?: string[] | null
          foods_to_include?: Json | null
          form_id?: string
          hydration_recommendation?: string | null
          id?: string
          main_goals?: Json | null
          meal_examples?: Json | null
          meal_timing?: string | null
          patient_id?: string | null
          portion_guidelines?: string | null
          preparation_notes?: string | null
          priority?: string
          report_id?: string | null
          special_considerations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_foods_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_foods_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_foods_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_action_plans_lifestyle: {
        Row: {
          active: boolean | null
          created_at: string
          daily_routine_recommendations: Json | null
          duration: string | null
          environmental_factors: Json | null
          form_id: string
          frequency: string | null
          habit_type: string | null
          id: string
          patient_id: string | null
          priority: string
          report_id: string | null
          sleep_interventions: Json | null
          sleep_target_hours: string | null
          specific_actions: string[] | null
          stress_management_techniques: Json | null
          timing: string | null
          tracking_method: string | null
          triggers: string[] | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          daily_routine_recommendations?: Json | null
          duration?: string | null
          environmental_factors?: Json | null
          form_id: string
          frequency?: string | null
          habit_type?: string | null
          id?: string
          patient_id?: string | null
          priority?: string
          report_id?: string | null
          sleep_interventions?: Json | null
          sleep_target_hours?: string | null
          specific_actions?: string[] | null
          stress_management_techniques?: Json | null
          timing?: string | null
          tracking_method?: string | null
          triggers?: string[] | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          daily_routine_recommendations?: Json | null
          duration?: string | null
          environmental_factors?: Json | null
          form_id?: string
          frequency?: string | null
          habit_type?: string | null
          id?: string
          patient_id?: string | null
          priority?: string
          report_id?: string | null
          sleep_interventions?: Json | null
          sleep_target_hours?: string | null
          specific_actions?: string[] | null
          stress_management_techniques?: Json | null
          timing?: string | null
          tracking_method?: string | null
          triggers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_lifestyle_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_lifestyle_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_lifestyle_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_action_plans_supplements: {
        Row: {
          active: boolean | null
          brand_recommendations: string[] | null
          contraindications: string[] | null
          created_at: string
          dosage: string
          duration: string | null
          form_id: string
          frequency: string | null
          id: string
          immediate_phase_duration: string | null
          monitoring_notes: string | null
          patient_id: string | null
          priority: string
          reason: string | null
          report_id: string | null
          supplement_name: string
          timing: string | null
          total_monthly_cost: string | null
        }
        Insert: {
          active?: boolean | null
          brand_recommendations?: string[] | null
          contraindications?: string[] | null
          created_at?: string
          dosage: string
          duration?: string | null
          form_id: string
          frequency?: string | null
          id?: string
          immediate_phase_duration?: string | null
          monitoring_notes?: string | null
          patient_id?: string | null
          priority?: string
          reason?: string | null
          report_id?: string | null
          supplement_name: string
          timing?: string | null
          total_monthly_cost?: string | null
        }
        Update: {
          active?: boolean | null
          brand_recommendations?: string[] | null
          contraindications?: string[] | null
          created_at?: string
          dosage?: string
          duration?: string | null
          form_id?: string
          frequency?: string | null
          id?: string
          immediate_phase_duration?: string | null
          monitoring_notes?: string | null
          patient_id?: string | null
          priority?: string
          reason?: string | null
          report_id?: string | null
          supplement_name?: string
          timing?: string | null
          total_monthly_cost?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_supplements_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_supplements_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_supplements_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_action_plans_therapy: {
        Row: {
          created_at: string
          duration: string | null
          expected_outcomes: string[] | null
          form_id: string
          frequency: string | null
          id: string
          monitoring_requirements: string[] | null
          patient_id: string | null
          precautions: string[] | null
          priority: string
          protocol: string | null
          provider_type: string | null
          report_id: string
          therapy_type: string
        }
        Insert: {
          created_at?: string
          duration?: string | null
          expected_outcomes?: string[] | null
          form_id: string
          frequency?: string | null
          id?: string
          monitoring_requirements?: string[] | null
          patient_id?: string | null
          precautions?: string[] | null
          priority?: string
          protocol?: string | null
          provider_type?: string | null
          report_id: string
          therapy_type: string
        }
        Update: {
          created_at?: string
          duration?: string | null
          expected_outcomes?: string[] | null
          form_id?: string
          frequency?: string | null
          id?: string
          monitoring_requirements?: string[] | null
          patient_id?: string | null
          precautions?: string[] | null
          priority?: string
          protocol?: string | null
          provider_type?: string | null
          report_id?: string
          therapy_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_action_plans_therapy_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "patient_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_therapy_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_action_plans_therapy_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_comments: {
        Row: {
          action_steps: string | null
          author: string | null
          category: string
          comment_type: string | null
          content: string
          created_at: string
          criticality_level: string | null
          date: string
          evaluation_score: number | null
          evaluation_type: string | null
          expected_timeline: string | null
          form_id: string
          id: string
          is_auto_generated: boolean | null
          order_index: number | null
          panel_affected: string | null
          patient_friendly_content: string | null
          patient_id: string | null
          priority: string
          recommendations: Json | null
          report_id: string | null
          target_id: string | null
          technical_details: string | null
          title: string
          warning_signs: string | null
        }
        Insert: {
          action_steps?: string | null
          author?: string | null
          category?: string
          comment_type?: string | null
          content: string
          created_at?: string
          criticality_level?: string | null
          date?: string
          evaluation_score?: number | null
          evaluation_type?: string | null
          expected_timeline?: string | null
          form_id: string
          id?: string
          is_auto_generated?: boolean | null
          order_index?: number | null
          panel_affected?: string | null
          patient_friendly_content?: string | null
          patient_id?: string | null
          priority?: string
          recommendations?: Json | null
          report_id?: string | null
          target_id?: string | null
          technical_details?: string | null
          title: string
          warning_signs?: string | null
        }
        Update: {
          action_steps?: string | null
          author?: string | null
          category?: string
          comment_type?: string | null
          content?: string
          created_at?: string
          criticality_level?: string | null
          date?: string
          evaluation_score?: number | null
          evaluation_type?: string | null
          expected_timeline?: string | null
          form_id?: string
          id?: string
          is_auto_generated?: boolean | null
          order_index?: number | null
          panel_affected?: string | null
          patient_friendly_content?: string | null
          patient_id?: string | null
          priority?: string
          recommendations?: Json | null
          report_id?: string | null
          target_id?: string | null
          technical_details?: string | null
          title?: string
          warning_signs?: string | null
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
            foreignKeyName: "report_comments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      report_key_findings: {
        Row: {
          body_impact: string | null
          category: string | null
          created_at: string | null
          finding: string
          form_id: string | null
          id: string
          impact: string | null
          order_index: number | null
          panel_association: string | null
          patient_explanation: string | null
          patient_id: string | null
          related_biomarkers: Json[] | null
          report_id: string | null
          symptom_connection: string | null
          updated_at: string | null
          urgency: string | null
          why_it_matters: string | null
        }
        Insert: {
          body_impact?: string | null
          category?: string | null
          created_at?: string | null
          finding: string
          form_id?: string | null
          id?: string
          impact?: string | null
          order_index?: number | null
          panel_association?: string | null
          patient_explanation?: string | null
          patient_id?: string | null
          related_biomarkers?: Json[] | null
          report_id?: string | null
          symptom_connection?: string | null
          updated_at?: string | null
          urgency?: string | null
          why_it_matters?: string | null
        }
        Update: {
          body_impact?: string | null
          category?: string | null
          created_at?: string | null
          finding?: string
          form_id?: string | null
          id?: string
          impact?: string | null
          order_index?: number | null
          panel_association?: string | null
          patient_explanation?: string | null
          patient_id?: string | null
          related_biomarkers?: Json[] | null
          report_id?: string | null
          symptom_connection?: string | null
          updated_at?: string | null
          urgency?: string | null
          why_it_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_key_findings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_key_findings_report_id_fkey"
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
          patient_id: string | null
          percentage: number | null
          recommendations: Json | null
          report_id: string | null
          risk_level: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          form_id: string
          id?: string
          patient_id?: string | null
          percentage?: number | null
          recommendations?: Json | null
          report_id?: string | null
          risk_level: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          form_id?: string
          id?: string
          patient_id?: string | null
          percentage?: number | null
          recommendations?: Json | null
          report_id?: string | null
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
            foreignKeyName: "report_risk_profiles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
          report_id: string | null
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
          report_id?: string | null
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
          report_id?: string | null
          section_type?: string
          target_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          analytics_id: string | null
          average_risk: number | null
          created_at: string
          critical_biomarkers: Json | null
          diagnosis: Json
          diagnosis_date: string | null
          doctor_id: string | null
          form_id: string | null
          id: string
          manual_notes: string | null
          n8n_generated_at: string | null
          patient_id: string
          pdf_url: string | null
          personalized_insights: Json | null
          processing_queue_id: string | null
          risk_profile: Json | null
          risk_score: number | null
          status: string | null
          summary: string | null
          vitality_score: number | null
        }
        Insert: {
          analytics_id?: string | null
          average_risk?: number | null
          created_at?: string
          critical_biomarkers?: Json | null
          diagnosis: Json
          diagnosis_date?: string | null
          doctor_id?: string | null
          form_id?: string | null
          id?: string
          manual_notes?: string | null
          n8n_generated_at?: string | null
          patient_id: string
          pdf_url?: string | null
          personalized_insights?: Json | null
          processing_queue_id?: string | null
          risk_profile?: Json | null
          risk_score?: number | null
          status?: string | null
          summary?: string | null
          vitality_score?: number | null
        }
        Update: {
          analytics_id?: string | null
          average_risk?: number | null
          created_at?: string
          critical_biomarkers?: Json | null
          diagnosis?: Json
          diagnosis_date?: string | null
          doctor_id?: string | null
          form_id?: string | null
          id?: string
          manual_notes?: string | null
          n8n_generated_at?: string | null
          patient_id?: string
          pdf_url?: string | null
          personalized_insights?: Json | null
          processing_queue_id?: string | null
          risk_profile?: Json | null
          risk_score?: number | null
          status?: string | null
          summary?: string | null
          vitality_score?: number | null
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
      create_patient_biomarker_with_analytics: {
        Args: {
          p_patient_id: string
          p_biomarker_id: string
          p_value: number
          p_analytics_id: string
          p_date: string
        }
        Returns: string
      }
      delete_patient_biomarker: {
        Args: { p_id: string }
        Returns: boolean
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
      get_patient_biomarkers_by_analytics: {
        Args: { p_patient_id: string; p_analytics_id: string }
        Returns: {
          id: string
          patient_id: string
          biomarker_id: string
          value: number
          date: string
          created_at: string
          created_by: string
          analytics_id: string
          biomarker_name: string
          unit: string
          description: string
          category: string[]
          conventional_min: number
          conventional_max: number
          optimal_min: number
          optimal_max: number
          biomarker_created_at: string
          biomarker_updated_at: string
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
          created_at: string
          created_by: string
          analytics_id: string
          biomarker_name: string
          unit: string
          description: string
          category: string[]
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
      update_patient_biomarker_value: {
        Args: { p_id: string; p_value: number }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
