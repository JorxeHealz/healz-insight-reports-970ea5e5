-- Función para crear biomarcador con analytics_id y fecha específica
CREATE OR REPLACE FUNCTION create_patient_biomarker_with_analytics(
  p_patient_id UUID,
  p_biomarker_id UUID,
  p_value NUMERIC,
  p_analytics_id UUID,
  p_date TIMESTAMP WITH TIME ZONE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biomarker_record RECORD;
  v_is_out_of_range BOOLEAN;
  v_trend trend;
  v_prev_value NUMERIC;
  v_result_id UUID;
  v_patient_record RECORD;
BEGIN
  -- Get biomarker information
  SELECT * INTO v_biomarker_record FROM public.biomarkers WHERE id = p_biomarker_id;

  -- Check if value is out of conventional range
  v_is_out_of_range := FALSE;
  IF (v_biomarker_record.conventional_min IS NOT NULL AND p_value < v_biomarker_record.conventional_min) OR
     (v_biomarker_record.conventional_max IS NOT NULL AND p_value > v_biomarker_record.conventional_max) THEN
    v_is_out_of_range := TRUE;
  END IF;

  -- Determine trend by comparing with previous value
  SELECT value INTO v_prev_value
  FROM public.patient_biomarkers
  WHERE patient_id = p_patient_id AND biomarker_id = p_biomarker_id
  ORDER BY date DESC
  LIMIT 1;

  IF v_prev_value IS NULL THEN
    v_trend := NULL;
  ELSIF p_value > v_prev_value THEN
    v_trend := 'increasing';
  ELSIF p_value < v_prev_value THEN
    v_trend := 'decreasing';
  ELSE
    v_trend := 'stable';
  END IF;

  -- Insert the new biomarker record
  INSERT INTO public.patient_biomarkers (
    patient_id, biomarker_id, value, date, analytics_id, created_by
  ) VALUES (
    p_patient_id, 
    p_biomarker_id, 
    p_value, 
    p_date,
    p_analytics_id,
    auth.uid()
  )
  RETURNING id INTO v_result_id;

  RETURN v_result_id;
END;
$$;

-- Función para actualizar solo el valor de un biomarcador
CREATE OR REPLACE FUNCTION update_patient_biomarker_value(
  p_id UUID,
  p_value NUMERIC
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_biomarker_record RECORD;
  v_patient_biomarker RECORD;
  v_is_out_of_range BOOLEAN;
BEGIN
  -- Get the patient biomarker record
  SELECT * INTO v_patient_biomarker 
  FROM public.patient_biomarkers 
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Get biomarker information
  SELECT * INTO v_biomarker_record 
  FROM public.biomarkers 
  WHERE id = v_patient_biomarker.biomarker_id;

  -- Check if value is out of conventional range
  v_is_out_of_range := FALSE;
  IF (v_biomarker_record.conventional_min IS NOT NULL AND p_value < v_biomarker_record.conventional_min) OR
     (v_biomarker_record.conventional_max IS NOT NULL AND p_value > v_biomarker_record.conventional_max) THEN
    v_is_out_of_range := TRUE;
  END IF;

  -- Update only the value
  UPDATE public.patient_biomarkers 
  SET value = p_value
  WHERE id = p_id;

  RETURN TRUE;
END;
$$;

-- Función para eliminar un biomarcador
CREATE OR REPLACE FUNCTION delete_patient_biomarker(
  p_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.patient_biomarkers 
  WHERE id = p_id;

  RETURN FOUND;
END;
$$;