
-- Create table for editable report summary sections
CREATE TABLE public.report_summary_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  form_id UUID NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for report summary sections
ALTER TABLE public.report_summary_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to report summary sections"
  ON public.report_summary_sections
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_report_summary_sections_updated_at
  BEFORE UPDATE ON public.report_summary_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();
