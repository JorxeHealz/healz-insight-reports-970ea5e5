
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface PatientAnalytics {
  id: string;
  patient_id: string;
  file_url: string;
  file_name: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  upload_date: string;
  created_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const usePatientAnalytics = () => {
  return useQuery({
    queryKey: ['patient-analytics'],
    queryFn: async (): Promise<PatientAnalytics[]> => {
      const { data, error } = await supabase
        .from('patient_analytics')
        .select(`
          *,
          patient:patients(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useUploadAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      patientId, 
      file, 
      notes 
    }: { 
      patientId: string; 
      file: File; 
      notes?: string; 
    }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `analytics/${patientId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('patient-files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('patient-files')
        .getPublicUrl(filePath);

      // Create analytics record
      const { data, error } = await supabase
        .from('patient_analytics')
        .insert({
          patient_id: patientId,
          file_url: publicUrl,
          file_name: file.name,
          notes,
          status: 'uploaded'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-analytics'] });
    }
  });
};

export const useProcessAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      analyticsId,
      webhookUrl 
    }: { 
      analyticsId: string;
      webhookUrl?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('process-analytics-n8n', {
        body: {
          analytics_id: analyticsId,
          n8n_webhook_url: webhookUrl || 'https://joinhealz.app.n8n.cloud/webhook/analitica'
        }
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-analytics'] });
    }
  });
};
