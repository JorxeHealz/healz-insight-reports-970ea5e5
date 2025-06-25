
import React, { useState, useMemo } from 'react';
import { usePatientForms, useCreatePatientForm, useProcessFormWithN8N } from '../hooks/usePatientForms';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { CreatePatientFormDialog } from '../components/forms/CreatePatientFormDialog';
import { FormResultsModal } from '../components/forms/FormResultsModal';
import { PatientFormsFilters } from '../components/forms/PatientFormsFilters';
import { PatientFormsContent } from '../components/forms/PatientFormsContent';
import { PatientForm } from '../types/forms';

const PatientForms = () => {
  const { data: forms, isLoading, error } = usePatientForms();
  const createPatientForm = useCreatePatientForm();
  const processForm = useProcessFormWithN8N();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<PatientForm | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processingFormId, setProcessingFormId] = useState<string | null>(null);

  const formatPatientName = (patient: any) => {
    if (!patient) return 'Paciente sin datos';
    
    const firstName = patient.first_name || '';
    const lastName = patient.last_name || '';
    
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    return fullName || 'Sin nombre';
  };

  const handleProcessForm = async (formId: string) => {
    setProcessingFormId(formId);
    
    try {
      const result = await processForm.mutateAsync({ 
        form_id: formId,
        n8n_webhook_url: 'https://joinhealz.app.n8n.cloud/webhook/formulario'
      });

      // Verificar si la respuesta indica éxito
      if (result?.success) {
        toast({
          title: "✅ Procesamiento iniciado",
          description: "El formulario se está procesando correctamente en n8n."
        });
      } else {
        // Si no hay indicador de éxito claro, mostrar advertencia
        toast({
          title: "⚠️ Procesamiento enviado",
          description: "El formulario fue enviado pero no se confirmó el procesamiento.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error al procesar el formulario:", error);
      
      // Mostrar diferentes mensajes según el tipo de error
      let errorMessage = "No se pudo procesar el formulario.";
      let errorTitle = "Error de procesamiento";
      
      if (error.message?.includes('webhook')) {
        errorMessage = "Error al conectar con el servicio de procesamiento.";
        errorTitle = "Error de conexión";
      } else if (error.message?.includes('not found')) {
        errorMessage = "El formulario no fue encontrado o no está completado.";
        errorTitle = "Formulario no disponible";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "El procesamiento tardó demasiado. Inténtalo de nuevo.";
        errorTitle = "Tiempo agotado";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setProcessingFormId(null);
    }
  };

  const handleCopyLink = (token: string, patientName: string) => {
    const url = `${window.location.origin}/form/${token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: `La URL del formulario para ${patientName} se ha copiado al portapapeles`
    });
  };

  const handleViewResults = (form: PatientForm) => {
    setSelectedForm(form);
    setIsResultsModalOpen(true);
  };

  const filteredForms = useMemo(() => {
    if (!forms) return [];
    
    return forms.filter(form => {
      const patientName = formatPatientName(form.patient);
      const matchesSearch = searchTerm === '' || 
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.patient?.email && form.patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [forms, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-healz-brown">Gestión de Formularios</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-healz-green hover:bg-healz-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Formulario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formularios Activos</CardTitle>
          <PatientFormsFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </CardHeader>
        <CardContent>
          <PatientFormsContent
            filteredForms={filteredForms}
            isLoading={isLoading}
            error={error}
            onCopyLink={handleCopyLink}
            onProcessForm={handleProcessForm}
            onViewResults={handleViewResults}
            isProcessing={processingFormId !== null}
            allFormsCount={forms?.length || 0}
          />
        </CardContent>
      </Card>

      <CreatePatientFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSuccess={() => {
          setIsCreateDialogOpen(false);
          toast({
            title: "Formulario creado",
            description: "El formulario ha sido creado correctamente."
          });
        }}
        onCreateError={(error: Error) => {
          toast({
            title: "Error",
            description: `No se pudo crear el formulario: ${error.message}`,
            variant: "destructive"
          });
        }}
      />

      <FormResultsModal
        open={isResultsModalOpen}
        onOpenChange={setIsResultsModalOpen}
        form={selectedForm}
      />
    </div>
  );
};

export default PatientForms;
