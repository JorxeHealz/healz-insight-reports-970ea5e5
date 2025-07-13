
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useReportClinicalNotes = (formId: string | undefined) => {
  return useQuery({
    queryKey: ['report-clinical-notes', formId],
    queryFn: async () => {
      if (!formId) {
        console.log('useReportClinicalNotes: No formId provided');
        return [];
      }

      console.log('useReportClinicalNotes: Fetching clinical notes for form:', formId);
      
      const { data, error } = await supabase
        .from('report_comments')
        .select(`
          id,
          report_id,
          form_id,
          patient_id,
          title,
          content,
          category,
          priority,
          author,
          date,
          created_at,
          evaluation_type,
          target_id,
          evaluation_score,
          criticality_level,
          recommendations,
          is_auto_generated,
          comment_type,
          panel_affected,
          technical_details,
          patient_friendly_content,
          action_steps,
          warning_signs,
          expected_timeline,
          order_index
        `)
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useReportClinicalNotes: Error fetching clinical notes:', error);
        throw error;
      }

      console.log('useReportClinicalNotes: Clinical notes fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!formId
  });
};
