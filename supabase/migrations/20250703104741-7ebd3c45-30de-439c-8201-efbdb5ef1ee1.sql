-- Temporarily allow access to biomarkers and patients for development
-- This bypasses RLS until authentication is properly implemented

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins y coaches pueden ver biomarcadores de pacientes asignado" ON public.patient_biomarkers;
DROP POLICY IF EXISTS "Admins y coaches pueden crear biomarcadores de pacientes asigna" ON public.patient_biomarkers;
DROP POLICY IF EXISTS "Admins y coaches pueden ver pacientes asignados" ON public.patients;
DROP POLICY IF EXISTS "Admins y coaches pueden crear pacientes" ON public.patients;
DROP POLICY IF EXISTS "Admins y coaches pueden actualizar pacientes asignados" ON public.patients;

-- Create temporary permissive policies for development
CREATE POLICY "Desarrollo: permitir acceso a biomarcadores" 
ON public.patient_biomarkers 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Desarrollo: permitir acceso a pacientes" 
ON public.patients 
FOR ALL 
USING (true)
WITH CHECK (true);