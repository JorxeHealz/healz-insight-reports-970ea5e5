
import {
  calculateBiologicalAge,
  calculateChronologicalAge,
  getRiskPercentage
} from './reportDataTransform';

export const transformBiomarkers = (reportBiomarkers: any[]) => {
  return reportBiomarkers.map(biomarker => ({
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
  }));
};

export const calculateBiomarkerSummary = (reportBiomarkers: any[]) => {
  return reportBiomarkers.reduce(
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
  );
};

export const buildRiskProfile = (riskProfiles: any[]) => {
  const risks = riskProfiles.reduce((acc, profile) => {
    acc[profile.category] = profile.percentage || getRiskPercentage(profile.risk_level);
    return acc;
  }, {} as Record<string, number>);

  const defaultRisks = {
    cardio: 25,
    mental: 30,
    adrenal: 20,
    oncologic: 15,
    metabolic: 35,
    inflammatory: 25
  };

  return { ...defaultRisks, ...risks };
};

export const transformSymptoms = (symptoms: any[]) => {
  return symptoms
    .filter(answer => answer.answer && typeof answer.answer === 'string' && answer.answer.toLowerCase().includes('sí'))
    .slice(0, 5)
    .map(symptom => ({
      name: symptom.question_id.replace(/_/g, ' '),
      severity: symptom.answer.includes('muy') ? 'high' as const : 'med' as const
    }));
};

// Update transformClinicalNotes to preserve all evaluation properties
export const transformClinicalNotes = (clinicalNotes: any[]) => {
  return clinicalNotes.map(note => ({
    id: note.id,
    title: note.title,
    content: note.content,
    author: note.author || 'Dr. Sistema',
    date: new Date(note.created_at).toLocaleDateString(),
    category: note.category,
    priority: note.priority,
    // Preserve evaluation properties
    evaluation_type: note.evaluation_type,
    target_id: note.target_id,
    evaluation_score: note.evaluation_score,
    criticality_level: note.criticality_level,
    is_auto_generated: note.is_auto_generated,
    // Legacy properties for backward compatibility
    type: note.category,
    summary: note.content,
    findings: [{
      category: note.category,
      priority: note.priority,
      findings: note.content,
      recommendations: []
    }]
  }));
};

// Transform specialized action plans structure
export const transformActionPlan = (actionPlans: any) => {
  // Handle the new specialized structure with categories
  if (actionPlans && typeof actionPlans === 'object' && !Array.isArray(actionPlans)) {
    return {
      foods: actionPlans.foods || [],
      lifestyle: actionPlans.lifestyle || [],
      activity: actionPlans.activity || [],
      supplements: actionPlans.supplements || [],
      therapy: actionPlans.therapy || [],
      followup: actionPlans.followup || []
    };
  }
  
  // Fallback for old structure (array)
  if (Array.isArray(actionPlans)) {
    return actionPlans.map(plan => ({
      id: plan.id,
      category: plan.category,
      title: plan.title,
      description: plan.description,
      priority: plan.priority,
      duration: plan.duration,
      dosage: plan.dosage
    }));
  }
  
  // Default empty structure
  return {
    foods: [],
    lifestyle: [],
    activity: [],
    supplements: [],
    therapy: [],
    followup: []
  };
};

export const transformSummarySections = (summarySections: any[]) => {
  return summarySections.reduce((acc, section) => {
    acc[section.section_type] = {
      title: section.title,
      content: section.content,
      updated_at: section.updated_at
    };
    return acc;
  }, {} as Record<string, { title: string; content: string; updated_at: string }>);
};

export const buildTransformedReport = (
  reportData: any,
  patient: any,
  finalRisks: Record<string, number>,
  biomarkerSummary: any,
  topSymptoms: any[],
  recentBiomarkers: any[],
  transformedClinicalNotes: any[],
  transformedActionPlan: any,
  summarySections: any = {}
) => {
  return {
    id: reportData.id,
    form_id: reportData.form_id,
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
    // Use clinical_notes instead of clinicalNotes to match component expectations
    clinical_notes: transformedClinicalNotes,
    summary: reportData.diagnosis || generateSummary(patient, finalRisks, biomarkerSummary),
    manualNotes: reportData.manual_notes,
    // Cambiar de actionPlan a actionPlans para usar el array completo
    actionPlans: transformedActionPlan,
    summarySections: summarySections,
    keyFindings: [] // This will be populated in useReportData
  };
};

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
