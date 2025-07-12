import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Patient } from '../types/supabase';
import { PatientForm } from '../types/forms';

interface DiagnosisGenerationData {
  patient_id: string;
  form_id?: string;
  analytics_id: string;
}

type GenerationStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

interface GenerationState {
  status: GenerationStatus;
  queueId?: string;
  reportId?: string;
  error?: string;
  progress?: string;
  estimatedTime?: number;
}

export const useReportGeneration = () => {
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: 'idle'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Poll processing queue for status updates
  const { data: queueStatus } = useQuery({
    queryKey: ['processing-queue', generationState.queueId],
    queryFn: async () => {
      if (!generationState.queueId) return null;
      
      const { data, error } = await supabase
        .from('processing_queue')
        .select('*')
        .eq('id', generationState.queueId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!generationState.queueId && ['pending', 'processing'].includes(generationState.status),
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Update state based on queue status
  useEffect(() => {
    if (queueStatus && generationState.queueId) {
      if (queueStatus.status === 'completed' && generationState.status !== 'completed') {
        setGenerationState(prev => ({
          ...prev,
          status: 'completed',
          progress: 'Diagnóstico completado'
        }));
        
        // Get the report ID from the queue or fetch the latest report
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        
        toast({
          title: "Diagnóstico completado",
          description: "El diagnóstico se ha generado correctamente",
        });
      } else if (queueStatus.status === 'failed' && generationState.status !== 'failed') {
        setGenerationState(prev => ({
          ...prev,
          status: 'failed',
          error: queueStatus.error_message || 'Error en el procesamiento'
        }));
        
        toast({
          title: "Error en el diagnóstico",
          description: queueStatus.error_message || "Error en el procesamiento",
          variant: "destructive",
        });
      } else if (queueStatus.status === 'processing' && generationState.status !== 'processing') {
        setGenerationState(prev => ({
          ...prev,
          status: 'processing',
          progress: 'Procesando biomarcadores y generando recomendaciones...'
        }));
      }
    }
  }, [queueStatus, generationState.queueId, generationState.status, toast, queryClient]);

  // Mutation to start diagnosis generation
  const generateDiagnosis = useMutation({
    mutationFn: async (data: DiagnosisGenerationData) => {
      // First, create a processing queue entry
      const { data: queueEntry, error: queueError } = await supabase
        .from('processing_queue')
        .insert({
          patient_id: data.patient_id,
          form_id: data.form_id || null,
          status: 'pending',
        })
        .select()
        .single();

      if (queueError) throw queueError;

      // Then call the N8N webhook
      const webhookData = {
        queue_id: queueEntry.id,
        patient_id: data.patient_id,
        form_id: data.form_id || null,
        analytics_id: data.analytics_id,
      };

      console.log('Sending data to N8N webhook:', webhookData);

      const response = await fetch('https://joinhealz.app.n8n.cloud/webhook/healz-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
      }

      return { queueId: queueEntry.id };
    },
    onSuccess: (data) => {
      setGenerationState({
        status: 'pending',
        queueId: data.queueId,
        progress: 'Iniciando procesamiento...',
        estimatedTime: 120 // 2 minutes estimated
      });
      
      toast({
        title: "Diagnóstico iniciado",
        description: "El procesamiento del diagnóstico ha comenzado",
      });
    },
    onError: (error: any) => {
      setGenerationState({
        status: 'failed',
        error: error.message || 'Error al iniciar el diagnóstico'
      });
      
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar el diagnóstico",
        variant: "destructive",
      });
    }
  });

  // Function to reset the generation state
  const resetGeneration = () => {
    setGenerationState({ status: 'idle' });
  };

  // Function to get the latest report for a patient
  const getLatestReport = async (patientId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  return {
    generationState,
    generateDiagnosis: generateDiagnosis.mutate,
    isGenerating: generateDiagnosis.isPending || ['pending', 'processing'].includes(generationState.status),
    resetGeneration,
    getLatestReport,
  };
};