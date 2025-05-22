
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types/supabase';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface PatientSelectorProps {
  onSelectPatient: (patient: Patient) => void;
}

export const PatientSelector = ({ onSelectPatient }: PatientSelectorProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('first_name', { ascending: true });

        if (error) throw error;
        setPatients(data);
      } catch (error: any) {
        console.error('Error fetching patients:', error);
        setError('No se pudieron cargar los pacientes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Seleccionar paciente</h3>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar por nombre o email..."
          className="w-full p-2 pl-10 border border-healz-teal/30 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-healz-teal/60"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-red border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Cargando...</span>
          </div>
          <p className="mt-2 text-healz-brown/70">Cargando pacientes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-healz-red">
          {error}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-8 text-healz-brown/70">
          No se encontraron pacientes con ese criterio de búsqueda
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="cursor-pointer hover:border-healz-teal transition-colors"
              onClick={() => onSelectPatient(patient)}
            >
              <CardContent className="p-4">
                <h4 className="font-medium text-healz-brown">
                  {patient.first_name} {patient.last_name}
                </h4>
                <div className="text-sm text-healz-brown/70 mt-1">
                  <div>{patient.email}</div>
                  <div className="flex justify-between mt-1">
                    <span>{patient.gender}</span>
                    <span>{patient.age} años</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
