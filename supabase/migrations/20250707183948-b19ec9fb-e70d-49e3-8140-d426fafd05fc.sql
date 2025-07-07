-- Create specialized action plan tables for different categories

-- Foods action plans
CREATE TABLE public.report_action_plans_foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Food-specific fields
  diet_type TEXT, -- e.g., "mediterranean", "ketogenic", "anti-inflammatory"
  meal_timing TEXT, -- e.g., "before 8pm", "16:8 intermittent fasting"
  foods_to_add TEXT[], -- array of foods to include
  foods_to_avoid TEXT[], -- array of foods to eliminate
  portion_guidelines TEXT,
  preparation_notes TEXT,
  
  CONSTRAINT report_action_plans_foods_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT report_action_plans_foods_report_id_fkey 
    FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT report_action_plans_foods_form_id_fkey 
    FOREIGN KEY (form_id) REFERENCES public.patient_forms(id)
);

-- Lifestyle action plans
CREATE TABLE public.report_action_plans_lifestyle (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Lifestyle-specific fields
  habit_type TEXT, -- e.g., "sleep", "stress_management", "morning_routine"
  frequency TEXT, -- e.g., "daily", "3x week", "as needed"
  timing TEXT, -- e.g., "morning", "before bed", "after meals"
  duration TEXT, -- e.g., "10 minutes", "30 minutes", "until habit formed"
  specific_actions TEXT[], -- array of specific actions
  triggers TEXT[], -- environmental or time triggers
  tracking_method TEXT, -- how to track progress
  
  CONSTRAINT report_action_plans_lifestyle_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT report_action_plans_lifestyle_report_id_fkey 
    FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT report_action_plans_lifestyle_form_id_fkey 
    FOREIGN KEY (form_id) REFERENCES public.patient_forms(id)
);

-- Activity/Exercise action plans
CREATE TABLE public.report_action_plans_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Activity-specific fields
  activity_type TEXT, -- e.g., "strength_training", "cardio", "hiit", "walking"
  frequency_per_week INTEGER, -- number of sessions per week
  session_duration TEXT, -- e.g., "45-60 min", "20-25 min"
  intensity_level TEXT, -- e.g., "moderate", "high", "low"
  specific_exercises TEXT[], -- array of exercises
  progression_plan TEXT, -- how to advance
  equipment_needed TEXT[], -- required equipment
  rest_periods TEXT, -- rest between sets/sessions
  
  CONSTRAINT report_action_plans_activity_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT report_action_plans_activity_report_id_fkey 
    FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT report_action_plans_activity_form_id_fkey 
    FOREIGN KEY (form_id) REFERENCES public.patient_forms(id)
);

-- Supplements action plans (enhanced from existing structure)
CREATE TABLE public.report_action_plans_supplements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Supplement-specific fields
  supplement_name TEXT NOT NULL,
  dosage TEXT NOT NULL, -- e.g., "500mg", "2 capsules"
  frequency TEXT NOT NULL, -- e.g., "twice daily", "with meals"
  timing TEXT, -- e.g., "morning", "with food", "empty stomach"
  duration TEXT, -- e.g., "3 months", "ongoing", "until retest"
  brand_recommendations TEXT[],
  contraindications TEXT[],
  monitoring_notes TEXT,
  
  CONSTRAINT report_action_plans_supplements_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT report_action_plans_supplements_report_id_fkey 
    FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT report_action_plans_supplements_form_id_fkey 
    FOREIGN KEY (form_id) REFERENCES public.patient_forms(id)
);

-- Therapy action plans
CREATE TABLE public.report_action_plans_therapy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Therapy-specific fields
  therapy_type TEXT NOT NULL, -- e.g., "hormone_replacement", "IV_therapy", "red_light"
  protocol TEXT, -- specific protocol or approach
  frequency TEXT, -- how often
  duration TEXT, -- total treatment duration
  provider_type TEXT, -- type of provider needed
  monitoring_requirements TEXT[],
  expected_outcomes TEXT[],
  precautions TEXT[],
  
  CONSTRAINT report_action_plans_therapy_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT report_action_plans_therapy_report_id_fkey 
    FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT report_action_plans_therapy_form_id_fkey 
    FOREIGN KEY (form_id) REFERENCES public.patient_forms(id)
);

-- Follow-up action plans
CREATE TABLE public.report_action_plans_followup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Follow-up specific fields
  followup_type TEXT NOT NULL, -- e.g., "lab_retest", "appointment", "progress_check"
  timeline TEXT NOT NULL, -- e.g., "6 weeks", "3 months", "before next cycle"
  specific_tests TEXT[], -- biomarkers or tests to repeat
  success_metrics TEXT[], -- what to measure for success
  provider_type TEXT, -- who should handle follow-up
  preparation_required TEXT[], -- what patient needs to do to prepare
  escalation_criteria TEXT[], -- when to seek immediate attention
  
  CONSTRAINT report_action_plans_followup_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT report_action_plans_followup_report_id_fkey 
    FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT report_action_plans_followup_form_id_fkey 
    FOREIGN KEY (form_id) REFERENCES public.patient_forms(id)
);

-- Create indexes for better performance
CREATE INDEX idx_report_action_plans_foods_report_id ON public.report_action_plans_foods(report_id);
CREATE INDEX idx_report_action_plans_foods_form_id ON public.report_action_plans_foods(form_id);

CREATE INDEX idx_report_action_plans_lifestyle_report_id ON public.report_action_plans_lifestyle(report_id);
CREATE INDEX idx_report_action_plans_lifestyle_form_id ON public.report_action_plans_lifestyle(form_id);

CREATE INDEX idx_report_action_plans_activity_report_id ON public.report_action_plans_activity(report_id);
CREATE INDEX idx_report_action_plans_activity_form_id ON public.report_action_plans_activity(form_id);

CREATE INDEX idx_report_action_plans_supplements_report_id ON public.report_action_plans_supplements(report_id);
CREATE INDEX idx_report_action_plans_supplements_form_id ON public.report_action_plans_supplements(form_id);

CREATE INDEX idx_report_action_plans_therapy_report_id ON public.report_action_plans_therapy(report_id);
CREATE INDEX idx_report_action_plans_therapy_form_id ON public.report_action_plans_therapy(form_id);

CREATE INDEX idx_report_action_plans_followup_report_id ON public.report_action_plans_followup(report_id);
CREATE INDEX idx_report_action_plans_followup_form_id ON public.report_action_plans_followup(form_id);

-- Enable RLS on all new tables
ALTER TABLE public.report_action_plans_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_action_plans_lifestyle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_action_plans_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_action_plans_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_action_plans_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_action_plans_followup ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables (allowing all operations for now)
CREATE POLICY "Allow all operations on report_action_plans_foods" ON public.report_action_plans_foods
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on report_action_plans_lifestyle" ON public.report_action_plans_lifestyle
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on report_action_plans_activity" ON public.report_action_plans_activity
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on report_action_plans_supplements" ON public.report_action_plans_supplements
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on report_action_plans_therapy" ON public.report_action_plans_therapy
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on report_action_plans_followup" ON public.report_action_plans_followup
FOR ALL USING (true) WITH CHECK (true);