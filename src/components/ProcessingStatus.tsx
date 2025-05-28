
import React from 'react';
import { useProcessingQueueByForm } from '../hooks/useProcessingQueue';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ProcessingStatusProps {
  formId: string;
}

export const ProcessingStatus = ({ formId }: ProcessingStatusProps) => {
  const { data: queueEntry, isLoading } = useProcessingQueueByForm(formId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-healz-brown/70">
        <Loader2 className="h-4 w-4 animate-spin" />
        Verificando estado...
      </div>
    );
  }

  if (!queueEntry) {
    return null;
  }

  const getStatusIcon = () => {
    switch (queueEntry.status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-healz-yellow" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-healz-blue" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-healz-green" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-healz-red" />;
      default:
        return <Clock className="h-4 w-4 text-healz-brown/50" />;
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'En Cola' },
      processing: { variant: 'default' as const, label: 'Procesando' },
      completed: { variant: 'secondary' as const, label: 'Completado' },
      failed: { variant: 'destructive' as const, label: 'Error' }
    };
    
    const config = statusConfig[queueEntry.status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProgressValue = () => {
    switch (queueEntry.status) {
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

  return (
    <div className="space-y-3 p-3 bg-healz-cream/20 rounded-md border border-healz-brown/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium text-sm">Procesamiento n8n</span>
        </div>
        {getStatusBadge()}
      </div>
      
      <Progress value={getProgressValue()} className="h-2" />
      
      <div className="text-xs text-healz-brown/70 space-y-1">
        <p>Iniciado: {new Date(queueEntry.created_at).toLocaleString('es-ES')}</p>
        {queueEntry.started_at && (
          <p>Procesando desde: {new Date(queueEntry.started_at).toLocaleString('es-ES')}</p>
        )}
        {queueEntry.completed_at && (
          <p>Completado: {new Date(queueEntry.completed_at).toLocaleString('es-ES')}</p>
        )}
        {queueEntry.n8n_execution_id && (
          <p>ID ejecución n8n: {queueEntry.n8n_execution_id}</p>
        )}
        {queueEntry.error_message && (
          <p className="text-healz-red">Error: {queueEntry.error_message}</p>
        )}
      </div>
    </div>
  );
};
