import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useReportGeneration } from '../../hooks/useReportGeneration';
import { supabase } from '../../lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface DiagnosisGenerationStatusProps {
  patient: any;
  selectedForm: any;
  analyticsId: string;
  onBack: () => void;
  onComplete: (reportId: string) => void;
}

export const DiagnosisGenerationStatus = ({
  patient,
  selectedForm,
  analyticsId,
  onBack,
  onComplete
}: DiagnosisGenerationStatusProps) => {
  const { generationState, generateDiagnosis, isGenerating, resetGeneration, getLatestReport } = useReportGeneration();
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  // Get the current report ID from localStorage
  useEffect(() => {
    const reportId = localStorage.getItem('currentReportId');
    if (reportId) {
      setCurrentReportId(reportId);
    }
  }, []);

  // Poll for report status updates
  const { data: currentReport } = useQuery({
    queryKey: ['report-status', currentReportId],
    queryFn: async () => {
      if (!currentReportId) return null;
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', currentReportId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentReportId,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Start generation when component mounts (only if no current report or report is processing)
  useEffect(() => {
    if (currentReport?.status === 'processing') {
      // Report already exists and is processing, no need to start generation
      return;
    }
    
    if (generationState.status === 'idle' && currentReportId) {
      generateDiagnosis({
        patient_id: patient.id,
        form_id: selectedForm?.id,
        analytics_id: analyticsId
      });
    }
  }, [currentReport, currentReportId]);

  // Handle completion based on report status
  useEffect(() => {
    if (currentReport?.status === 'completed') {
      localStorage.removeItem('currentReportId');
      onComplete(currentReport.id);
    }
  }, [currentReport?.status, currentReport?.id, onComplete]);

  // Get status from current report or generation state
  const currentStatus = currentReport?.status || generationState.status || 'processing';

  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'pending':
      case 'processing':
        return <Clock className="w-8 h-8 text-healz-blue animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-healz-green" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-healz-red" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-healz-yellow" />;
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'pending':
        return 'Iniciando procesamiento...';
      case 'processing':
        return 'Generando diagnóstico y recomendaciones...';
      case 'completed':
        return 'Diagnóstico completado';
      case 'failed':
        return 'Error en el procesamiento';
      default:
        return 'Preparando...';
    }
  };

  const getProgress = () => {
    switch (currentStatus) {
      case 'pending':
        return 25;
      case 'processing':
        return 75;
      case 'completed':
        return 100;
      case 'failed':
        return 0;
      default:
        return 0;
    }
  };

  const formatTimeRemaining = () => {
    if (!generationState.estimatedTime) return '';
    
    const minutes = Math.floor(generationState.estimatedTime / 60);
    const seconds = generationState.estimatedTime % 60;
    
    if (minutes > 0) {
      return `~${minutes}m ${seconds}s restantes`;
    }
    return `~${seconds}s restantes`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-healz-brown mb-2">
          Generando Diagnóstico
        </h3>
        <p className="text-healz-brown/70">
          Nuestro sistema está analizando los biomarcadores de {patient.first_name} {patient.last_name}
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-lg">
            {getStatusText()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Progress value={getProgress()} className="h-3" />
            <div className="flex justify-between text-sm text-healz-brown/60">
              <span>{generationState.progress || 'Inicializando...'}</span>
              {generationState.estimatedTime && currentStatus === 'processing' && (
                <span>{formatTimeRemaining()}</span>
              )}
            </div>
          </div>

          {currentStatus === 'processing' && (
            <div className="bg-healz-blue/10 p-4 rounded-lg">
              <h4 className="font-medium text-healz-brown mb-2">¿Qué está sucediendo?</h4>
              <ul className="text-sm text-healz-brown/70 space-y-1">
                <li>• Analizando biomarcadores y síntomas</li>
                <li>• Evaluando riesgos por categorías</li>
                <li>• Generando recomendaciones personalizadas</li>
                <li>• Creando plan de acción detallado</li>
              </ul>
            </div>
          )}

          {currentStatus === 'completed' && (
            <div className="bg-healz-green/10 p-4 rounded-lg text-center">
              <h4 className="font-medium text-healz-green mb-2">¡Diagnóstico Completado!</h4>
              <p className="text-sm text-healz-brown/70">
                El informe está listo y será mostrado en breve.
              </p>
            </div>
          )}

          {currentStatus === 'failed' && (
            <div className="bg-healz-red/10 p-4 rounded-lg">
              <h4 className="font-medium text-healz-red mb-2">Error en el Procesamiento</h4>
              <p className="text-sm text-healz-brown/70 mb-3">
                {generationState.error || 'Ha ocurrido un error inesperado durante el procesamiento.'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    resetGeneration();
                    generateDiagnosis({
                      patient_id: patient.id,
                      form_id: selectedForm?.id,
                      analytics_id: analyticsId
                    });
                  }}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={onBack}
              disabled={isGenerating}
            >
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};