-- Add status column to reports table
ALTER TABLE public.reports 
ADD COLUMN status TEXT NOT NULL DEFAULT 'processing';

-- Update existing reports to be completed
UPDATE public.reports 
SET status = 'completed' 
WHERE status = 'processing';

-- Add check constraint for valid status values
ALTER TABLE public.reports 
ADD CONSTRAINT valid_status CHECK (status IN ('processing', 'completed', 'failed'));