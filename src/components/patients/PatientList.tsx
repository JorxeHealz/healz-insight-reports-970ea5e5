
import React from 'react';
import type { Tables } from '../../integrations/supabase/types';
import { PatientCard } from './PatientCard';

type Patient = Tables<'patients'>;

interface PatientListProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
}

export const PatientList = ({ patients, onEditPatient }: PatientListProps) => {
  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-healz-cream rounded-full mb-4">
          <svg className="w-8 h-8 text-healz-brown/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-healz-brown mb-2">
          No se encontraron pacientes
        </h3>
        <p className="text-healz-brown/60">
          No hay pacientes que coincidan con los filtros seleccionados
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onEdit={onEditPatient}
        />
      ))}
    </div>
  );
};
