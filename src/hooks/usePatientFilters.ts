
import { useState, useMemo } from 'react';
import type { Tables } from '../integrations/supabase/types';

type Patient = Tables<'patients'>;

export type PatientFilter = 'all' | 'active_month' | 'no_consultation';

export const usePatientFilters = (patients: Patient[] = []) => {
  const [activeFilter, setActiveFilter] = useState<PatientFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Aplicar filtro por categoría
    switch (activeFilter) {
      case 'active_month':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filtered = patients.filter(patient => 
          patient.last_visit && new Date(patient.last_visit) >= oneMonthAgo
        );
        break;
      case 'no_consultation':
        filtered = patients.filter(patient => !patient.next_visit);
        break;
      default:
        filtered = patients;
    }

    // Aplicar búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.first_name.toLowerCase().includes(searchLower) ||
        patient.last_name.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [patients, activeFilter, searchTerm]);

  return {
    filteredPatients,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
  };
};
