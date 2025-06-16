
-- Extend report_comments table to support evaluations
ALTER TABLE public.report_comments 
ADD COLUMN evaluation_type TEXT,
ADD COLUMN target_id TEXT,
ADD COLUMN evaluation_score INTEGER,
ADD COLUMN recommendations JSONB,
ADD COLUMN is_auto_generated BOOLEAN DEFAULT false,
ADD COLUMN criticality_level TEXT DEFAULT 'medium';

-- Add check constraints for evaluation types and scores
ALTER TABLE public.report_comments 
ADD CONSTRAINT check_comment_evaluation_type 
CHECK (evaluation_type IS NULL OR evaluation_type IN ('general', 'panel', 'biomarker'));

ALTER TABLE public.report_comments 
ADD CONSTRAINT check_comment_evaluation_score 
CHECK (evaluation_score IS NULL OR (evaluation_score >= 1 AND evaluation_score <= 10));

ALTER TABLE public.report_comments 
ADD CONSTRAINT check_comment_criticality_level 
CHECK (criticality_level IN ('low', 'medium', 'high', 'critical'));

-- Create index for better performance when querying by evaluation type and target
CREATE INDEX idx_report_comments_evaluation 
ON public.report_comments(report_id, evaluation_type, target_id);
