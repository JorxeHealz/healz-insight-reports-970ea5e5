
import React from 'react';
import { useProcessingQueue } from '../../hooks/useProcessingQueue';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

export const ProcessingStatus = () => {
  const { data: queueEntries, isLoading } = useProcessingQueue();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Estado de Procesamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-healz-brown/70">Cargando estado de procesamiento...</p>
        </CardContent>
      </Card>
    );
  }

  if (!queueEntries || queueEntries.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'En Cola' },
      processing: { variant: 'default' as const, label: 'Procesando' },
      completed: { variant: 'secondary' as const, label: 'Completado' },
      failed: { variant: 'destructive' as const, label: 'Error' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProgressValue = (status: string) => {
    switch (status) {
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
    <Card>
      <CardHeader>
        <CardTitle>Estado de Procesamiento n8n</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queueEntries.map((entry) => (
            <div key={entry.id} className="space-y-3 p-3 bg-healz-cream/20 rounded-md border border-healz-brown/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(entry.status)}
                  <span className="font-medium text-sm">Formulario {entry.form_id.slice(0, 8)}...</span>
                </div>
                {getStatusBadge(entry.status)}
              </div>
              
              <Progress value={getProgressValue(entry.status)} className="h-2" />
              
              <div className="text-xs text-healz-brown/70 space-y-1">
                <p>Iniciado: {new Date(entry.created_at).toLocaleString('es-ES')}</p>
                {entry.started_at && (
                  <p>Procesando desde: {new Date(entry.started_at).toLocaleString('es-ES')}</p>
                )}
                {entry.completed_at && (
                  <p>Completado: {new Date(entry.completed_at).toLocaleString('es-ES')}</p>
                )}
                {entry.n8n_execution_id && (
                  <p>ID ejecución n8n: {entry.n8n_execution_id}</p>
                )}
                {entry.error_message && (
                  <p className="text-healz-red">Error: {entry.error_message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
