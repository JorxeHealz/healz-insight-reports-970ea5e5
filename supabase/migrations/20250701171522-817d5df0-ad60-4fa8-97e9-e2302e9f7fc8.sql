
-- Actualizar la función get_report_biomarkers para eliminar referencia a b.panel
DROP FUNCTION IF EXISTS public.get_report_biomarkers(uuid);

CREATE OR REPLACE FUNCTION public.get_report_biomarkers(p_report_id uuid)
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
AS $function$
DECLARE
  target_patient_id uuid;
BEGIN
  -- Obtener el patient_id del reporte específico
  SELECT r.patient_id INTO target_patient_id
  FROM public.reports r
  WHERE r.id = p_report_id;
  
  -- Si no encontramos el reporte, retornar vacío
  IF target_patient_id IS NULL THEN
    RETURN;
  END IF;
  
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
  JOIN 
    public.biomarkers b ON pb.biomarker_id = b.id
  WHERE 
    pb.patient_id = target_patient_id
    AND pb.analytics_id IS NOT NULL
  ORDER BY 
    pb.date DESC;
END;
$function$
