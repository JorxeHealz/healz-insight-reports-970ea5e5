
-- Paso 1: Crear registros mock en patient_analytics para cada conjunto de biomarcadores
INSERT INTO public.patient_analytics (patient_id, file_url, file_name, status, upload_date, created_by, notes)
SELECT DISTINCT 
    pb.patient_id,
    'https://mock-storage.com/analytics/' || pb.patient_id || '_' || EXTRACT(EPOCH FROM pb.date)::text || '.pdf' as file_url,
    'Análisis Mock ' || TO_CHAR(pb.date, 'YYYY-MM-DD') as file_name,
    'processed' as status,
    pb.date as upload_date,
    pb.created_by,
    'Análisis generado automáticamente para datos mock' as notes
FROM public.patient_biomarkers pb
WHERE pb.analytics_id IS NULL
ORDER BY pb.patient_id, pb.date;

-- Paso 2: Actualizar patient_biomarkers para asignar analytics_id
UPDATE public.patient_biomarkers pb
SET analytics_id = pa.id
FROM public.patient_analytics pa
WHERE pb.patient_id = pa.patient_id 
  AND pb.date = pa.upload_date 
  AND pb.analytics_id IS NULL;

-- Paso 3: Crear patient_forms mock para cada analytics y conectar con reports
-- Primero crear los patient_forms correspondientes
INSERT INTO public.patient_forms (patient_id, form_token, status, created_by, notes)
SELECT DISTINCT 
    pa.patient_id,
    'mock-form-' || REPLACE(pa.id::text, '-', '') as form_token,
    'completed' as status,
    pa.created_by,
    'Formulario generado automáticamente para análisis mock' as notes
FROM public.patient_analytics pa
WHERE NOT EXISTS (
    SELECT 1 FROM public.patient_forms pf WHERE pf.patient_id = pa.patient_id
);

-- Paso 4: Conectar reports con form_id correcto (de patient_forms)
UPDATE public.reports r
SET form_id = (
    SELECT pf.id 
    FROM public.patient_forms pf 
    WHERE pf.patient_id = r.patient_id 
    ORDER BY pf.created_at DESC 
    LIMIT 1
)
WHERE r.form_id IS NULL;

-- Paso 5: Actualizar la función get_report_biomarkers para usar analytics_id a través de patient_id
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
    pb.patient_id = target_patient_id
    AND pb.analytics_id IS NOT NULL
  ORDER BY 
    pb.date DESC;
END;
$function$
