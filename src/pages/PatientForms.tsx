import React, { useState, useMemo } from 'react';
import { usePatientForms, useCreatePatientForm, useProcessFormWithN8N } from '../hooks/usePatientForms';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { CreatePatientFormDialog } from '../components/forms/CreatePatientFormDialog';
import { ProcessingStatus } from '../components/forms/ProcessingStatus';
import { QuestionsSeed } from '../components/forms/QuestionsSeed';
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

  const formatPatientName = (patient: any) => {
    if (!patient) return 'Paciente sin datos';
    
    const firstName = patient.first_name || '';
    const lastName = patient.last_name || '';
    
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    return fullName || 'Sin nombre';
  };

  const handleProcessForm = async (formId: string) => {
    try {
      await processForm.mutateAsync({ 
        form_id: formId,
        n8n_webhook_url: 'https://joinhealz.app.n8n.cloud/webhook/formulario'
      });
      toast({
        title: "Formulario enviado a n8n",
        description: "El formulario ha sido enviado para su procesamiento."
      });
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario para su procesamiento.",
        variant: "destructive"
      });
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

      <QuestionsSeed />
      <ProcessingStatus />

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
            isProcessing={processForm.isPending}
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
