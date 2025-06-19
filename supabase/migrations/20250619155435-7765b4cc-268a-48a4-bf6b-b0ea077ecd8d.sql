
-- Drop the existing check constraint that's preventing activity and therapy categories
ALTER TABLE public.report_action_plans DROP CONSTRAINT IF EXISTS report_action_plans_category_check;

-- Add a new check constraint that includes all six categories
ALTER TABLE public.report_action_plans ADD CONSTRAINT report_action_plans_category_check 
CHECK (category IN ('foods', 'supplements', 'lifestyle', 'activity', 'therapy', 'followup'));
