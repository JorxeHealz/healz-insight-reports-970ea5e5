
-- Crear tabla de citas/consultas
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL, -- referencia a user_profiles cuando tengamos auth
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  appointment_type TEXT NOT NULL DEFAULT 'presencial' CHECK (appointment_type IN ('presencial', 'videollamada', 'telefonica')),
  location TEXT,
  meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Crear tabla para disponibilidad de profesionales
CREATE TABLE public.professional_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=domingo, 6=sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_appointments_professional_id ON public.appointments(professional_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_professional_availability_professional_id ON public.professional_availability(professional_id);

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_professional_availability_updated_at
  BEFORE UPDATE ON public.professional_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- Habilitar RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (temporales hasta implementar auth)
CREATE POLICY "Enable read access for all users" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.appointments FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.appointments FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.professional_availability FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.professional_availability FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.professional_availability FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.professional_availability FOR DELETE USING (true);
