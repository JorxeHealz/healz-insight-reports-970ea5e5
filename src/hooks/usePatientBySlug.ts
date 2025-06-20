
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';
import { parsePatientIdFromSlug } from '../utils/patientSlug';

type Patient = Tables<'patients'>;

export const usePatientBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['patient', 'slug', slug],
    queryFn: async () => {
      const shortId = parsePatientIdFromSlug(slug);
      
      if (!shortId) {
        throw new Error('Slug inválido');
      }

      console.log('usePatientBySlug: Searching for patient with shortId:', shortId);

      // Usar la función SQL mejorada que ahora es más específica
      const { data, error } = await supabase.rpc('find_patient_by_short_id', {
        short_id: shortId
      });

      if (error) {
        console.error('usePatientBySlug: Database error:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('usePatientBySlug: No patient found for shortId:', shortId);
        throw new Error('Paciente no encontrado');
      }

      console.log('usePatientBySlug: Found patient:', data[0]);
      return data[0] as Patient;
    },
    enabled: !!slug,
  });
};
