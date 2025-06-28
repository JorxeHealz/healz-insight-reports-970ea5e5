
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useProcessAnalytics, PatientAnalytics } from '../../hooks/usePatientAnalytics';
import { useToast } from '../ui/use-toast';
import { Play, AlertCircle } from 'lucide-react';

interface ProcessAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analyticsId: string | null;
  analytics: PatientAnalytics[];
  onSuccess: () => void;
}

export const ProcessAnalyticsDialog = ({
  open,
  onOpenChange,
  analyticsId,
  analytics,
  onSuccess
}: ProcessAnalyticsDialogProps) => {
  const [webhookUrl, setWebhookUrl] = useState('https://joinhealz.app.n8n.cloud/webhook/analitica');
  const { toast } = useToast();

  const processMutation = useProcessAnalytics();

  const selectedAnalytics = analytics.find(a => a.id === analyticsId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!analyticsId) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ninguna analítica",
        variant: "destructive",
      });
      return;
    }

    try {
      await processMutation.mutateAsync({
        analyticsId,
        webhookUrl: webhookUrl.trim() || undefined
      });

      toast({
        title: "Éxito",
        description: "Procesamiento iniciado correctamente",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Process error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al iniciar el procesamiento",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Procesar Analítica
          </DialogTitle>
        </DialogHeader>
        
        {selectedAnalytics && (
          <div className="mb-4 p-3 bg-healz-cream/20 rounded-lg">
            <div className="font-medium">
              {selectedAnalytics.patient?.first_name} {selectedAnalytics.patient?.last_name}
            </div>
            <div className="text-sm text-gray-600">
              {selectedAnalytics.file_name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Subida: {new Date(selectedAnalytics.upload_date).toLocaleDateString('es-ES')}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">URL del Webhook N8N</Label>
            <Input
              id="webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://joinhealz.app.n8n.cloud/webhook/analitica"
              required
            />
            <p className="text-xs text-gray-500">
              La analítica será enviada a N8N para extraer los biomarcadores
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">¿Qué hace el procesamiento?</p>
              <p>N8N analizará el archivo y extraerá automáticamente los biomarcadores para asociarlos al paciente.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={processMutation.isPending || !analyticsId}
            >
              {processMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Procesar Analítica
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
