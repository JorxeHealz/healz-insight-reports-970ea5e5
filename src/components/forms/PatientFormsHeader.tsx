
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface PatientFormsHeaderProps {
  patientName: string;
  patientSlug: string;
  onCreateForm: () => void;
}

export const PatientFormsHeader = ({ patientName, patientSlug, onCreateForm }: PatientFormsHeaderProps) => {
  return (
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
          onClick={onCreateForm}
          className="bg-healz-green hover:bg-healz-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Formulario
        </Button>
      </div>
    </div>
  );
};
