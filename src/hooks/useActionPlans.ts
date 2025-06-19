
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';

type ActionPlanData = {
  report_id: string;
  form_id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  duration?: string;
  dosage?: string;
};

type UpdateActionPlanData = {
  id: string;
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  duration?: string;
  dosage?: string;
};

export const useActionPlans = (reportId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createActionPlan = useMutation({
    mutationFn: async (data: ActionPlanData) => {
      console.log('🔍 [useActionPlans] Attempting to create action plan:', {
        category: data.category,
        title: data.title,
        report_id: data.report_id,
        form_id: data.form_id,
        fullData: data
      });

      const { data: result, error } = await supabase
        .from('report_action_plans')
        .insert(data)
        .select()
        .single();

      console.log('🔍 [useActionPlans] Supabase response:', {
        success: !error,
        error: error,
        result: result,
        category: data.category
      });

      if (error) {
        console.error('❌ [useActionPlans] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          category: data.category
        });
        throw error;
      }
      
      return result;
    },
    onSuccess: (result, variables) => {
      console.log('✅ [useActionPlans] Successfully created action plan:', {
        category: variables.category,
        id: result?.id,
        title: variables.title
      });
      
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: `Nueva acción agregada correctamente en ${variables.category}`,
      });
    },
    onError: (error, variables) => {
      console.error('❌ [useActionPlans] Mutation failed:', {
        category: variables.category,
        error: error,
        variables: variables
      });
      
      toast({
        title: 'Error',
        description: `No se pudo agregar la acción en ${variables.category}: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateActionPlan = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateActionPlanData) => {
      console.log('🔍 [useActionPlans] Attempting to update action plan:', {
        id: id,
        updates: updates
      });

      const { data: result, error } = await supabase
        .from('report_action_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      console.log('🔍 [useActionPlans] Update response:', {
        success: !error,
        error: error,
        result: result
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: 'Acción actualizada correctamente',
      });
    },
    onError: (error) => {
      console.error('Error updating action plan:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la acción',
        variant: 'destructive',
      });
    },
  });

  const deleteActionPlan = useMutation({
    mutationFn: async (id: string) => {
      console.log('🔍 [useActionPlans] Attempting to delete action plan:', { id });

      const { error } = await supabase
        .from('report_action_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: 'Acción eliminada correctamente',
      });
    },
    onError: (error) => {
      console.error('Error deleting action plan:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la acción',
        variant: 'destructive',
      });
    },
  });

  return {
    createActionPlan,
    updateActionPlan,
    deleteActionPlan,
  };
};
