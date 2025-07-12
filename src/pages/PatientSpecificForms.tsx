
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatientBySlug } from '../hooks/usePatientBySlug';
import { usePatientForms, useCreatePatientForm } from '../hooks/usePatientForms';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from '../hooks/use-toast';
import { CreatePatientFormDialog } from '../components/forms/CreatePatientFormDialog';
import { FormResultsModal } from '../components/forms/FormResultsModal';
import { PatientFormsBreadcrumb } from '../components/forms/PatientFormsBreadcrumb';
import { PatientFormsHeader } from '../components/forms/PatientFormsHeader';
import { PatientFormsTable } from '../components/forms/PatientFormsTable';
import { PatientForm } from '../types/forms';
import { generatePatientSlug } from '../utils/patientSlug';

const PatientSpecificForms = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatientBySlug(slug || '');
  const { data: allForms, isLoading: formsLoading } = usePatientForms();
  const createPatientForm = useCreatePatientForm();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<PatientForm | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  // Filtrar formularios para mostrar solo los de este paciente
  const patientForms = useMemo(() => {
    if (!allForms || !patient) return [];
    return allForms.filter(form => form.patient_id === patient.id);
  }, [allForms, patient]);

  const handleCopyLink = (token: string, patientName: string) => {
    const url = `${window.location.origin}/formulario/${token}`;
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

  if (patientLoading || formsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-healz-brown mb-2">Paciente no encontrado</h2>
          <p className="text-healz-brown/70 mb-4">
            No se pudo encontrar el paciente solicitado.
          </p>
          <Button asChild>
            <Link to="/pacientes">Volver a Pacientes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const patientName = `${patient.first_name} ${patient.last_name}`;
  const patientSlug = generatePatientSlug(patient);

  return (
    <div className="space-y-6">
      <PatientFormsBreadcrumb 
        patientName={patientName} 
        patientSlug={patientSlug} 
      />

      <PatientFormsHeader 
        patientName={patientName}
        patientSlug={patientSlug}
        onCreateForm={() => setIsCreateDialogOpen(true)}
      />

      <PatientFormsTable 
        forms={patientForms}
        patientName={patientName}
        onCopyLink={handleCopyLink}
        onViewResults={handleViewResults}
      />

      <CreatePatientFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        preselectedPatientId={patient.id}
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

export default PatientSpecificForms;
