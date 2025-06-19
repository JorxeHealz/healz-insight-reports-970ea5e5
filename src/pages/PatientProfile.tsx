import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePatientBySlug } from '../hooks/usePatientBySlug';
import { useUpdatePatient, useDeletePatient } from '../hooks/usePatients';
import { PatientForm } from '../components/patients/PatientForm';
import { DeletePatientDialog } from '../components/patients/DeletePatientDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from '../hooks/use-toast';
import { Edit, Mail, Phone, Calendar, User, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generatePatientSlug } from '../utils/patientSlug';

const PatientProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: patient, isLoading, error } = usePatientBySlug(slug || '');
  const deletePatient = useDeletePatient();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Activo', color: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
      pending: { variant: 'outline' as const, label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getGenderLabel = (gender: string) => {
    const genderLabels = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro'
    };
    return genderLabels[gender as keyof typeof genderLabels] || gender;
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDelete = async () => {
    if (!patient) return;
    
    try {
      await deletePatient.mutateAsync(patient.id);
      toast({
        title: "Paciente eliminado",
        description: `${patient.first_name} ${patient.last_name} ha sido eliminado correctamente`
      });
      navigate('/patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el paciente",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-healz-brown mb-2">Paciente no encontrado</h2>
            <p className="text-healz-brown/70 mb-4">
              No se pudo encontrar el paciente solicitado.
            </p>
            <Button onClick={() => navigate('/patients')}>
              Volver a Pacientes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = calculateAge(patient.date_of_birth);
  const patientSlug = generatePatientSlug(patient);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <BreadcrumbPage>{patient.first_name} {patient.last_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Formulario de edición */}
      {showEditForm && (
        <Card className="border-healz-orange/20">
          <CardHeader>
            <CardTitle>Editar Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientForm 
              patient={patient}
              onSuccess={() => setShowEditForm(false)}
              onCancel={() => setShowEditForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Header del perfil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl bg-healz-teal text-white">
                {getInitials(patient.first_name, patient.last_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-healz-brown">
                  {patient.first_name} {patient.last_name}
                </h1>
                {getStatusBadge(patient.status)}
              </div>
              
              <div className="flex items-center gap-4 text-healz-brown/70">
                {age && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{age} años</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span>{getGenderLabel(patient.gender)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowEditForm(true)}
                className="bg-healz-teal hover:bg-healz-teal/90"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="text-healz-red border-healz-red hover:bg-healz-red hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-healz-brown/70">Email</label>
              <p className="text-healz-brown">{patient.email}</p>
            </div>
            {patient.phone && (
              <div>
                <label className="text-sm font-medium text-healz-brown/70">Teléfono</label>
                <p className="text-healz-brown">{patient.phone}</p>
              </div>
            )}
            {patient.date_of_birth && (
              <div>
                <label className="text-sm font-medium text-healz-brown/70">Fecha de Nacimiento</label>
                <p className="text-healz-brown">
                  {format(new Date(patient.date_of_birth), 'PPP', { locale: es })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.last_visit && (
              <div>
                <label className="text-sm font-medium text-healz-brown/70">Última Visita</label>
                <p className="text-healz-brown">
                  {format(new Date(patient.last_visit), 'PPP', { locale: es })}
                </p>
              </div>
            )}
            {patient.next_visit && (
              <div>
                <label className="text-sm font-medium text-healz-brown/70">Próxima Visita</label>
                <p className="text-healz-brown">
                  {format(new Date(patient.next_visit), 'PPP', { locale: es })}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-healz-brown/70">Registro Creado</label>
              <p className="text-healz-brown">
                {format(new Date(patient.created_at), 'PPP', { locale: es })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notas del paciente */}
      {patient.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-healz-brown whitespace-pre-wrap">{patient.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link to={`/paciente/${patientSlug}/forms`}>
                <FileText className="h-4 w-4 mr-2" />
                Gestionar Formularios
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Mensaje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para eliminar */}
      <DeletePatientDialog
        patient={patient}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deletePatient.isPending}
      />
    </div>
  );
};

export default PatientProfile;
