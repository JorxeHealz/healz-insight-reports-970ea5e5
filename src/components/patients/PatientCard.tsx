
import React from 'react';
import { Link } from 'react-router-dom';
import type { Tables } from '../../integrations/supabase/types';
import { useDeletePatient } from '../../hooks/usePatients';
import { generatePatientSlug } from '../../utils/patientSlug';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DeletePatientDialog } from './DeletePatientDialog';
import { toast } from '../../hooks/use-toast';
import { Edit, Trash2, Mail, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Patient = Tables<'patients'>;

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
}

export const PatientCard = ({ patient, onEdit }: PatientCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const deletePatient = useDeletePatient();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Activo' },
      inactive: { variant: 'secondary' as const, label: 'Inactivo' },
      pending: { variant: 'outline' as const, label: 'Pendiente' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getGenderLabel = (gender: string) => {
    const genderLabels = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro'
    };
    return genderLabels[gender as keyof typeof genderLabels] || gender;
  };

  const handleDelete = async () => {
    try {
      await deletePatient.mutateAsync(patient.id);
      toast({
        title: "Paciente eliminado",
        description: `${patient.first_name} ${patient.last_name} ha sido eliminado correctamente`
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el paciente",
        variant: "destructive"
      });
    }
  };

  const patientSlug = generatePatientSlug(patient);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header con nombre y estado */}
            <div className="flex justify-between items-start">
              <div>
                <Link 
                  to={`/paciente/${patientSlug}`}
                  className="font-semibold text-healz-brown hover:text-healz-teal transition-colors"
                >
                  {patient.first_name} {patient.last_name}
                </Link>
                <div className="flex items-center gap-1 text-sm text-healz-brown/70 mt-1">
                  <User className="h-3 w-3" />
                  <span>{getGenderLabel(patient.gender)}</span>
                </div>
              </div>
              {getStatusBadge(patient.status)}
            </div>

            {/* Información básica */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-healz-brown/70">
                <Mail className="h-3 w-3" />
                <span>{patient.email}</span>
              </div>
              
              {patient.date_of_birth && (
                <div className="flex items-center gap-2 text-healz-brown/70">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(patient.date_of_birth), 'PPP', { locale: es })}
                  </span>
                </div>
              )}

              {patient.phone && (
                <div className="text-healz-brown/70">
                  Tel: {patient.phone}
                </div>
              )}
            </div>

            {/* Fechas de visitas */}
            {(patient.last_visit || patient.next_visit) && (
              <div className="text-xs text-healz-brown/60 space-y-1">
                {patient.last_visit && (
                  <div>
                    Última visita: {format(new Date(patient.last_visit), 'PPP', { locale: es })}
                  </div>
                )}
                {patient.next_visit && (
                  <div>
                    Próxima visita: {format(new Date(patient.next_visit), 'PPP', { locale: es })}
                  </div>
                )}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(patient)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="text-healz-red border-healz-red hover:bg-healz-red hover:text-white"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeletePatientDialog
        patient={patient}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deletePatient.isPending}
      />
    </>
  );
};
