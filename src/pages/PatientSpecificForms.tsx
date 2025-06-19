
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatientBySlug } from '../hooks/usePatientBySlug';
import { usePatientForms, useCreatePatientForm, useProcessFormWithN8N } from '../hooks/usePatientForms';
import { Plus, Copy, Eye, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from '../hooks/use-toast';
import { CreatePatientFormDialog } from '../components/forms/CreatePatientFormDialog';
import { FormResultsModal } from '../components/forms/FormResultsModal';
import { PatientForm } from '../types/forms';
import { generatePatientSlug } from '../utils/patientSlug';

const PatientSpecificForms = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatientBySlug(slug || '');
  const { data: allForms, isLoading: formsLoading } = usePatientForms();
  const createPatientForm = useCreatePatientForm();
  const processForm = useProcessFormWithN8N();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<PatientForm | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  // Filtrar formularios para mostrar solo los de este paciente
  const patientForms = useMemo(() => {
    if (!allForms || !patient) return [];
    return allForms.filter(form => form.patient_id === patient.id);
  }, [allForms, patient]);

  const handleProcessForm = async (formId: string) => {
    try {
      await processForm.mutateAsync({ form_id: formId });
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
      processed: { label: 'Procesado', color: 'bg-blue-100 text-blue-800' },
      expired: { label: 'Expirado', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: 'Expirado', urgent: true };
    if (days === 0) return { text: 'Expira hoy', urgent: true };
    if (days === 1) return { text: 'Expira mañana', urgent: true };
    if (days <= 3) return { text: `${days} días`, urgent: true };
    
    return { text: `${days} días`, urgent: false };
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
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-healz-brown mb-2">Paciente no encontrado</h2>
            <p className="text-healz-brown/70 mb-4">
              No se pudo encontrar el paciente solicitado.
            </p>
            <Button asChild>
              <Link to="/patients">Volver a Pacientes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const patientName = `${patient.first_name} ${patient.last_name}`;
  const patientSlug = generatePatientSlug(patient);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/patients">Pacientes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/paciente/${patientSlug}`}>{patientName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Formularios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-healz-brown">Formularios de {patientName}</h1>
          <p className="text-healz-brown/70 mt-1">Gestiona los formularios específicos de este paciente</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to={`/paciente/${patientSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Perfil
            </Link>
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-healz-green hover:bg-healz-green/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Formulario
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formularios Activos</CardTitle>
        </CardHeader>
        <CardContent>
          {patientForms && patientForms.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientForms.map((form) => {
                    const timeToExpiry = getTimeUntilExpiry(form.expires_at);
                    
                    return (
                      <TableRow 
                        key={form.id}
                        className="cursor-pointer hover:bg-healz-cream/20"
                        onClick={() => form.status === 'completed' && handleViewResults(form)}
                      >
                        <TableCell>
                          {getStatusBadge(form.status)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(form.created_at).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  {timeToExpiry.urgent && (
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  )}
                                  <span className={`text-sm ${timeToExpiry.urgent ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                                    {timeToExpiry.text}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Expira: {new Date(form.expires_at).toLocaleDateString('es-ES')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {form.status === 'completed' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewResults(form);
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver resultados del formulario</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {form.status === 'pending' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyLink(form.form_token, patientName);
                                      }}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copiar enlace del formulario</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {form.status === 'completed' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProcessForm(form.id);
                                      }}
                                      disabled={processForm.isPending}
                                    >
                                      {processForm.isPending ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                                      ) : (
                                        <Clock className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Procesar con n8n</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay formularios creados para este paciente
            </div>
          )}
        </CardContent>
      </Card>

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
