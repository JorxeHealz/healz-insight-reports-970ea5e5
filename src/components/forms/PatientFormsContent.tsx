
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table';
import { PatientFormsTableRow } from './PatientFormsTableRow';
import { PatientForm } from '../../types/forms';

interface PatientFormsContentProps {
  filteredForms: PatientForm[];
  isLoading: boolean;
  error: Error | null;
  onCopyLink: (token: string, patientName: string) => void;
  onViewResults: (form: PatientForm) => void;
  allFormsCount: number;
}

export const PatientFormsContent = ({ 
  filteredForms, 
  isLoading, 
  error, 
  onCopyLink, 
  onViewResults, 
  allFormsCount 
}: PatientFormsContentProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
        <p className="mt-2 text-healz-brown">Cargando formularios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error al cargar formularios: {error.message}
      </div>
    );
  }

  if (filteredForms && filteredForms.length > 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.map((form) => (
              <PatientFormsTableRow
                key={form.id}
                form={form}
                onCopyLink={onCopyLink}
                onViewResults={onViewResults}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-500">
      {allFormsCount > 0 ? 
        'No se encontraron formularios que coincidan con los filtros aplicados' :
        'No hay formularios creados'
      }
    </div>
  );
};
