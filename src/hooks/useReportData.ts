
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import {
  calculateBiologicalAge,
  calculateChronologicalAge,
  getRiskPercentage,
  generateSymptomsFromRisk,
  generateClinicalNotes
} from '../utils/reportDataTransform';

export const useReportData = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['patient-report', reportId],
    queryFn: async () => {
      if (!reportId) throw new Error('No report ID provided');

      console.log('Fetching report with ID:', reportId);

      // Get the report with patient data and diagnosis
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select(`
          id,
          created_at,
          diagnosis,
          manual_notes,
          action_plan,
          patients!inner (
            id,
            first_name,
            last_name,
            email,
            date_of_birth,
            gender
          )
        `)
        .eq('id', reportId)
        .single();

      if (reportError) {
        console.error('Error fetching report:', reportError);
        throw reportError;
      }

      if (!reportData) {
        throw new Error('Report not found');
      }

      console.log('Raw report data:', reportData);

      // Extract patient data (it comes as an object with the inner join)
      const patient = Array.isArray(reportData.patients) ? reportData.patients[0] : reportData.patients;

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
    enabled: !!reportId
  });
};
