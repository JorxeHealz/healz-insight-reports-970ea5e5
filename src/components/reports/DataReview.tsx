import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateAge } from '../../utils/dateUtils';
import { evaluateBiomarkerStatus, formatBiomarkerValue } from '../../utils/biomarkerEvaluation';
import { BiomarkerStatusBadge } from '../report/biomarkers/BiomarkerStatusBadge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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

interface BiomarkerData {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  status: 'optimal' | 'caution' | 'outOfRange';
  trend: 'increasing' | 'decreasing' | 'stable' | null;
  analytics_id: string;
  biomarker_data: {
    optimal_min: number;
    optimal_max: number;
    conventional_min: number;
    conventional_max: number;
  };
}

const getTrendIcon = (trend: BiomarkerData['trend']) => {
  switch (trend) {
    case 'increasing':
      return <ArrowUp className="w-4 h-4 text-healz-red" />;
    case 'decreasing':
      return <ArrowDown className="w-4 h-4 text-healz-blue" />;
    case 'stable':
      return <Minus className="w-4 h-4 text-healz-brown/50" />;
    default:
      return <span className="text-healz-brown/30 text-xs">-</span>;
  }
};

const sortBiomarkersByStatus = (biomarkers: BiomarkerData[]): BiomarkerData[] => {
  const statusPriority = {
    'outOfRange': 1,
    'caution': 2,
    'optimal': 3
  };

  return biomarkers.sort((a, b) => {
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Secondary sort by date (most recent first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const DataReview = ({ patient, selectedForm, onBack, onNext, isLoading }: DataReviewProps) => {
  const [biomarkers, setBiomarkers] = useState<BiomarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiomarkerData = async () => {
      try {
        console.log('Fetching biomarkers for patient:', patient.id);
        
        // First, get the most recent analytics_id for this patient
        const { data: recentAnalytics, error: analyticsError } = await supabase
          .from('patient_biomarkers')
          .select('analytics_id, date')
          .eq('patient_id', patient.id)
          .not('analytics_id', 'is', null)
          .order('date', { ascending: false })
          .limit(1);

        if (analyticsError) {
          console.error('Error fetching analytics:', analyticsError);
          throw analyticsError;
        }

        if (!recentAnalytics || recentAnalytics.length === 0) {
          console.log('No analytics data found for patient');
          setBiomarkers([]);
          return;
        }

        const mostRecentAnalyticsId = recentAnalytics[0].analytics_id;
        console.log('Most recent analytics_id:', mostRecentAnalyticsId);

        // Use the database function to get biomarkers with proper JOIN
        const { data: biomarkerData, error: biomarkerError } = await supabase
          .rpc('get_patient_biomarkers_by_analytics', {
            p_patient_id: patient.id,
            p_analytics_id: mostRecentAnalyticsId
          });

        if (biomarkerError) {
          console.error('Error fetching biomarkers:', biomarkerError);
          throw biomarkerError;
        }

        console.log('Raw biomarker data received:', biomarkerData?.length || 0, 'records');

        if (!biomarkerData || biomarkerData.length === 0) {
          console.log('No biomarker data found');
          setBiomarkers([]);
          return;
        }

        // Transform data from database function result
        const transformedBiomarkers: BiomarkerData[] = biomarkerData.map((pb) => {
          // The database function returns biomarker info directly in the row
          if (!pb.biomarker_name) {
            console.warn('Missing biomarker info for:', pb.id);
            return null;
          }

          // Create biomarker row for evaluation
          const biomarkerRow = {
            id: pb.biomarker_id,
            name: pb.biomarker_name,
            unit: pb.unit,
            optimal_min: pb.optimal_min,
            optimal_max: pb.optimal_max,
            conventional_min: pb.conventional_min,
            conventional_max: pb.conventional_max,
            description: pb.description,
            category: pb.category || [],
            created_at: pb.biomarker_created_at,
            updated_at: pb.biomarker_updated_at
          };
          
          const evaluation = evaluateBiomarkerStatus(pb.value, biomarkerRow);

          return {
            id: pb.id,
            name: pb.biomarker_name,
            value: pb.value,
            unit: pb.unit,
            date: pb.date,
            status: evaluation.status,
            trend: null, // Simplified - no trend calculation for now
            analytics_id: pb.analytics_id,
            biomarker_data: {
              optimal_min: pb.optimal_min,
              optimal_max: pb.optimal_max,
              conventional_min: pb.conventional_min,
              conventional_max: pb.conventional_max
            }
          } as BiomarkerData;
        }).filter(Boolean) as BiomarkerData[];

        console.log('Transformed biomarkers:', transformedBiomarkers.length);
        
        const sortedBiomarkers = sortBiomarkersByStatus(transformedBiomarkers);
        setBiomarkers(sortedBiomarkers);
        
      } catch (err: any) {
        console.error('Error fetching biomarker data:', err);
        setError('No se pudieron cargar los datos del paciente: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchBiomarkerData();
  }, [patient.id]);

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
      ) : biomarkers.length === 0 ? (
        <div className="text-center py-8 text-healz-brown/70">
          No hay datos biomédicos disponibles para este paciente
        </div>
      ) : (
        <>
          <Card className="overflow-hidden">
            <CardHeader className="bg-healz-cream/20 py-3">
              <CardTitle className="text-md">Biomarcadores más recientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-healz-cream/10">
                  <tr>
                    <th className="text-left p-3">Biomarcador</th>
                    <th className="text-right p-3">Valor</th>
                    <th className="text-center p-3">Estado</th>
                    <th className="text-center p-3">Tendencia</th>
                    <th className="text-right p-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-healz-brown/10">
                  {biomarkers.map((biomarker) => (
                    <tr key={biomarker.id} className="hover:bg-healz-cream/10">
                      <td className="p-3 font-medium">
                        {biomarker.name}
                      </td>
                      <td className="p-3 text-right">
                        {formatBiomarkerValue(biomarker.value, biomarker.unit)}
                      </td>
                      <td className="p-3 text-center">
                        <BiomarkerStatusBadge status={biomarker.status} />
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center">
                          {getTrendIcon(biomarker.trend)}
                        </div>
                      </td>
                      <td className="p-3 text-right text-sm text-healz-brown/70">
                        {formatDistanceToNow(new Date(biomarker.date), { 
                          addSuffix: true,
                          locale: es 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

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