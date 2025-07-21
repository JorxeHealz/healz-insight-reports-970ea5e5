import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Patient } from '../types/supabase';
import { PatientForm } from '../types/forms';

interface DiagnosisGenerationData {
  patient_id: string;
  form_id?: string;
  analytics_id?: string; // Made optional since we'll auto-detect it
}

interface GenerationState {
  status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  queueId?: string;
  reportId?: string; // Add reportId to track the created report
  progress?: string;
  estimatedTime?: number;
  error?: string;
}

// Helper function to get the latest analytics_id for a patient
const getLatestAnalyticsId = async (patientId: string): Promise<string | null> => {
  console.log('🔍 Getting latest analytics_id for patient:', patientId);
  
  const { data, error } = await supabase
    .from('patient_biomarkers')
    .select('analytics_id')
    .eq('patient_id', patientId)
    .not('analytics_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('⚠️ Error fetching latest analytics_id:', error);
    return null;
  }

  console.log('✅ Latest analytics_id found:', data?.analytics_id);
  return data?.analytics_id || null;
};

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

  // Also poll the report status to track completion
  const { data: reportStatus } = useQuery({
    queryKey: ['report-status', generationState.reportId],
    queryFn: async () => {
      if (!generationState.reportId) return null;
      
      const { data, error } = await supabase
        .from('reports')
        .select('id, status, diagnosis')
        .eq('id', generationState.reportId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!generationState.reportId && ['pending', 'processing'].includes(generationState.status),
    refetchInterval: 3000, // Poll every 3 seconds
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
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        queryClient.invalidateQueries({ queryKey: ['patient-report', generationState.reportId] });
        
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
  }, [queueStatus, generationState.queueId, generationState.status, toast, queryClient, generationState.reportId]);

  // Check report status for completion (in case queue status isn't updated properly)
  useEffect(() => {
    if (reportStatus && reportStatus.diagnosis && generationState.status === 'processing') {
      setGenerationState(prev => ({
        ...prev,
        status: 'completed',
        progress: 'Diagnóstico completado'
      }));
      
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['patient-report', generationState.reportId] });
      
      toast({
        title: "Diagnóstico completado",
        description: "El diagnóstico se ha generado correctamente",
      });
    }
  }, [reportStatus, generationState.status, generationState.reportId, toast, queryClient]);

  // Enhanced mutation to create diagnosis with simplified flow
  const generateDiagnosis = useMutation({
    mutationFn: async (data: DiagnosisGenerationData) => {
      console.log('🚀 Starting enhanced diagnosis generation with data:', data);
      
      // Step 1: Get latest analytics_id if not provided
      let analyticsId = data.analytics_id;
      if (!analyticsId) {
        analyticsId = await getLatestAnalyticsId(data.patient_id);
        if (!analyticsId) {
          throw new Error('No se encontraron analíticas para este paciente');
        }
      }
      
      console.log('📊 Using analytics_id:', analyticsId);

      // Step 2: Create the report row immediately with all required data
      const reportData = {
        patient_id: data.patient_id,
        form_id: data.form_id || null,
        analytics_id: analyticsId,
        status: 'processing',
        diagnosis: {}, // Empty object, will be populated by N8N
        created_at: new Date().toISOString()
      };

      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (reportError) {
        console.error('❌ Error creating report:', reportError);
        throw new Error(`Error al crear el informe: ${reportError.message}`);
      }

      console.log('✅ Report created with ID:', report.id);

      // Step 3: Create processing queue entry linked to the report
      const { data: queueEntry, error: queueError } = await supabase
        .from('processing_queue')
        .insert({
          patient_id: data.patient_id,
          form_id: data.form_id || null,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (queueError) {
        // If queue creation fails, update report status to failed
        await supabase
          .from('reports')
          .update({ status: 'failed' })
          .eq('id', report.id);
        
        throw new Error(`Error al crear la cola de procesamiento: ${queueError.message}`);
      }

      console.log('✅ Queue entry created with ID:', queueEntry.id);

      // Step 4: Update report with processing_queue_id for reference
      await supabase
        .from('reports')
        .update({ processing_queue_id: queueEntry.id })
        .eq('id', report.id);

      // Step 5: Call N8N webhook with all the coordinated data
      const webhookData = {
        queue_id: queueEntry.id,
        report_id: report.id, // Add report_id to webhook data
        patient_id: data.patient_id,
        form_id: data.form_id || null,
        analytics_id: analyticsId,
      };

      console.log('📨 Sending enhanced data to N8N webhook:', webhookData);

      const response = await fetch('https://joinhealz.app.n8n.cloud/webhook/healz-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        // Update report and queue status to failed
        await Promise.all([
          supabase.from('reports').update({ status: 'failed' }).eq('id', report.id),
          supabase.from('processing_queue').update({ 
            status: 'failed', 
            error_message: `Webhook error: ${response.status} ${response.statusText}`,
            completed_at: new Date().toISOString()
          }).eq('id', queueEntry.id)
        ]);
        
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
      }

      return { 
        queueId: queueEntry.id, 
        reportId: report.id,
        analyticsId
      };
    },
    onSuccess: (data) => {
      setGenerationState({
        status: 'pending',
        queueId: data.queueId,
        reportId: data.reportId,
        progress: 'Iniciando procesamiento...',
        estimatedTime: 120 // 2 minutes estimated
      });
      
      // Store report ID in localStorage for navigation
      localStorage.setItem('currentReportId', data.reportId);
      
      toast({
        title: "Informe creado",
        description: "El informe se ha creado y el procesamiento del diagnóstico ha comenzado",
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
    localStorage.removeItem('currentReportId');
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
    getLatestAnalyticsId, // Export this helper function
  };
};