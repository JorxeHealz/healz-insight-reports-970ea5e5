
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

export const transformClinicalNotes = (clinicalNotes: any[]) => {
  return clinicalNotes.map(note => ({
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
  }));
};

// Actualizar la función de transformación de action plans para devolver el array completo
export const transformActionPlan = (actionPlans: any[]) => {
  // Devolver el array completo de action plans en lugar de agrupar por categoría
  // El componente ActionPlan se encargará de agrupar los datos
  return actionPlans.map(plan => ({
    id: plan.id,
    category: plan.category,
    title: plan.title,
    description: plan.description,
    priority: plan.priority,
    duration: plan.duration,
    dosage: plan.dosage
  }));
};

export const buildTransformedReport = (
  reportData: any,
  patient: any,
  finalRisks: Record<string, number>,
  biomarkerSummary: any,
  topSymptoms: any[],
  recentBiomarkers: any[],
  transformedClinicalNotes: any[],
  transformedActionPlan: any
) => {
  return {
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
    // Cambiar de actionPlan a actionPlans para usar el array completo
    actionPlans: transformedActionPlan
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
