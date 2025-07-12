-- FASE 1: Ajustar tabla reports - añadir campos faltantes
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS average_risk integer,
ADD COLUMN IF NOT EXISTS diagnosis_date timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS status text DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS critical_biomarkers jsonb DEFAULT '[]'::jsonb;

-- FASE 2: Reestructurar report_risk_profiles - añadir patient_id y cambiar estructura
ALTER TABLE public.report_risk_profiles 
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- Eliminar columnas específicas de categorías y usar structure general
ALTER TABLE public.report_risk_profiles 
DROP COLUMN IF EXISTS percentage,
ADD COLUMN IF NOT EXISTS percentage integer,
ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'medium';

-- FASE 3: Añadir patient_id a todas las tablas que lo necesiten

-- report_comments
ALTER TABLE public.report_comments 
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_key_findings  
ALTER TABLE public.report_key_findings
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_action_plans_foods
ALTER TABLE public.report_action_plans_foods
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_action_plans_lifestyle
ALTER TABLE public.report_action_plans_lifestyle
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_action_plans_supplements
ALTER TABLE public.report_action_plans_supplements
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_action_plans_activity
ALTER TABLE public.report_action_plans_activity
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_action_plans_followup
ALTER TABLE public.report_action_plans_followup
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- report_action_plans_therapy
ALTER TABLE public.report_action_plans_therapy
ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;

-- FASE 4: Expandir campos específicos por tabla

-- report_comments - añadir campos faltantes del JSON
ALTER TABLE public.report_comments
ADD COLUMN IF NOT EXISTS comment_type text DEFAULT 'clinical',
ADD COLUMN IF NOT EXISTS panel_affected text,
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- report_key_findings - añadir campos faltantes del JSON
ALTER TABLE public.report_key_findings
ADD COLUMN IF NOT EXISTS symptom_connection text,
ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS panel_association text;

-- report_action_plans_foods - añadir todos los campos del JSON
ALTER TABLE public.report_action_plans_foods
ADD COLUMN IF NOT EXISTS dietary_pattern text,
ADD COLUMN IF NOT EXISTS main_goals jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS foods_to_include jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS meal_examples jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS hydration_recommendation text,
ADD COLUMN IF NOT EXISTS special_considerations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- report_action_plans_lifestyle - añadir campos del JSON
ALTER TABLE public.report_action_plans_lifestyle
ADD COLUMN IF NOT EXISTS stress_management_techniques jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS sleep_target_hours text,
ADD COLUMN IF NOT EXISTS sleep_interventions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS daily_routine_recommendations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS environmental_factors jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- report_action_plans_supplements - añadir campos del JSON
ALTER TABLE public.report_action_plans_supplements
ADD COLUMN IF NOT EXISTS immediate_phase_duration text,
ADD COLUMN IF NOT EXISTS total_monthly_cost text,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- report_action_plans_activity - añadir campos del JSON
ALTER TABLE public.report_action_plans_activity
ADD COLUMN IF NOT EXISTS current_capacity text,
ADD COLUMN IF NOT EXISTS phase1_duration text,
ADD COLUMN IF NOT EXISTS phase1_focus text,
ADD COLUMN IF NOT EXISTS restrictions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS monitoring_signals jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- Crear índices para mejorar performance con patient_id
CREATE INDEX IF NOT EXISTS idx_report_comments_patient_id ON public.report_comments(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_key_findings_patient_id ON public.report_key_findings(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_action_plans_foods_patient_id ON public.report_action_plans_foods(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_action_plans_lifestyle_patient_id ON public.report_action_plans_lifestyle(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_action_plans_supplements_patient_id ON public.report_action_plans_supplements(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_action_plans_activity_patient_id ON public.report_action_plans_activity(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_action_plans_followup_patient_id ON public.report_action_plans_followup(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_action_plans_therapy_patient_id ON public.report_action_plans_therapy(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_risk_profiles_patient_id ON public.report_risk_profiles(patient_id);