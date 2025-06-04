
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Patient, PatientSnapshot } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateAge } from '../../utils/dateUtils';

interface PatientForm {
  id: string;
  created_at: string;
  completed_at: string | null;
  status: string;
  form_token: string;
}

interface DataReviewProps {
  patient: Patient;
  selectedForm: PatientForm | null | undefined;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
}

interface BiomarkerGroup {
  category: string;
  biomarkers: PatientSnapshot[];
}

export const DataReview = ({ patient, selectedForm, onBack, onNext, isLoading }: DataReviewProps) => {
  const [snapshots, setSnapshots] = useState<PatientSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [biomarkerGroups, setBiomarkerGroups] = useState<BiomarkerGroup[]>([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        let query = supabase
          .from('patient_snapshot')
          .select('*')
          .eq('patient_id', patient.id);

        // Si hay un formulario seleccionado, mostrar nota informativa
        // pero mantenemos la consulta general por patient_id para mostrar todos los datos disponibles
        
        const { data, error } = await query;

        if (error) throw error;

        setSnapshots(data || []);

        // Group biomarkers by category (this is a simplified version)
        // In a real app, you would have a proper category field in the biomarkers table
        const groups: { [key: string]: PatientSnapshot[] } = {};
        data.forEach(snapshot => {
          // Simple category assignment based on biomarker name
          // In real app, use the actual category from the database
          let category = 'General';
          if (snapshot.biomarker_type.toLowerCase().includes('glucose')) category = 'Metabolic';
          else if (['hdl', 'ldl', 'cholesterol'].some(term => snapshot.biomarker_type.toLowerCase().includes(term))) category = 'Cardiovascular';
          else if (['cortisol', 'dhea'].some(term => snapshot.biomarker_type.toLowerCase().includes(term))) category = 'Hormonal';
          
          if (!groups[category]) groups[category] = [];
          groups[category].push(snapshot);
        });
        
        // Convert to array format for rendering
        const groupsArray = Object.entries(groups).map(([category, biomarkers]) => ({
          category,
          biomarkers
        }));
        
        setBiomarkerGroups(groupsArray);
      } catch (err: any) {
        console.error('Error fetching patient data:', err);
        setError('No se pudieron cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient.id]);

  const renderSparkline = (biomarkerType: string) => {
    // In a real app, this would fetch historical data for the biomarker
    // For now, we'll generate some sample data
    const mockData = Array(7).fill(0).map((_, i) => ({
      date: new Date(Date.now() - (6-i) * 86400000).toISOString().split('T')[0],
      value: Math.random() * 100
    }));
    
    return (
      <ResponsiveContainer width="100%" height={35}>
        <LineChart data={mockData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#5E8F8F" 
            strokeWidth={1.5} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const patientAge = calculateAge(patient.date_of_birth);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Revisar datos del paciente</h3>
      
      <div className="bg-healz-cream/30 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-healz-brown/70">Paciente</span>
            <div className="text-healz-brown font-medium">
              {patient.first_name} {patient.last_name}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-healz-brown/70">Email</span>
            <div className="text-healz-brown">{patient.email}</div>
          </div>
          <div>
            <span className="text-sm font-medium text-healz-brown/70">Detalles</span>
            <div className="text-healz-brown">
              {patientAge} años · {patient.gender}
            </div>
          </div>
        </div>
      </div>

      {selectedForm && (
        <div className="bg-healz-blue/10 border border-healz-blue/30 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-healz-blue flex items-center justify-center text-white text-xs font-medium mt-0.5">
              ℹ
            </div>
            <div>
              <div className="font-medium text-healz-brown">
                Formulario base seleccionado
              </div>
              <div className="text-sm text-healz-brown/70 mt-1">
                Los datos del informe se vincularán al formulario #{selectedForm.form_token.slice(-8)}. 
                Los biomarcadores y síntomas específicos de este formulario estarán disponibles en el diagnóstico.
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedForm === null && (
        <div className="bg-healz-yellow/10 border border-healz-yellow/30 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-healz-yellow flex items-center justify-center text-white text-xs font-medium mt-0.5">
              ⚠
            </div>
            <div>
              <div className="font-medium text-healz-brown">
                Informe sin formulario base
              </div>
              <div className="text-sm text-healz-brown/70 mt-1">
                Se creará un informe en blanco. Los datos mostrados a continuación son generales del paciente 
                y no están vinculados a un formulario específico.
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-red border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Cargando...</span>
          </div>
          <p className="mt-2 text-healz-brown/70">Cargando datos biomédicos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-healz-red">
          {error}
        </div>
      ) : biomarkerGroups.length === 0 ? (
        <div className="text-center py-8 text-healz-brown/70">
          No hay datos biomédicos disponibles para este paciente
        </div>
      ) : (
        <>
          {biomarkerGroups.map((group) => (
            <Card key={group.category} className="overflow-hidden">
              <CardHeader className="bg-healz-cream/20 py-3">
                <CardTitle className="text-md">{group.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-healz-cream/10">
                    <tr>
                      <th className="text-left p-3">Biomarcador</th>
                      <th className="text-right p-3">Último valor</th>
                      <th className="text-left p-3">Tendencia</th>
                      <th className="text-right p-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-healz-brown/10">
                    {group.biomarkers.map((snapshot) => (
                      <tr key={`${snapshot.patient_id}-${snapshot.biomarker_type}`} className="hover:bg-healz-cream/10">
                        <td className="p-3">
                          {snapshot.biomarker_type}
                        </td>
                        <td className="p-3 text-right">
                          {snapshot.latest_value} {snapshot.unit}
                        </td>
                        <td className="p-3 w-24">
                          {renderSparkline(snapshot.biomarker_type)}
                        </td>
                        <td className="p-3 text-right">
                          {new Date(snapshot.latest_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
            >
              Atrás
            </Button>
            <Button
              onClick={onNext}
              disabled={isLoading}
            >
              {isLoading ? 'Generando diagnóstico...' : 'Generar diagnóstico'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
