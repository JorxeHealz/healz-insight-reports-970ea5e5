
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type Patient = Tables<'patients'>;

export const useAssignedPatients = () => {
  return useQuery({
    queryKey: ['assignedPatients'],
    queryFn: async () => {
      // Temporalmente consultamos directamente la tabla patients 
      // hasta que se implemente el sistema de asignaciones completo
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as Patient[] || [];
    },
  });
};
