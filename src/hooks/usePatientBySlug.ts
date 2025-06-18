
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

      // Usar una consulta SQL raw que funcione correctamente con UUIDs
      const { data, error } = await supabase.rpc('find_patient_by_short_id', {
        short_id: shortId
      });

      if (error) throw error;
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Paciente no encontrado');
      }

      return data[0] as Patient;
    },
    enabled: !!slug,
  });
};
