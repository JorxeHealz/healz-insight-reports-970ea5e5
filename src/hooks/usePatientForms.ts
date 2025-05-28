
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
          patients!inner(
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

export const useProcessFormWithN8N = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form_id, n8n_webhook_url }: { form_id: string; n8n_webhook_url?: string }) => {
      console.log('Processing form with n8n:', form_id);

      const { data, error } = await supabase.functions.invoke('process-form-n8n', {
        body: { form_id, n8n_webhook_url }
      });

      if (error) {
        console.error('Error processing form with n8n:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-forms'] });
      queryClient.invalidateQueries({ queryKey: ['processing-queue'] });
    }
  });
};

export const useFormByToken = (token: string) => {
  return useQuery({
    queryKey: ['form-by-token', token],
    queryFn: async () => {
      console.log('Fetching form by token:', token);

      const { data, error } = await supabase.functions.invoke('get-form-data', {
        body: { token }
      });

      if (error) {
        console.error('Error fetching form by token:', error);
        throw error;
      }

      return data;
    },
    enabled: !!token
  });
};
