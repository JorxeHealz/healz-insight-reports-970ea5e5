
import React from 'react';
import { Patient } from '../../types/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface DeletePatientDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeletePatientDialog = ({
  patient,
  open,
  onOpenChange,
  onConfirm,
  isDeleting
}: DeletePatientDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-healz-red">
            ¿Eliminar paciente?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar a{' '}
            <strong>{patient.first_name} {patient.last_name}</strong>.
            <br />
            <br />
            Esta acción no se puede deshacer. Se eliminarán todos los datos
            asociados al paciente, incluyendo:
            <br />
            • Biomarcadores registrados
            <br />
            • Respuestas de cuestionarios
            <br />
            • Formularios enviados
            <br />
            • Reportes generados
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-healz-red hover:bg-healz-red/90"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
