
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
      const { data: result, error } = await supabase
        .from('report_action_plans')
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: `Nueva acción agregada correctamente en ${variables.category}`,
      });
    },
    onError: (error, variables) => {
      toast({
        title: 'Error',
        description: `No se pudo agregar la acción en ${variables.category}: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateActionPlan = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateActionPlanData) => {
      const { data: result, error } = await supabase
        .from('report_action_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

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
