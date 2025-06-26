
-- Update the get_report_biomarkers function to return category as text[] instead of text
DROP FUNCTION IF EXISTS public.get_report_biomarkers(uuid);

CREATE OR REPLACE FUNCTION public.get_report_biomarkers(p_report_id uuid)
 RETURNS TABLE(
   id uuid, 
   patient_id uuid, 
   biomarker_id uuid, 
   value numeric, 
   date timestamp with time zone, 
   is_out_of_range boolean, 
   trend trend, 
   notes text, 
   created_at timestamp with time zone, 
   created_by uuid, 
   form_id uuid, 
   report_id uuid, 
   biomarker_name text, 
   unit text, 
   description text, 
   category text[], -- ✅ Changed from 'text' to 'text[]' to match the actual column type
   panel text[],
   conventional_min numeric, 
   conventional_max numeric, 
   optimal_min numeric, 
   optimal_max numeric, 
   biomarker_created_at timestamp with time zone, 
   biomarker_updated_at timestamp with time zone
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pb.id,
    pb.patient_id,
    pb.biomarker_id,
    pb.value,
    pb.date,
    pb.is_out_of_range,
    pb.trend,
    pb.notes,
    pb.created_at,
    pb.created_by,
    pb.form_id,
    pb.report_id,
    b.name as biomarker_name,
    b.unit,
    b.description,
    b.category, -- This now correctly returns text[] as expected
    b.panel,
    b.conventional_min,
    b.conventional_max,
    b.optimal_min,
    b.optimal_max,
    b.created_at as biomarker_created_at,
    b.updated_at as biomarker_updated_at
  FROM 
    public.patient_biomarkers pb
  JOIN 
    public.biomarkers b ON pb.biomarker_id = b.id
  WHERE 
    pb.report_id = p_report_id
  ORDER BY 
    pb.date DESC;
END;
$function$
