
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
          form_id,
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

      // Get report-specific biomarkers
      const { data: reportBiomarkers } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('form_id', reportData.form_id)
        .order('date', { ascending: false });

      // Get report risk profiles
      const { data: riskProfiles } = await supabase
        .from('report_risk_profiles')
        .select('*')
        .eq('report_id', reportId);

      // Get report action plans
      const { data: actionPlans } = await supabase
        .from('report_action_plans')
        .select('*')
        .eq('report_id', reportId)
        .order('priority', { ascending: false });

      // Get report comments/clinical notes
      const { data: clinicalNotes } = await supabase
        .from('report_comments')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

      // Get symptoms from questionnaire answers
      const { data: symptoms } = await supabase
        .from('questionnaire_answers')
        .select('*')
        .eq('form_id', reportData.form_id);

      console.log('Raw report data:', reportData);

      // Extract patient data
      const patient = Array.isArray(reportData.patients) ? reportData.patients[0] : reportData.patients;

      // Calculate biomarker summary from actual data
      const biomarkerSummary = reportBiomarkers ? reportBiomarkers.reduce(
        (acc, biomarker) => {
          if (biomarker.is_out_of_range) {
            acc.outOfRange++;
          } else if (biomarker.value < biomarker.biomarker?.optimal_min || biomarker.value > biomarker.biomarker?.optimal_max) {
            acc.caution++;
          } else {
            acc.optimal++;
          }
          return acc;
        },
        { optimal: 0, caution: 0, outOfRange: 0 }
      ) : { optimal: 0, caution: 0, outOfRange: 0 };

      // Build risk profile from actual data
      const risks = riskProfiles ? riskProfiles.reduce((acc, profile) => {
        acc[profile.category] = profile.percentage || getRiskPercentage(profile.risk_level);
        return acc;
      }, {} as Record<string, number>) : {};

      // Add default categories if missing
      const defaultRisks = {
        cardio: getRiskPercentage(reportData.diagnosis?.riskProfile?.cardio) || 25,
        mental: getRiskPercentage(reportData.diagnosis?.riskProfile?.mental) || 30,
        adrenal: getRiskPercentage(reportData.diagnosis?.riskProfile?.adrenal) || 20,
        oncologic: 15,
        metabolic: getRiskPercentage(reportData.diagnosis?.riskProfile?.metabolic) || 35,
        inflammatory: 25
      };

      // Process symptoms from questionnaire answers
      const topSymptoms = symptoms ? symptoms
        .filter(answer => answer.answer && typeof answer.answer === 'string' && answer.answer.toLowerCase().includes('sí'))
        .slice(0, 5)
        .map(symptom => ({
          name: symptom.question_id.replace(/_/g, ' '),
          severity: 'med' as const
        })) : generateSymptomsFromRisk(reportData.diagnosis?.riskProfile);

      // Transform biomarkers for display
      const recentBiomarkers = reportBiomarkers ? reportBiomarkers.map(biomarker => ({
        name: biomarker.biomarker?.name || 'Unknown',
        valueWithUnit: `${biomarker.value} ${biomarker.biomarker?.unit || ''}`,
        status: biomarker.is_out_of_range ? 'outOfRange' as const : 
               (biomarker.value < biomarker.biomarker?.optimal_min || biomarker.value > biomarker.biomarker?.optimal_max) ? 'caution' as const : 'optimal' as const,
        collectedAgo: new Date(biomarker.date).toLocaleDateString(),
        rawValue: biomarker.value,
        unit: biomarker.biomarker?.unit || '',
        biomarkerData: biomarker.biomarker,
        collectedAt: biomarker.date,
        notes: biomarker.notes
      })) : [];

      // Transform clinical notes
      const transformedClinicalNotes = clinicalNotes ? clinicalNotes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        author: note.author || 'Dr. Sistema',
        date: new Date(note.created_at).toLocaleDateString(),
        type: note.category,
        summary: note.content,
        findings: [{
          category: note.category,
          priority: note.priority,
          findings: note.content,
          recommendations: []
        }]
      })) : [];

      const transformedReport = {
        id: reportData.id,
        patient: patient,
        createdAt: reportData.created_at,
        vitalityScore: reportData.diagnosis?.vitalityScore || 0,
        qualityOfLife: Math.min(5, Math.max(1, Math.round((reportData.diagnosis?.vitalityScore || 0) / 20))) as 1 | 2 | 3 | 4 | 5,
        biologicalAge: calculateBiologicalAge(patient?.date_of_birth, reportData.diagnosis?.vitalityScore || 0),
        chronologicalAge: calculateChronologicalAge(patient?.date_of_birth),
        risks: { ...defaultRisks, ...risks },
        biomarkerSummary,
        topSymptoms,
        recentBiomarkers,
        clinicalNotes: transformedClinicalNotes,
        summary: reportData.diagnosis?.summary || 'No hay resumen disponible para este paciente.',
        manualNotes: reportData.manual_notes,
        actionPlan: actionPlans || reportData.action_plan
      };

      console.log('Transformed report:', transformedReport);
      return transformedReport;
    },
    enabled: !!reportId
  });
};
