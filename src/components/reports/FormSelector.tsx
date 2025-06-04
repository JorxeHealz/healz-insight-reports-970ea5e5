
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientForm {
  id: string;
  created_at: string;
  completed_at: string | null;
  status: string;
  form_token: string;
}

interface FormSelectorProps {
  patient: Patient;
  onSelectForm: (form: PatientForm | null) => void;
  onBack: () => void;
  onNext: () => void;
  selectedForm: PatientForm | null;
}

export const FormSelector = ({ patient, onSelectForm, onBack, onNext, selectedForm }: FormSelectorProps) => {
  const [forms, setForms] = useState<PatientForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientForms = async () => {
      try {
        const { data, error } = await supabase
          .from('patient_forms')
          .select('*')
          .eq('patient_id', patient.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });

        if (error) throw error;
        setForms(data || []);
      } catch (err: any) {
        console.error('Error fetching patient forms:', err);
        setError('No se pudieron cargar los formularios del paciente');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientForms();
  }, [patient.id]);

  const handleFormSelect = (form: PatientForm) => {
    onSelectForm(form);
  };

  const handleCreateWithoutForm = () => {
    onSelectForm(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Seleccionar formulario base</h3>
      
      <div className="bg-healz-cream/30 p-4 rounded-lg">
        <div className="text-healz-brown font-medium mb-2">
          Paciente: {patient.first_name} {patient.last_name}
        </div>
        <div className="text-sm text-healz-brown/70">
          Selecciona un formulario completado para generar el informe basado en esos datos, 
          o continúa sin formulario para crear un informe en blanco.
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-red border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Cargando...</span>
          </div>
          <p className="mt-2 text-healz-brown/70">Cargando formularios...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-healz-red">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {forms.length > 0 && (
            <div>
              <h4 className="font-medium text-healz-brown mb-3">Formularios completados:</h4>
              <div className="grid grid-cols-1 gap-3">
                {forms.map((form) => (
                  <Card 
                    key={form.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedForm?.id === form.id 
                        ? 'border-healz-red bg-healz-red/5' 
                        : 'hover:border-healz-teal'
                    }`}
                    onClick={() => handleFormSelect(form)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-healz-brown">
                            Formulario #{form.form_token.slice(-8)}
                          </div>
                          <div className="text-sm text-healz-brown/70 mt-1">
                            Completado: {form.completed_at 
                              ? formatDistanceToNow(new Date(form.completed_at), { 
                                  addSuffix: true, 
                                  locale: es 
                                })
                              : 'Fecha no disponible'
                            }
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          selectedForm?.id === form.id 
                            ? 'bg-healz-red text-white' 
                            : 'bg-healz-green/20 text-healz-green'
                        }`}>
                          {selectedForm?.id === form.id ? 'Seleccionado' : 'Completado'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-healz-brown mb-3">Opciones adicionales:</h4>
            <Card 
              className={`cursor-pointer transition-colors ${
                selectedForm === null 
                  ? 'border-healz-red bg-healz-red/5' 
                  : 'hover:border-healz-teal border-dashed'
              }`}
              onClick={handleCreateWithoutForm}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-healz-brown">
                      Crear informe sin formulario base
                    </div>
                    <div className="text-sm text-healz-brown/70 mt-1">
                      Genera un informe en blanco para introducir datos manualmente
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    selectedForm === null 
                      ? 'bg-healz-red text-white' 
                      : 'bg-healz-brown/20 text-healz-brown'
                  }`}>
                    {selectedForm === null ? 'Seleccionado' : 'Disponible'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedForm === undefined}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
