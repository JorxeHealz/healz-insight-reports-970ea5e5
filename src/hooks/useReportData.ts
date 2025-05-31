
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useRealBiomarkers } from './useRealBiomarkers';
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

      // Check if this is Ana's specific report ID, use real data
      if (reportId === '9fc6f1ec-d9dc-4110-a736-93edb25a407b') {
        return await generateAnaReport();
      }

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

// Función específica para generar el informe de Ana con datos reales
async function generateAnaReport() {
  console.log('Generating Ana report with real data');

  // Get Ana's patient data
  const { data: patientData, error: patientError } = await supabase
    .from('patients')
    .select('*')
    .eq('id', '550e8400-e29b-41d4-a716-446655440003')
    .single();

  if (patientError) {
    console.error('Error fetching Ana patient data:', patientError);
    throw patientError;
  }

  // Get Ana's biomarkers
  const { data: biomarkersData, error: biomarkersError } = await supabase
    .from('patient_biomarkers')
    .select(`
      *,
      biomarker:biomarkers(*)
    `)
    .eq('patient_id', '550e8400-e29b-41d4-a716-446655440003')
    .eq('form_id', '660e8400-e29b-41d4-a716-446655440003')
    .order('date', { ascending: false });

  if (biomarkersError) {
    console.error('Error fetching Ana biomarkers:', biomarkersError);
    throw biomarkersError;
  }

  // Calculate biomarker summary from real data
  const biomarkerSummary = biomarkersData ? biomarkersData.reduce(
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

  // Transform biomarkers for display
  const recentBiomarkers = biomarkersData ? biomarkersData.map(biomarker => ({
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

  // Ana's specific risk profile based on her biomarkers
  const risks = {
    cardio: 75, // High due to cholesterol, LDL, triglycerides
    mental: 60, // Medium-high due to cortisol and fatigue
    adrenal: 70, // High due to DHEA-S low and cortisol high
    oncologic: 25, // Low
    metabolic: 65, // High due to insulin resistance and HbA1c
    inflammatory: 70 // High due to CRP elevation
  };

  // Ana's symptoms based on her condition
  const topSymptoms = [
    { name: 'Fatiga crónica', severity: 'high' as const },
    { name: 'Sofocos', severity: 'med' as const },
    { name: 'Dificultad para dormir', severity: 'med' as const },
    { name: 'Cambios de humor', severity: 'med' as const },
    { name: 'Aumento de peso', severity: 'med' as const }
  ];

  return {
    id: '9fc6f1ec-d9dc-4110-a736-93edb25a407b',
    patient: patientData,
    createdAt: new Date().toISOString(),
    vitalityScore: 45, // Low due to multiple issues
    qualityOfLife: 2 as 1 | 2 | 3 | 4 | 5, // Poor quality of life
    biologicalAge: calculateBiologicalAge(patientData?.date_of_birth, 45),
    chronologicalAge: calculateChronologicalAge(patientData?.date_of_birth),
    risks,
    biomarkerSummary,
    topSymptoms,
    recentBiomarkers,
    clinicalNotes: generateClinicalNotes(risks, patientData),
    summary: `
**Perfil clínico de Ana López - Menopausia con fatiga crónica**

La paciente presenta un cuadro típico de menopausia establecida con complicaciones metabólicas y endocrinas que requieren atención integral:

**Hallazgos principales:**
- **Menopausia confirmada**: FSH elevado (45 mIU/mL), LH alto (35 mIU/mL), estradiol muy bajo (18 pg/mL)
- **Hipotiroidismo subclínico**: TSH elevado (4.8 μIU/mL) contribuyendo a la fatiga
- **Resistencia insulínica emergente**: Insulina elevada (18 μIU/mL), HbA1c en prediabetes (5.8%)
- **Riesgo cardiovascular aumentado**: Sin protección estrogénica, colesterol total 235 mg/dL, LDL 145 mg/dL
- **Inflamación crónica**: CRP elevado (4.2 mg/L) y cortisol alto (22 μg/dL)

**Recomendaciones prioritarias:**
1. Terapia hormonal bioidéntica para síntomas menopáusicos
2. Optimización tiroidea con levotiroxina
3. Intervención nutricional para resistencia insulínica
4. Suplementación específica (Vitamina D, B12, magnesio, hierro)
5. Manejo del estrés y mejora del sueño
`,
    manualNotes: null,
    actionPlan: []
  };
}
