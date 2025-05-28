
import React, { useState } from 'react';
import type { Tables } from '../../integrations/supabase/types';
import { PatientCard } from './PatientCard';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

type Patient = Tables<'patients'>;

interface PatientListProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
}

export const PatientList = ({ patients, onEditPatient }: PatientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-healz-brown/50" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de pacientes */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-8 text-healz-brown/70">
          {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda' : 'No hay pacientes registrados aún'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={onEditPatient}
            />
          ))}
        </div>
      )}
    </div>
  );
};
