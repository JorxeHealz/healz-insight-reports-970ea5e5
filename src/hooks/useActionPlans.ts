
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';

// Type definitions for each action plan category
export type FoodActionPlanData = {
  report_id: string;
  form_id: string;
  patient_id: string;
  priority: 'high' | 'medium' | 'low';
  dietary_pattern?: string;
  main_goals?: string[];
  foods_to_include?: string[];
  foods_to_avoid?: string[];
  meal_examples?: Record<string, any>;
  special_considerations?: string[];
  active?: boolean;
};

export type SupplementActionPlanData = {
  report_id: string;
  form_id: string;
  patient_id: string;
  priority: 'high' | 'medium' | 'low';
  supplement_name: string;
  dosage: string;
  frequency: string;
  timing?: string;
  duration?: string;
  brand_recommendations?: string[];
  contraindications?: string[];
  monitoring_notes?: string;
  active?: boolean;
};

export type LifestyleActionPlanData = {
  report_id: string;
  form_id: string;
  patient_id: string;
  priority: 'high' | 'medium' | 'low';
  stress_management_techniques?: string[];
  sleep_target_hours?: string;
  sleep_interventions?: string[];
  daily_routine_recommendations?: string[];
  environmental_factors?: string[];
  active?: boolean;
};

export type ActivityActionPlanData = {
  report_id: string;
  form_id: string;
  patient_id: string;
  priority: 'high' | 'medium' | 'low';
  activity_type: string;
  frequency_per_week?: number;
  session_duration?: string;
  intensity_level?: string;
  specific_exercises?: string[];
  progression_plan?: string;
  equipment_needed?: string[];
  restrictions?: string[];
  monitoring_signals?: string[];
  active?: boolean;
};

export type TherapyActionPlanData = {
  report_id: string;
  form_id: string;
  patient_id: string;
  priority: 'high' | 'medium' | 'low';
  therapy_type: string;
  protocol?: string;
  frequency?: string;
  duration?: string;
  provider_type?: string;
  monitoring_requirements?: string[];
  expected_outcomes?: string[];
  precautions?: string[];
  active?: boolean;
};

export type FollowupActionPlanData = {
  report_id: string;
  form_id: string;
  patient_id: string;
  priority: 'high' | 'medium' | 'low';
  followup_type: string;
  timeline: string;
  specific_tests?: string[];
  success_metrics?: string[];
  provider_type?: string;
  preparation_required?: string[];
  escalation_criteria?: string[];
  active?: boolean;
};

export type ActionPlanCategory = 'foods' | 'supplements' | 'lifestyle' | 'activity' | 'therapy' | 'followup';

export type ActionPlanData = 
  | FoodActionPlanData 
  | SupplementActionPlanData 
  | LifestyleActionPlanData 
  | ActivityActionPlanData 
  | TherapyActionPlanData 
  | FollowupActionPlanData;

type UpdateActionPlanData = {
  id: string;
  category: ActionPlanCategory;
  [key: string]: any;
};

export const useActionPlans = (reportId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createActionPlan = useMutation({
    mutationFn: async ({ category, ...data }: ActionPlanData & { category: ActionPlanCategory }) => {
      const tableName = `report_action_plans_${category}`;
      
      console.log(`Creating action plan in ${tableName}:`, data);
      
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Error creating action plan in ${tableName}:`, error);
        throw error;
      }
      
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: `Nueva acción agregada correctamente en ${getCategoryDisplayName(variables.category)}`,
      });
    },
    onError: (error, variables) => {
      console.error('Error creating action plan:', error);
      toast({
        title: 'Error',
        description: `No se pudo agregar la acción en ${getCategoryDisplayName(variables.category)}: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateActionPlan = useMutation({
    mutationFn: async ({ id, category, ...updates }: UpdateActionPlanData) => {
      const tableName = `report_action_plans_${category}`;
      
      console.log(`Updating action plan ${id} in ${tableName}:`, updates);
      
      const { data: result, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating action plan in ${tableName}:`, error);
        throw error;
      }
      
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: `Acción actualizada correctamente en ${getCategoryDisplayName(variables.category)}`,
      });
    },
    onError: (error, variables) => {
      console.error('Error updating action plan:', error);
      toast({
        title: 'Error',
        description: `No se pudo actualizar la acción en ${getCategoryDisplayName(variables.category)}: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteActionPlan = useMutation({
    mutationFn: async ({ id, category }: { id: string; category: ActionPlanCategory }) => {
      const tableName = `report_action_plans_${category}`;
      
      console.log(`Deleting action plan ${id} from ${tableName}`);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting action plan from ${tableName}:`, error);
        throw error;
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-report', reportId] });
      toast({
        title: 'Éxito',
        description: `Acción eliminada correctamente de ${getCategoryDisplayName(variables.category)}`,
      });
    },
    onError: (error, variables) => {
      console.error('Error deleting action plan:', error);
      toast({
        title: 'Error',
        description: `No se pudo eliminar la acción de ${getCategoryDisplayName(variables.category)}: ${error.message}`,
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

// Helper function to get display names for categories
function getCategoryDisplayName(category: ActionPlanCategory): string {
  const displayNames = {
    foods: 'Alimentación',
    supplements: 'Suplementos',
    lifestyle: 'Estilo de Vida',
    activity: 'Actividad Física',
    therapy: 'Terapias',
    followup: 'Seguimiento'
  };
  
  return displayNames[category] || category;
}
