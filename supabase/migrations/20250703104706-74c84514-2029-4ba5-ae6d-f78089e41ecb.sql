-- Crear usuario temporal para desarrollo y asignar Jorge Ruiz
-- Primero, crear un perfil de usuario temporal para desarrollo
INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'dev@healz.com',
  'Developer',
  'User',
  'admin'
)
ON CONFLICT (id) DO NOTHING;

-- Asignar Jorge Ruiz al usuario temporal
INSERT INTO public.patient_assignments (patient_id, user_id)
SELECT 
  '9b77caed-31d7-42bd-8418-df17c458c0ea'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid
WHERE EXISTS (
  SELECT 1 FROM public.patients 
  WHERE id = '9b77caed-31d7-42bd-8418-df17c458c0ea'::uuid
)
ON CONFLICT (patient_id, user_id) DO NOTHING;