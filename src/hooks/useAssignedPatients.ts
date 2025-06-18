
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useAssignedPatients = () => {
  return useQuery({
    queryKey: ['assignedPatients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patient_assignments')
        .select(`
          patient_id,
          patients!inner(
            id,
            first_name,
            last_name,
            email,
            last_visit,
            next_visit,
            status
          )
        `)
        .eq('user_id', 'temp-user-id'); // TODO: Replace with actual auth.uid() when auth is implemented

      if (error) throw error;

      return data?.map(assignment => assignment.patients) || [];
    },
  });
};
