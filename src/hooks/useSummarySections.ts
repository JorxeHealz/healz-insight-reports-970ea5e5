
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useSummarySections = (reportId: string) => {
  const queryClient = useQueryClient();

  const updateSummarySection = useMutation({
    mutationFn: async (sectionData: {
      sectionType: string;
      title: string;
      content: string;
      formId: string;
      evaluation_type?: string;
      target_id?: string;
      evaluation_score?: number;
      recommendations?: any;
      criticality_level?: string;
    }) => {
      // Intentar actualizar primero
      const { data: existingData } = await supabase
        .from('report_summary_sections')
        .select('id')
        .eq('report_id', reportId)
        .eq('section_type', sectionData.sectionType)
        .single();

      if (existingData) {
        // Actualizar existente
        const { data, error } = await supabase
          .from('report_summary_sections')
          .update({
            title: sectionData.title,
            content: sectionData.content,
            evaluation_type: sectionData.evaluation_type || 'summary',
            target_id: sectionData.target_id,
            evaluation_score: sectionData.evaluation_score,
            recommendations: sectionData.recommendations,
            criticality_level: sectionData.criticality_level || 'medium'
          })
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Crear nuevo
        const { data, error } = await supabase
          .from('report_summary_sections')
          .insert({
            report_id: reportId,
            form_id: sectionData.formId,
            section_type: sectionData.sectionType,
            title: sectionData.title,
            content: sectionData.content,
            evaluation_type: sectionData.evaluation_type || 'summary',
            target_id: sectionData.target_id,
            evaluation_score: sectionData.evaluation_score,
            recommendations: sectionData.recommendations,
            criticality_level: sectionData.criticality_level || 'medium'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['evaluations', reportId] });
    },
  });

  const deleteSummarySection = useMutation({
    mutationFn: async (sectionType: string) => {
      const { error } = await supabase
        .from('report_summary_sections')
        .delete()
        .eq('report_id', reportId)
        .eq('section_type', sectionType);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['evaluations', reportId] });
    },
  });

  return {
    updateSummarySection,
    deleteSummarySection
  };
};
