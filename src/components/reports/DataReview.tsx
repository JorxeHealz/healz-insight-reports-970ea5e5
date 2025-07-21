import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types/supabase';
import { PatientForm } from '../../types/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateAge } from '../../utils/dateUtils';
import { evaluateBiomarkerStatus, formatBiomarkerValue } from '../../utils/biomarkerEvaluation';
import { BiomarkerStatusBadge } from '../report/biomarkers/BiomarkerStatusBadge';
import { PatientSymptomsSummary } from './PatientSymptomsSummary';
import { ArrowUp, ArrowDown, Minus, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { AddBiomarkerDialog } from './biomarkers/AddBiomarkerDialog';
import { EditBiomarkerDialog } from './biomarkers/EditBiomarkerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useBiomarkerCRUD } from '@/hooks/useBiomarkerCRUD';

interface DataReviewProps {
  patient: Patient;
  selectedForm: PatientForm | null | undefined;
  onBack: () => void;
  onNext: (analyticsId?: string) => void;
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
  const [analyticsDate, setAnalyticsDate] = useState<string>('');
  const [editingBiomarker, setEditingBiomarker] = useState<BiomarkerData | null>(null);
  const [deletingBiomarker, setDeletingBiomarker] = useState<BiomarkerData | null>(null);
  const { toast } = useToast();
  const { deleteBiomarker } = useBiomarkerCRUD();

  const handleGenerateDiagnosis = async () => {
    // No longer need to validate analytics_id here - it will be auto-detected
    // Just proceed to the next step
    onNext(); // Remove analytics_id parameter - it will be auto-detected
  };

  useEffect(() => {
    const fetchBiomarkerData = async () => {
      try {
        console.log('=== DataReview: Loading biomarker data for patient ===');
        console.log('Patient ID:', patient.id);
        console.log('Selected form:', selectedForm?.id);
        
        // Get the most recent analytics_id for this patient
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
          setError('No se encontraron analíticas para este paciente');
          return;
        }

        const mostRecentAnalyticsId = recentAnalytics[0].analytics_id;
        const mostRecentDate = recentAnalytics[0].date;
        setAnalyticsDate(mostRecentDate);
        console.log('Using analytics_id:', mostRecentAnalyticsId, 'from date:', mostRecentDate);

        // Get biomarkers using the database function
        const { data: biomarkerData, error: biomarkerError } = await supabase
          .rpc('get_patient_biomarkers_by_analytics', {
            p_patient_id: patient.id,
            p_analytics_id: mostRecentAnalyticsId
          });

        if (biomarkerError) {
          console.error('Error fetching biomarkers:', biomarkerError);
          throw biomarkerError;
        }

        if (!biomarkerData || biomarkerData.length === 0) {
          console.log('No biomarker data found');
          setBiomarkers([]);
          setError('No se encontraron biomarcadores para la analítica más reciente');
          return;
        }

        console.log(`Processing ${biomarkerData.length} biomarker records`);

        // Transform data from database function result
        const transformedBiomarkers: BiomarkerData[] = biomarkerData
          .filter(pb => pb.biomarker_name && pb.unit) // Filter out invalid records
          .map((pb) => {
            // Determine status based on optimal ranges
            let status: 'optimal' | 'caution' | 'outOfRange' = 'optimal';
            
            if (pb.optimal_min !== null && pb.optimal_max !== null) {
              if (pb.value < pb.optimal_min || pb.value > pb.optimal_max) {
                status = 'outOfRange';
              }
            } else if (pb.conventional_min !== null && pb.conventional_max !== null) {
              if (pb.value < pb.conventional_min || pb.value > pb.conventional_max) {
                status = 'caution';
              }
            }

            return {
              id: pb.id,
              name: pb.biomarker_name,
              value: pb.value,
              unit: pb.unit,
              status,
              date: pb.date,
              notes: pb.notes,
              biomarkerData: {
                id: pb.biomarker_id,
                name: pb.biomarker_name,
                unit: pb.unit,
                description: pb.description || '',
                optimal_min: pb.optimal_min,
                optimal_max: pb.optimal_max,
                conventional_min: pb.conventional_min,
                conventional_max: pb.conventional_max,
                category: Array.isArray(pb.category) ? pb.category : [],
                panel: Array.isArray(pb.panel) ? pb.panel : []
              }
            };
          });

        const sorted = sortBiomarkersByStatus(transformedBiomarkers);
        setBiomarkers(sorted);
        console.log(`✅ Successfully loaded ${sorted.length} biomarkers`);
        
      } catch (error: any) {
        console.error('Error in fetchBiomarkerData:', error);
        setError(error.message || 'Error al cargar los biomarcadores');
        setBiomarkers([]);
      } finally {
        setLoading(false);
      }
    };

    if (patient?.id) {
      fetchBiomarkerData();
    }
  }, [patient?.id]);

  const refreshBiomarkers = () => {
    setLoading(true);
    const fetchBiomarkerData = async () => {
      try {
        // Simplified refresh - using the same logic but shorter
        const { data: recentAnalytics, error: analyticsError } = await supabase
          .from('patient_biomarkers')
          .select('analytics_id, date')
          .eq('patient_id', patient.id)
          .not('analytics_id', 'is', null)
          .order('date', { ascending: false })
          .limit(1);

        if (analyticsError) throw analyticsError;
        if (!recentAnalytics || recentAnalytics.length === 0) {
          setBiomarkers([]);
          return;
        }

        const mostRecentAnalyticsId = recentAnalytics[0].analytics_id;
        const { data: biomarkerData, error: biomarkerError } = await supabase
          .rpc('get_patient_biomarkers_by_analytics', {
            p_patient_id: patient.id,
            p_analytics_id: mostRecentAnalyticsId
          });

        if (biomarkerError) throw biomarkerError;
        if (!biomarkerData || biomarkerData.length === 0) {
          setBiomarkers([]);
          return;
        }

        const transformedBiomarkers: BiomarkerData[] = biomarkerData.map((pb) => {
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
            trend: null,
            analytics_id: pb.analytics_id,
            biomarker_data: {
              optimal_min: pb.optimal_min,
              optimal_max: pb.optimal_max,
              conventional_min: pb.conventional_min,
              conventional_max: pb.conventional_max
            }
          } as BiomarkerData;
        }).filter(Boolean);

        const sortedBiomarkers = sortBiomarkersByStatus(transformedBiomarkers);
        setBiomarkers(sortedBiomarkers);
      } catch (err: any) {
        console.error('Error refreshing biomarkers:', err);
        setError('Error al actualizar los biomarcadores: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchBiomarkerData();
  };

  const handleDeleteBiomarker = async () => {
    if (!deletingBiomarker) return;

    try {
      await deleteBiomarker.mutateAsync({ id: deletingBiomarker.id });
      setDeletingBiomarker(null);
      refreshBiomarkers();
    } catch (error) {
      console.error('Error deleting biomarker:', error);
    }
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

      {/* Contexto del paciente y síntomas */}
      <PatientSymptomsSummary patient={patient} selectedForm={selectedForm} />

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
            <CardHeader className="bg-healz-cream/20 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-md">Biomarcadores más recientes</CardTitle>
              {analyticsDate && (
                <AddBiomarkerDialog
                  patientId={patient.id}
                  analyticsId={analyticsDate}
                  analyticsDate={analyticsDate}
                  onSuccess={refreshBiomarkers}
                />
              )}
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
                    <th className="text-center p-3">Acciones</th>
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
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingBiomarker(biomarker)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingBiomarker(biomarker)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
              onClick={handleGenerateDiagnosis}
              disabled={isLoading || !analyticsDate}
            >
              {isLoading ? 'Generando diagnóstico...' : 'Generar diagnóstico'}
            </Button>
          </div>
        </>
      )}

      {/* Edit Biomarker Dialog */}
      <EditBiomarkerDialog
        biomarker={editingBiomarker}
        open={!!editingBiomarker}
        onOpenChange={(open) => !open && setEditingBiomarker(null)}
        onSuccess={refreshBiomarkers}
      />

      {/* Delete Biomarker Dialog */}
      <AlertDialog open={!!deletingBiomarker} onOpenChange={(open) => !open && setDeletingBiomarker(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Biomarcador</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar el biomarcador "{deletingBiomarker?.name}"? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBiomarker}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};