
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Evaluation, EvaluationType, CriticalityLevel } from '../components/report/evaluations/types';

export const useEvaluations = (reportId: string, formId: string) => {
  const queryClient = useQueryClient();

  const { data: evaluations = [], isLoading } = useQuery({
    queryKey: ['evaluations', reportId, formId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_summary_sections')
        .select('*')
        .eq('report_id', reportId)
        .eq('form_id', formId)
        .in('evaluation_type', ['general', 'panel', 'biomarker'])
        .order('evaluation_type', { ascending: true })
        .order('criticality_level', { ascending: false });

      if (error) throw error;
      return data as Evaluation[];
    },
    enabled: !!reportId && !!formId
  });

  const createEvaluation = useMutation({
    mutationFn: async (evaluationData: {
      evaluation_type: EvaluationType;
      target_id?: string;
      title: string;
      content: string;
      evaluation_score?: number;
      recommendations?: any;
      criticality_level: CriticalityLevel;
      is_auto_generated?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('report_summary_sections')
        .insert({
          report_id: reportId,
          form_id: formId,
          section_type: `evaluation_${evaluationData.evaluation_type}`,
          ...evaluationData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations', reportId, formId] });
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
    },
  });

  const updateEvaluation = useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      content: string;
      evaluation_score?: number;
      recommendations?: any;
      criticality_level: CriticalityLevel;
    }) => {
      const { data: result, error } = await supabase
        .from('report_summary_sections')
        .update({
          title: data.title,
          content: data.content,
          evaluation_score: data.evaluation_score,
          recommendations: data.recommendations,
          criticality_level: data.criticality_level,
          is_auto_generated: false
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations', reportId, formId] });
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
    },
  });

  const deleteEvaluation = useMutation({
    mutationFn: async (evaluationId: string) => {
      const { error } = await supabase
        .from('report_summary_sections')
        .delete()
        .eq('id', evaluationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations', reportId, formId] });
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
    },
  });

  return {
    evaluations,
    isLoading,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
  };
};
