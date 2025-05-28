import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PatientSelector } from '../components/reports/PatientSelector';
import { ProcessingStatus } from '../components/ProcessingStatus';
import { usePatientForms, useCreatePatientForm, useProcessFormWithN8N } from '../hooks/usePatientForms';
import { useProcessingQueue } from '../hooks/useProcessingQueue';
import { Patient } from '../types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Settings, ExternalLink, PlayCircle } from 'lucide-react';

const PatientForms = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [showWebhookSettings, setShowWebhookSettings] = useState<string | null>(null);

  const { data: forms, isLoading: formsLoading } = usePatientForms();
  const { data: processingQueue } = useProcessingQueue();
  const createForm = useCreatePatientForm();
  const processWithN8N = useProcessFormWithN8N();

  const handleCreateForm = async () => {
    if (!selectedPatient) return;

    try {
      await createForm.mutateAsync({
        patient_id: selectedPatient.id,
        notes: notes.trim() || undefined
      });
      
      toast({
        title: "Formulario creado",
        description: `Se ha creado un formulario para ${selectedPatient.first_name} ${selectedPatient.last_name}`
      });
      
      setSelectedPatient(null);
      setNotes('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el formulario",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'Pendiente' },
      completed: { variant: 'default' as const, label: 'Completado' },
      processed: { variant: 'secondary' as const, label: 'Procesado' },
      expired: { variant: 'destructive' as const, label: 'Expirado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getFormUrl = (token: string) => {
    return `${window.location.origin}/form/${token}`;
  };

  const copyFormUrl = (token: string) => {
    const url = getFormUrl(token);
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: "La URL del formulario se ha copiado al portapapeles"
    });
  };

  const handleProcessWithN8N = async (formId: string, webhookUrl?: string) => {
    try {
      await processWithN8N.mutateAsync({
        form_id: formId,
        n8n_webhook_url: webhookUrl
      });
      
      toast({
        title: "Procesamiento iniciado",
        description: "El formulario se ha enviado a n8n para procesamiento"
      });
      
      setShowWebhookSettings(null);
      setCustomWebhookUrl('');
    } catch (error) {
      console.error('Error processing with n8n:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el procesamiento con n8n",
        variant: "destructive"
      });
    }
  };

  const isFormInProcessing = (formId: string) => {
    return processingQueue?.some(entry => 
      entry.form_id === formId && 
      ['pending', 'processing'].includes(entry.status)
    );
  };

  const isFormProcessed = (formId: string) => {
    return processingQueue?.some(entry => 
      entry.form_id === formId && 
      entry.status === 'completed'
    );
  };

  return (
    <Layout title="Gestión de Formularios">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-healz-brown">Gestión de Formularios</h1>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-healz-teal hover:bg-healz-teal/90"
          >
            Crear Formulario
          </Button>
        </div>

        {/* Modal para crear formulario */}
        {showCreateForm && (
          <Card className="border-healz-orange/20">
            <CardHeader>
              <CardTitle>Crear Nuevo Formulario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedPatient ? (
                <PatientSelector onSelectPatient={setSelectedPatient} />
              ) : (
                <div className="space-y-4">
                  <div className="bg-healz-cream/30 p-4 rounded-md">
                    <h3 className="font-medium">Paciente seleccionado:</h3>
                    <p>{selectedPatient.first_name} {selectedPatient.last_name}</p>
                    <p className="text-sm text-healz-brown/70">{selectedPatient.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notas (opcional)</label>
                    <Textarea
                      placeholder="Añadir notas sobre este formulario..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateForm} 
                      disabled={createForm.isPending}
                      className="bg-healz-green hover:bg-healz-green/90"
                    >
                      {createForm.isPending ? 'Creando...' : 'Crear Formulario'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setSelectedPatient(null);
                        setNotes('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lista de formularios */}
        <Card>
          <CardHeader>
            <CardTitle>Formularios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            {formsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
                <p className="mt-2 text-healz-brown/70">Cargando formularios...</p>
              </div>
            ) : !forms || forms.length === 0 ? (
              <div className="text-center py-8 text-healz-brown/70">
                No hay formularios creados aún
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => (
                  <div key={form.id} className="border border-healz-brown/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">
                          {form.patient?.first_name} {form.patient?.last_name}
                        </h3>
                        <p className="text-sm text-healz-brown/70">{form.patient?.email}</p>
                      </div>
                      {getStatusBadge(form.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-healz-brown/70">Creado:</p>
                        <p className="text-sm">{format(new Date(form.created_at), 'PPP', { locale: es })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-healz-brown/70">Expira:</p>
                        <p className="text-sm">{format(new Date(form.expires_at), 'PPP', { locale: es })}</p>
                      </div>
                    </div>

                    {form.notes && (
                      <div className="mb-3">
                        <p className="text-xs text-healz-brown/70 mb-1">Notas:</p>
                        <p className="text-sm bg-healz-cream/20 p-2 rounded">{form.notes}</p>
                      </div>
                    )}

                    {/* Estado de procesamiento */}
                    {(isFormInProcessing(form.id) || isFormProcessed(form.id)) && (
                      <div className="mb-3">
                        <ProcessingStatus formId={form.id} />
                      </div>
                    )}

                    {/* Configuración de webhook personalizado */}
                    {showWebhookSettings === form.id && (
                      <div className="mb-3 p-3 bg-healz-blue/10 rounded-md border border-healz-blue/20">
                        <h4 className="text-sm font-medium mb-2 text-healz-brown">
                          Configuración de Webhook n8n
                        </h4>
                        <div className="space-y-2">
                          <Input
                            placeholder="https://tu-instancia.n8n.io/webhook/..."
                            value={customWebhookUrl}
                            onChange={(e) => setCustomWebhookUrl(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleProcessWithN8N(form.id, customWebhookUrl)}
                              disabled={processWithN8N.isPending}
                              className="bg-healz-orange hover:bg-healz-orange/90"
                            >
                              {processWithN8N.isPending ? 'Procesando...' : 'Procesar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowWebhookSettings(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyFormUrl(form.form_token)}
                      >
                        Copiar URL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getFormUrl(form.form_token), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver Formulario
                      </Button>
                      
                      {form.status === 'completed' && !isFormInProcessing(form.id) && !isFormProcessed(form.id) && (
                        <>
                          <Button
                            size="sm"
                            className="bg-healz-orange hover:bg-healz-orange/90"
                            onClick={() => handleProcessWithN8N(form.id)}
                            disabled={processWithN8N.isPending}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Procesar con n8n
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowWebhookSettings(form.id)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Webhook Custom
                          </Button>
                        </>
                      )}
                      
                      {isFormProcessed(form.id) && (
                        <Button
                          size="sm"
                          className="bg-healz-green hover:bg-healz-green/90"
                          onClick={() => {
                            // TODO: Navegar al reporte generado
                            toast({
                              title: "Próximamente",
                              description: "Navegación al reporte generado"
                            });
                          }}
                        >
                          Ver Reporte
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientForms;
