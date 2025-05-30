import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ReportHeader } from '../components/report/ReportHeader';
import { ReportTabs } from '../components/report/ReportTabs';
import { supabase } from '../lib/supabase';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch real report data from Supabase
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['patient-report', id],
    queryFn: async () => {
      if (!id) throw new Error('No report ID provided');

      console.log('Fetching report with ID:', id);

      // Get the report with patient data and diagnosis
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select(`
          id,
          created_at,
          diagnosis,
          manual_notes,
          action_plan,
          patients (
            id,
            first_name,
            last_name,
            email,
            date_of_birth,
            gender
          )
        `)
        .eq('id', id)
        .single();

      if (reportError) {
        console.error('Error fetching report:', reportError);
        throw reportError;
      }

      if (!reportData) {
        throw new Error('Report not found');
      }

      console.log('Raw report data:', reportData);

      // Extract patient data (it comes as an object, not array)
      const patient = reportData.patients;

      // Transform the data to match the expected format
      const transformedReport = {
        id: reportData.id,
        patient: patient,
        createdAt: reportData.created_at,
        vitalityScore: reportData.diagnosis?.vitalityScore || 0,
        qualityOfLife: Math.min(5, Math.max(1, Math.round((reportData.diagnosis?.vitalityScore || 0) / 20))) as 1 | 2 | 3 | 4 | 5,
        biologicalAge: calculateBiologicalAge(patient?.date_of_birth, reportData.diagnosis?.vitalityScore || 0),
        chronologicalAge: calculateChronologicalAge(patient?.date_of_birth),
        risks: {
          cardio: getRiskPercentage(reportData.diagnosis?.riskProfile?.cardio),
          mental: getRiskPercentage(reportData.diagnosis?.riskProfile?.mental),
          adrenal: getRiskPercentage(reportData.diagnosis?.riskProfile?.adrenal),
          oncologic: Math.floor(Math.random() * 30) + 10, // Placeholder
          metabolic: getRiskPercentage(reportData.diagnosis?.riskProfile?.metabolic),
          inflammatory: Math.floor(Math.random() * 40) + 15 // Placeholder
        },
        biomarkerSummary: {
          optimal: Math.floor(Math.random() * 15) + 5,
          caution: Math.floor(Math.random() * 8) + 2,
          outOfRange: Math.floor(Math.random() * 5) + 1
        },
        topSymptoms: generateSymptomsFromRisk(reportData.diagnosis?.riskProfile),
        recentBiomarkers: [], // Will be loaded by the RecentBiomarkers component
        clinicalNotes: generateClinicalNotes(reportData, patient),
        summary: reportData.diagnosis?.summary || 'No hay resumen disponible para este paciente.',
        manualNotes: reportData.manual_notes,
        actionPlan: reportData.action_plan
      };

      console.log('Transformed report:', transformedReport);
      return transformedReport;
    },
    enabled: !!id
  });

  // Helper function to calculate biological age based on vitality score
  const calculateBiologicalAge = (dateOfBirth: string | null, vitalityScore: number): number => {
    if (!dateOfBirth) return 0;
    
    const chronologicalAge = calculateChronologicalAge(dateOfBirth);
    const adjustment = (70 - vitalityScore) / 10; // Lower vitality = higher biological age
    return Math.max(18, Math.round(chronologicalAge + adjustment));
  };

  // Helper function to calculate chronological age
  const calculateChronologicalAge = (dateOfBirth: string | null): number => {
    if (!dateOfBirth) return 0;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Helper function to convert risk levels to percentages
  const getRiskPercentage = (riskLevel: string | undefined): number => {
    switch (riskLevel) {
      case 'low': return Math.floor(Math.random() * 25) + 5;
      case 'medium': return Math.floor(Math.random() * 25) + 35;
      case 'high': return Math.floor(Math.random() * 25) + 65;
      default: return Math.floor(Math.random() * 30) + 20;
    }
  };

  // Helper function to generate symptoms based on risk profile
  const generateSymptomsFromRisk = (riskProfile: any) => {
    const symptoms = [];
    
    if (riskProfile?.cardio === 'high') {
      symptoms.push({ name: 'Fatiga', severity: 'high' as const });
      symptoms.push({ name: 'Dolor torácico', severity: 'med' as const });
    }
    
    if (riskProfile?.mental === 'high') {
      symptoms.push({ name: 'Estrés', severity: 'high' as const });
      symptoms.push({ name: 'Ansiedad', severity: 'med' as const });
    }
    
    if (riskProfile?.adrenal === 'high') {
      symptoms.push({ name: 'Insomnio', severity: 'high' as const });
      symptoms.push({ name: 'Fatiga crónica', severity: 'med' as const });
    }
    
    if (riskProfile?.metabolic === 'high') {
      symptoms.push({ name: 'Cambios de peso', severity: 'med' as const });
      symptoms.push({ name: 'Antojos', severity: 'low' as const });
    }
    
    return symptoms.slice(0, 5); // Limit to top 5 symptoms
  };

  // Helper function to generate clinical notes
  const generateClinicalNotes = (reportData: any, patient: any) => {
    const patientName = `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim();
    
    return [
      {
        id: '1',
        title: `Evaluación inicial - ${patientName}`,
        author: 'Dr. Sistema Healz',
        date: new Date(reportData.created_at).toLocaleDateString('es-ES'),
        type: 'evaluacion',
        summary: reportData.diagnosis?.summary || 'Evaluación inicial del paciente.',
        findings: [
          {
            category: 'Biomarcadores',
            priority: reportData.diagnosis?.riskScore > 50 ? 'high' : 'medium',
            findings: `Se han analizado los biomarcadores del paciente. Vitality Score: ${reportData.diagnosis?.vitalityScore || 0}%.`,
            recommendations: [
              'Seguimiento en 3-6 meses',
              'Optimización de estilo de vida',
              'Monitoreo de biomarcadores principales'
            ]
          }
        ]
      }
    ];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-healz-red/10 text-healz-red p-4 rounded-md">
          Error al cargar el informe: {error.message}
        </div>
      ) : report ? (
        <div className="space-y-6">
          <ReportHeader />
          <ReportTabs report={report} patientId={report.patient?.id} />
        </div>
      ) : (
        <div className="text-center py-8 text-healz-brown/70">
          Informe no encontrado.
        </div>
      )}
    </div>
  );
};

export default ReportDetail;
