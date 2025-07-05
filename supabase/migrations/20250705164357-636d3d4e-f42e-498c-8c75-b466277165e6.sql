-- Add therapy category and structured_content field to report_action_plans
ALTER TABLE public.report_action_plans 
ADD COLUMN structured_content JSONB DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.report_action_plans.structured_content IS 'Structured content for complex action plans like activity schedules, lifestyle recommendations, etc.';

-- Update any existing constraints if they exist (this is safe if constraint doesn't exist)
DO $$ 
BEGIN
    -- Try to drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'report_action_plans' 
        AND constraint_name LIKE '%category%'
        AND constraint_type = 'CHECK'
    ) THEN
        ALTER TABLE public.report_action_plans DROP CONSTRAINT IF EXISTS report_action_plans_category_check;
    END IF;
    
    -- Add new constraint including therapy
    ALTER TABLE public.report_action_plans 
    ADD CONSTRAINT report_action_plans_category_check 
    CHECK (category IN ('foods', 'supplements', 'lifestyle', 'activity', 'therapy', 'followup'));
END $$;