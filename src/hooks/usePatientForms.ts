
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { PatientForm } from '../types/forms';

export const usePatientForms = () => {
  return useQuery({
    queryKey: ['patient-forms'],
    queryFn: async (): Promise<PatientForm[]> => {
      console.log('Fetching patient forms');
      
      const { data, error } = await supabase
        .from('patient_forms')
        .select(`
          *,
          patient:patients!inner(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient forms:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useCreatePatientForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patient_id, notes }: { patient_id: string; notes?: string }) => {
      console.log('Creating patient form for:', patient_id);

      const { data, error } = await supabase.functions.invoke('create-patient-form', {
        body: { patient_id, notes }
      });

      if (error) {
        console.error('Error creating patient form:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-forms'] });
    }
  });
};

export const useFormByToken = (token: string) => {
  return useQuery({
    queryKey: ['form-by-token', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('Se requiere un token');
      }

      console.log('Fetching form by token:', token);

      // Use direct fetch with the correct anon key
      const response = await fetch(`https://tbsanaoztdwgljuukiaa.supabase.co/functions/v1/get-form-data?token=${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRic2FuYW96dGR3Z2xqdXVraWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTYzMjksImV4cCI6MjA2MjYzMjMyOX0.Efxu-IuiFwZdXSBcJ35NdaFoCyZ9ZzQ0m0t1n5ZdPRI`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los datos del formulario');
      }

      const result = await response.json();
      return result;
    },
    enabled: !!token,
    retry: 1
  });
};
