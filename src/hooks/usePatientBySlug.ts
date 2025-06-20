
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';
import { parsePatientIdFromSlug } from '../utils/patientSlug';

type Patient = Tables<'patients'>;

export const usePatientBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['patient', 'slug', slug],
    queryFn: async () => {
      console.log('usePatientBySlug: Starting search for slug:', slug);
      
      const shortId = parsePatientIdFromSlug(slug);
      
      if (!shortId) {
        console.error('usePatientBySlug: Invalid slug format:', slug);
        throw new Error('Formato de slug inválido');
      }

      console.log('usePatientBySlug: Extracted shortId:', shortId, 'Length:', shortId.length);

      // Usar la función SQL que acepta prefijos de cualquier longitud
      const { data, error } = await supabase.rpc('find_patient_by_short_id', {
        short_id: shortId
      });

      if (error) {
        console.error('usePatientBySlug: Database error:', error);
        throw error;
      }
      
      console.log('usePatientBySlug: Database response:', data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('usePatientBySlug: No patient found for shortId:', shortId);
        throw new Error('Paciente no encontrado');
      }

      const patient = data[0] as Patient;
      console.log('usePatientBySlug: Found patient:', patient.first_name, patient.last_name, 'with ID:', patient.id);
      return patient;
    },
    enabled: !!slug,
  });
};
