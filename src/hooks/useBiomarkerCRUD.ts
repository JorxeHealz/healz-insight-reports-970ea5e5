import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CreateBiomarkerParams {
  patient_id: string;
  biomarker_id: string;
  value: number;
  analytics_id: string;
  date: string;
}

interface UpdateBiomarkerParams {
  id: string;
  value: number;
}

interface DeleteBiomarkerParams {
  id: string;
}

export const useBiomarkerCRUD = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBiomarker = useMutation({
    mutationFn: async (params: CreateBiomarkerParams) => {
      const { data, error } = await supabase.rpc('create_patient_biomarker_with_analytics', {
        p_patient_id: params.patient_id,
        p_biomarker_id: params.biomarker_id,
        p_value: params.value,
        p_analytics_id: params.analytics_id,
        p_date: params.date
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomarkers'] });
      toast({
        title: "Éxito",
        description: "Biomarcador agregado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo agregar el biomarcador: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateBiomarker = useMutation({
    mutationFn: async (params: UpdateBiomarkerParams) => {
      const { data, error } = await supabase.rpc('update_patient_biomarker_value', {
        p_id: params.id,
        p_value: params.value
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomarkers'] });
      toast({
        title: "Éxito",
        description: "Biomarcador actualizado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar el biomarcador: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteBiomarker = useMutation({
    mutationFn: async (params: DeleteBiomarkerParams) => {
      const { data, error } = await supabase.rpc('delete_patient_biomarker', {
        p_id: params.id
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomarkers'] });
      toast({
        title: "Éxito",
        description: "Biomarcador eliminado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el biomarcador: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    createBiomarker,
    updateBiomarker,
    deleteBiomarker,
  };
};