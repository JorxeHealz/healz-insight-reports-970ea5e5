
-- Eliminar columnas innecesarias de patient_biomarkers
ALTER TABLE public.patient_biomarkers 
DROP COLUMN IF EXISTS is_out_of_range,
DROP COLUMN IF EXISTS trend,
DROP COLUMN IF EXISTS notes,
DROP COLUMN IF EXISTS form_id,
DROP COLUMN IF EXISTS report_id;

-- Actualizar la función get_report_biomarkers para reflejar los cambios
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
    pb.created_at,
    pb.created_by,
    pb.analytics_id,
    b.name as biomarker_name,
    b.unit,
    b.description,
    b.category,
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
    pb.analytics_id IN (
      SELECT analytics_id 
      FROM public.patient_biomarkers 
      WHERE analytics_id IS NOT NULL
      -- Aquí podrías agregar lógica adicional para vincular con reports si es necesario
    )
  ORDER BY 
    pb.date DESC;
END;
$function$
