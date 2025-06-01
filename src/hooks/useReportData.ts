
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import {
  calculateBiologicalAge,
  calculateChronologicalAge,
  getRiskPercentage
} from '../utils/reportDataTransform';

export const useReportData = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['patient-report', reportId],
    queryFn: async () => {
      if (!reportId) throw new Error('No report ID provided');

      console.log('Fetching report with ID:', reportId);

      // Get the report with patient data and diagnosis from Supabase
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

      // Get report-specific biomarkers using form_id
      const { data: reportBiomarkers } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('form_id', reportData.form_id)
        .order('date', { ascending: false });

      // Get report risk profiles using both report_id and form_id for consistency
      const { data: riskProfiles } = await supabase
        .from('report_risk_profiles')
        .select('*')
        .eq('report_id', reportId)
        .eq('form_id', reportData.form_id);

      // Get report action plans using both report_id and form_id
      const { data: actionPlans } = await supabase
        .from('report_action_plans')
        .select('*')
        .eq('report_id', reportId)
        .eq('form_id', reportData.form_id)
        .order('priority', { ascending: false });

      // Get report comments/clinical notes using both report_id and form_id
      const { data: clinicalNotes } = await supabase
        .from('report_comments')
        .select('*')
        .eq('report_id', reportId)
        .eq('form_id', reportData.form_id)
        .order('created_at', { ascending: false });

      // Get symptoms from questionnaire answers using form_id
      const { data: symptoms } = await supabase
        .from('questionnaire_answers')
        .select('*')
        .eq('form_id', reportData.form_id);

      console.log('Report data loaded:', {
        reportData,
        biomarkers: reportBiomarkers?.length,
        riskProfiles: riskProfiles?.length,
        actionPlans: actionPlans?.length,
        clinicalNotes: clinicalNotes?.length,
        symptoms: symptoms?.length
      });

      // Extract patient data
      const patient = Array.isArray(reportData.patients) ? reportData.patients[0] : reportData.patients;

      // Calculate biomarker summary from actual data
      const biomarkerSummary = reportBiomarkers ? reportBiomarkers.reduce(
        (acc, biomarker) => {
          if (biomarker.is_out_of_range) {
            acc.outOfRange++;
          } else if (
            biomarker.value < biomarker.biomarker?.optimal_min || 
            biomarker.value > biomarker.biomarker?.optimal_max
          ) {
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

      // Add default categories if missing (for backward compatibility)
      const defaultRisks = {
        cardio: 25,
        mental: 30,
        adrenal: 20,
        oncologic: 15,
        metabolic: 35,
        inflammatory: 25
      };

      const finalRisks = { ...defaultRisks, ...risks };

      // Process symptoms from questionnaire answers
      const topSymptoms = symptoms ? symptoms
        .filter(answer => answer.answer && typeof answer.answer === 'string' && answer.answer.toLowerCase().includes('sí'))
        .slice(0, 5)
        .map(symptom => ({
          name: symptom.question_id.replace(/_/g, ' '),
          severity: symptom.answer.includes('muy') ? 'high' as const : 'med' as const
        })) : [];

      // Transform biomarkers for display
      const recentBiomarkers = reportBiomarkers ? reportBiomarkers.map(biomarker => ({
        name: biomarker.biomarker?.name || 'Unknown',
        valueWithUnit: `${biomarker.value} ${biomarker.biomarker?.unit || ''}`,
        status: biomarker.is_out_of_range ? 'outOfRange' as const : 
               (biomarker.value < biomarker.biomarker?.optimal_min || biomarker.value > biomarker.biomarker?.optimal_max) ? 'caution' as const : 'optimal' as const,
        collectedAgo: new Date(biomarker.date).toLocaleDateString('es-ES'),
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

      // Transform action plans to the expected format
      const transformedActionPlan = actionPlans ? {
        foods: actionPlans.filter(plan => plan.category === 'foods').map(plan => ({
          title: plan.title,
          description: plan.description,
          priority: plan.priority,
          duration: plan.duration
        })),
        supplements: actionPlans.filter(plan => plan.category === 'supplements').map(plan => ({
          title: plan.title,
          description: plan.description,
          dosage: plan.dosage,
          duration: plan.duration,
          priority: plan.priority
        })),
        lifestyle: actionPlans.filter(plan => plan.category === 'lifestyle').map(plan => ({
          title: plan.title,
          description: plan.description,
          duration: plan.duration,
          priority: plan.priority
        })),
        followup: actionPlans.filter(plan => plan.category === 'followup').map(plan => ({
          title: plan.title,
          description: plan.description,
          duration: plan.duration,
          priority: plan.priority
        }))
      } : { foods: [], supplements: [], lifestyle: [], followup: [] };

      const transformedReport = {
        id: reportData.id,
        patient: patient,
        createdAt: reportData.created_at,
        vitalityScore: reportData.diagnosis?.vitalityScore || 45,
        qualityOfLife: Math.min(5, Math.max(1, Math.round((reportData.diagnosis?.vitalityScore || 45) / 20))) as 1 | 2 | 3 | 4 | 5,
        biologicalAge: calculateBiologicalAge(patient?.date_of_birth, reportData.diagnosis?.vitalityScore || 45),
        chronologicalAge: calculateChronologicalAge(patient?.date_of_birth),
        risks: finalRisks,
        biomarkerSummary,
        topSymptoms,
        recentBiomarkers,
        clinicalNotes: transformedClinicalNotes,
        summary: reportData.diagnosis?.summary || generateSummary(patient, finalRisks, biomarkerSummary),
        manualNotes: reportData.manual_notes,
        actionPlan: transformedActionPlan
      };

      console.log('Transformed report:', transformedReport);
      return transformedReport;
    },
    enabled: !!reportId
  });
};

// Function to generate a summary if none exists
function generateSummary(patient: any, risks: Record<string, number>, biomarkerSummary: any) {
  const highRisks = Object.entries(risks).filter(([_, value]) => value > 60);
  const patientName = `${patient?.first_name} ${patient?.last_name}`;
  
  let summary = `**Perfil clínico de ${patientName}**\n\n`;
  
  if (highRisks.length > 0) {
    summary += `El paciente presenta riesgos elevados en: ${highRisks.map(([key, _]) => key).join(', ')}.\n\n`;
  }
  
  if (biomarkerSummary.outOfRange > 0) {
    summary += `Se detectaron ${biomarkerSummary.outOfRange} biomarcadores fuera de rango que requieren atención.\n\n`;
  }
  
  summary += 'Se recomienda seguimiento médico y ajustes en el plan de tratamiento según los hallazgos específicos.';
  
  return summary;
}
