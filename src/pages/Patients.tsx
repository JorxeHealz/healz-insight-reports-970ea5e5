
import React, { useState } from 'react';
import { PatientList } from '../components/patients/PatientList';
import { PatientForm } from '../components/patients/PatientForm';
import { PatientFilters } from '../components/patients/PatientFilters';
import { PatientStats } from '../components/patients/PatientStats';
import { PatientSearchBar } from '../components/patients/PatientSearchBar';
import { useAssignedPatients } from '../hooks/useAssignedPatients';
import { usePatientFilters } from '../hooks/usePatientFilters';
import { usePatientStats } from '../hooks/usePatientStats';
import type { Tables } from '../integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

type Patient = Tables<'patients'>;

const Patients = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const { data: patients, isLoading } = useAssignedPatients();
  const stats = usePatientStats();
  
  const {
    filteredPatients,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
  } = usePatientFilters(patients);

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setShowCreateForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingPatient(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-80 space-y-4">
          <PatientFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            stats={{
              totalPatients: stats.totalPatients,
              activeMonth: stats.activeMonth,
              noConsultation: stats.noConsultation,
            }}
          />
          <PatientStats
            stats={{
              pendingForms: stats.pendingForms,
              weeklyActivity: stats.weeklyActivity,
            }}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-healz-brown">Gestión de Pacientes</h1>
              <p className="text-healz-brown/70 mt-1">
                Administra tu cartera de pacientes
              </p>
            </div>
            <Button 
              onClick={handleCreatePatient}
              className="bg-healz-teal hover:bg-healz-teal/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Paciente
            </Button>
          </div>

          {/* Barra de búsqueda */}
          <PatientSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            resultCount={filteredPatients.length}
          />

          {/* Formulario para crear/editar paciente */}
          {showCreateForm && (
            <Card className="border-healz-orange/20">
              <CardHeader>
                <CardTitle>
                  {editingPatient ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatientForm 
                  patient={editingPatient}
                  onSuccess={handleCloseForm}
                  onCancel={handleCloseForm}
                />
              </CardContent>
            </Card>
          )}

          {/* Lista de pacientes */}
          <Card>
            <CardHeader>
              <CardTitle>
                Pacientes{' '}
                {activeFilter === 'active_month' && 'Activos Este Mes'}
                {activeFilter === 'no_consultation' && 'Sin Consulta Agendada'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
                  <p className="mt-2 text-healz-brown/70">Cargando pacientes...</p>
                </div>
              ) : (
                <PatientList 
                  patients={filteredPatients}
                  onEditPatient={handleEditPatient}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Patients;
