
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PatientList } from '../components/patients/PatientList';
import { PatientForm } from '../components/patients/PatientForm';
import { usePatients } from '../hooks/usePatients';
import type { Tables } from '../integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

type Patient = Tables<'patients'>;

const Patients = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const { data: patients, isLoading } = usePatients();

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
    <Layout title="Gestión de Pacientes">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-healz-brown">Gestión de Pacientes</h1>
          <Button 
            onClick={handleCreatePatient}
            className="bg-healz-teal hover:bg-healz-teal/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

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
            <CardTitle>Pacientes Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
                <p className="mt-2 text-healz-brown/70">Cargando pacientes...</p>
              </div>
            ) : (
              <PatientList 
                patients={patients || []}
                onEditPatient={handleEditPatient}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Patients;
