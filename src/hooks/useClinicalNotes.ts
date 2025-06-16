
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useClinicalNotes = (reportId: string) => {
  const queryClient = useQueryClient();

  const addClinicalNote = useMutation({
    mutationFn: async (noteData: {
      category: string;
      title: string;
      content: string;
      priority: string;
      formId: string;
    }) => {
      const { data, error } = await supabase
        .from('report_comments')
        .insert({
          report_id: reportId,
          form_id: noteData.formId,
          category: noteData.category,
          title: noteData.title,
          content: noteData.content,
          priority: noteData.priority,
          author: 'Dr. Sistema'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
    },
  });

  const updateClinicalNote = useMutation({
    mutationFn: async (noteData: {
      id: string;
      title: string;
      content: string;
      category: string;
      priority: string;
    }) => {
      const { data, error } = await supabase
        .from('report_comments')
        .update({
          title: noteData.title,
          content: noteData.content,
          category: noteData.category,
          priority: noteData.priority
        })
        .eq('id', noteData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
    },
  });

  const deleteClinicalNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('report_comments')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
    },
  });

  return {
    addClinicalNote,
    updateClinicalNote,
    deleteClinicalNote
  };
};
