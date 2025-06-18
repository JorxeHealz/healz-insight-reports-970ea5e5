
-- Crear función para buscar paciente por shortId (corrigiendo los tipos)
CREATE OR REPLACE FUNCTION public.find_patient_by_short_id(short_id TEXT)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  status TEXT,
  notes TEXT,
  last_visit TIMESTAMP WITH TIME ZONE,
  next_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.phone,
    p.date_of_birth,
    p.gender::TEXT,
    p.status::TEXT,
    p.notes,
    p.last_visit,
    p.next_visit,
    p.created_at,
    p.updated_at
  FROM public.patients p
  WHERE p.id::text LIKE (short_id || '%')
  LIMIT 1;
END;
$$;
