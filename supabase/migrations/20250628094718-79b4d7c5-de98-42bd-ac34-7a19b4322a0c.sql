
-- Crear tabla para analíticas de pacientes
CREATE TABLE public.patient_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  status text NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'failed')),
  upload_date timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Agregar índices para optimizar consultas
CREATE INDEX idx_patient_analytics_patient_id ON public.patient_analytics(patient_id);
CREATE INDEX idx_patient_analytics_status ON public.patient_analytics(status);
CREATE INDEX idx_patient_analytics_upload_date ON public.patient_analytics(upload_date DESC);

-- Agregar trigger para actualizar updated_at
CREATE TRIGGER update_patient_analytics_updated_at
  BEFORE UPDATE ON public.patient_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- Modificar tabla patient_biomarkers para cambiar form_id por analytics_id
ALTER TABLE public.patient_biomarkers 
ADD COLUMN analytics_id uuid REFERENCES public.patient_analytics(id) ON DELETE SET NULL;

-- Crear índice para analytics_id
CREATE INDEX idx_patient_biomarkers_analytics_id ON public.patient_biomarkers(analytics_id);

-- Actualizar función get_report_biomarkers para incluir analytics_id
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
   analytics_id uuid,
   report_id uuid, 
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
    pb.is_out_of_range,
    pb.trend,
    pb.notes,
    pb.created_at,
    pb.created_by,
    pb.form_id,
    pb.analytics_id,
    pb.report_id,
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
    pb.report_id = p_report_id
  ORDER BY 
    pb.date DESC;
END;
$function$
