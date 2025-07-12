-- Create function to get patient biomarkers by analytics_id
CREATE OR REPLACE FUNCTION public.get_patient_biomarkers_by_analytics(
  p_patient_id uuid,
  p_analytics_id uuid
)
RETURNS TABLE(
  id uuid,
  patient_id uuid,
  biomarker_id uuid,
  value numeric,
  date timestamp with time zone,
  created_at timestamp with time zone,
  created_by uuid,
  analytics_id uuid,
  biomarker_name text,
  unit text,
  description text,
  category text[],
  conventional_min numeric,
  conventional_max numeric,
  optimal_min numeric,
  optimal_max numeric,
  biomarker_created_at timestamp with time zone,
  biomarker_updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pb.id,
    pb.patient_id,
    pb.biomarker_id,
    pb.value,
    pb.date,
    pb.created_at,
    pb.created_by,
    pb.analytics_id,
    b.name as biomarker_name,
    b.unit,
    b.description,
    b.category,
    b.conventional_min,
    b.conventional_max,
    b.optimal_min,
    b.optimal_max,
    b.created_at as biomarker_created_at,
    b.updated_at as biomarker_updated_at
  FROM 
    public.patient_biomarkers pb
  LEFT JOIN 
    public.biomarkers b ON pb.biomarker_id = b.id
  WHERE 
    pb.patient_id = p_patient_id
    AND pb.analytics_id = p_analytics_id
  ORDER BY 
    pb.date DESC;
END;
$$;