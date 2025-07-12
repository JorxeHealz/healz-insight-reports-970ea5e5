
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { ProcessingQueue } from '../types/forms';

export const useProcessingQueue = () => {
  return useQuery({
    queryKey: ['processing-queue'],
    queryFn: async (): Promise<ProcessingQueue[]> => {
      console.log('Fetching processing queue');
      
      const { data, error } = await supabase
        .from('processing_queue')
        .select(`
          *,
          patient_forms!inner(
            form_token,
            patients!inner(first_name, last_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching processing queue:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useProcessingQueueByForm = (formId: string) => {
  return useQuery({
    queryKey: ['processing-queue', formId],
    queryFn: async (): Promise<ProcessingQueue | null> => {
      if (!formId) return null;

      console.log('Fetching processing queue for form:', formId);
      
      const { data, error } = await supabase
        .from('processing_queue')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching processing queue for form:', error);
        throw error;
      }

      return data;
    },
    enabled: !!formId
  });
};

export const useProcessingQueueById = (queueId: string) => {
  return useQuery({
    queryKey: ['processing-queue-item', queueId],
    queryFn: async (): Promise<ProcessingQueue | null> => {
      if (!queueId) return null;

      console.log('Fetching processing queue item:', queueId);
      
      const { data, error } = await supabase
        .from('processing_queue')
        .select('*')
        .eq('id', queueId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching processing queue item:', error);
        throw error;
      }

      return data;
    },
    enabled: !!queueId,
    refetchInterval: (query) => {
      // Stop polling if completed or failed
      const data = query.state.data;
      return data?.status === 'completed' || data?.status === 'failed' ? false : 2000;
    }
  });
};
