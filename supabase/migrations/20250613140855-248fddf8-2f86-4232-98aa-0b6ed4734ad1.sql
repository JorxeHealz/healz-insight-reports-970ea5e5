
-- First drop the existing function, then recreate it with the correct return type
DROP FUNCTION IF EXISTS public.get_report_biomarkers(uuid);

-- Recreate the function with the correct panel type as text[]
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
   category text, 
   panel text[], -- ✅ Now correctly typed as text[] to match the column
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
    b.category,
    b.panel, -- This now returns text[] as expected
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
