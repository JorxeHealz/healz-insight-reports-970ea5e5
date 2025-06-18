
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useUpcomingAppointments = () => {
  return useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const today = new Date().toISOString();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get assigned patients with upcoming appointments
      const { data, error } = await supabase
        .from('patient_assignments')
        .select(`
          patient_id,
          patients!inner(
            id,
            first_name,
            last_name,
            next_visit,
            email
          )
        `)
        .eq('user_id', 'temp-user-id') // TODO: Replace with actual auth.uid() when auth is implemented
        .gte('patients.next_visit', today)
        .lte('patients.next_visit', nextWeek)
        .order('patients.next_visit', { ascending: true });

      if (error) throw error;

      return data?.map(assignment => assignment.patients) || [];
    },
  });
};
