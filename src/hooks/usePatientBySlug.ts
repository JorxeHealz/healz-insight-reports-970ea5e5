
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

      // Buscar paciente por ID que comience con el shortId usando casting a texto
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .filter('id', 'like', `${shortId}%`)
        .single();

      if (error) throw error;
      return data as Patient;
    },
    enabled: !!slug,
  });
};
