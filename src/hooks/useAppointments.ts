
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type Appointment = Tables<'appointments'>;

export const useAppointments = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['appointments', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients!inner(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('start_time', { ascending: true });

      if (startDate) {
        query = query.gte('start_time', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('start_time', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...appointmentData }: Partial<Appointment> & { id: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
