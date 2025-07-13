
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
  // Mapeo de categorías de la BD a las esperadas por el componente
  const categoryMapping: Record<string, string> = {
    'Hormonas': 'hormonas',
    'Vitalidad': 'vitalidad', 
    'Riesgo Cardíaco': 'riesgo_cardiaco',
    'Pérdida de Peso': 'perdida_peso',
    'Fuerza': 'fuerza',
    'Salud Cerebral': 'salud_cerebral',
    'Salud Sexual': 'salud_sexual',
    'Longevidad': 'longevidad'
  };

  const risks = riskProfiles.reduce((acc, profile) => {
    const mappedCategory = categoryMapping[profile.category] || profile.category.toLowerCase().replace(/\s+/g, '_');
    acc[mappedCategory] = profile.percentage || getRiskPercentage(profile.risk_level);
    return acc;
  }, {} as Record<string, number>);

  // Valores por defecto para categorías faltantes
  const defaultRisks = {
    hormonas: 50,
    vitalidad: 50,
    riesgo_cardiaco: 50,
    perdida_peso: 50,
    fuerza: 50,
    salud_cerebral: 50,
    salud_sexual: 50,
    longevidad: 50
  };

  return { ...defaultRisks, ...risks };
};

// Función auxiliar para determinar si una respuesta indica presencia de síntoma
function shouldReportSymptom(answer: string): boolean {
  const lowerAnswer = answer.toLowerCase().trim();
  
  // Respuestas que indican presencia del síntoma
  const positiveAnswers = [
    'sí', 'si', 'yes', 'true', 
    'frecuentemente', 'siempre', 'always', 'frequently',
    'moderadamente', 'severamente', 'mucho', 'bastante',
    'a veces', 'ocasionalmente', 'sometimes', 'occasionally',
    'rara vez', 'rarely'
  ];
  
  // Respuestas que indican ausencia del síntoma
  const negativeAnswers = [
    'no', 'never', 'nunca', 'false',
    'información no disponible', 'n/a', 'na',
    'poco', 'nada'
  ];
  
  // Verificar respuestas positivas
  if (positiveAnswers.some(pos => lowerAnswer.includes(pos))) {
    return true;
  }
  
  // Verificar respuestas negativas
  if (negativeAnswers.some(neg => lowerAnswer.includes(neg))) {
    return false;
  }
  
  // Para respuestas numéricas (escalas), considerar >= 3 como positivo
  const numericValue = parseInt(lowerAnswer);
  if (!isNaN(numericValue)) {
    return numericValue >= 3;
  }
  
  // Para respuestas no categorizadas, considerar como positiva si no está vacía
  return lowerAnswer.length > 0 && lowerAnswer !== '0';
}

// Función para extraer el nombre del síntoma del texto de la pregunta
function extractSymptomFromQuestion(questionText: string): string | null {
  const lowerText = questionText.toLowerCase();
  
  // Mapeo de palabras clave a síntomas
  const symptomKeywords: Record<string, string> = {
    'energía baja': 'Energía baja',
    'cansancio': 'Energía baja',
    'fatiga': 'Fatiga constante',
    'libido': 'Libido bajo',
    'deseo sexual': 'Libido bajo',
    'sueño': 'Sueño deficiente',
    'dormir': 'Sueño deficiente',
    'peso': 'Cambios de peso',
    'cabello': 'Pérdida de cabello',
    'concentra': 'Dificultad para concentrarse',
    'niebla mental': 'Niebla mental',
    'memoria': 'Pérdida de memoria',
    'humor': 'Cambios de humor',
    'ánimo': 'Cambios de humor',
    'sofocos': 'Sofocos',
    'calor': 'Intolerancia al calor o frío',
    'frío': 'Intolerancia al calor o frío',
    'antojos': 'Antojos de comida',
    'resistencia': 'Resistencia disminuida',
    'motivación': 'Falta de motivación',
    'enfermedad': 'Enfermedades frecuentes',
    'dolor pecho': 'Dolor en el pecho',
    'falta aire': 'Falta de aliento',
    'mareo': 'Mareos',
    'náusea': 'Náuseas',
    'sudor': 'Sudoración',
    'ejercicio': 'Poca tolerancia al ejercicio',
    'grasa corporal': 'Exceso de grasa corporal',
    'ronquidos': 'Ronquidos',
    'piel': 'Problemas de piel',
    'articular': 'Dolor en articulaciones',
    'espalda': 'Dolor de espalda',
    'autoestima': 'Baja autoestima',
    'presión arterial': 'Presión arterial alta',
    'glucosa': 'Disregulación de glucosa en sangre',
    'confusión': 'Confusión',
    'problemas': 'Dificultad para resolver problemas',
    'lenguaje': 'Problemas de lenguaje',
    'coordinación': 'Coordinación deficiente',
    'comportamiento': 'Cambios en el comportamiento',
    'disfunción eréctil': 'Disfunción eréctil',
    'sequedad vaginal': 'Sequedad vaginal',
    'dolor relaciones': 'Dolor durante las relaciones',
    'infertilidad': 'Infertilidad',
    'fragilidad': 'Fragilidad',
    'deterioro cognitivo': 'Deterioro cognitivo',
    'ansiedad': 'Ansiedad',
    'sop': 'Síntomas de SOP'
  };

  // Buscar coincidencias de palabras clave
  for (const [keyword, symptom] of Object.entries(symptomKeywords)) {
    if (lowerText.includes(keyword)) {
      return symptom;
    }
  }

  return null;
}

// Función para determinar la etiqueta exacta de frecuencia
function getFrequencyLabel(answer: string): string {
  const lowerAnswer = answer.toLowerCase().trim();
  
  if (lowerAnswer.includes('siempre') || lowerAnswer.includes('always')) {
    return 'Siempre';
  }
  
  if (lowerAnswer.includes('frecuentemente') || lowerAnswer.includes('frequently')) {
    return 'Frecuentemente';
  }
  
  if (lowerAnswer.includes('a veces') || lowerAnswer.includes('sometimes') || 
      lowerAnswer.includes('ocasionalmente') || lowerAnswer.includes('occasionally')) {
    return 'A veces';
  }
  
  if (lowerAnswer.includes('rara vez') || lowerAnswer.includes('rarely')) {
    return 'Rara vez';
  }
  
  // Para respuestas que no coinciden exactamente, usar la respuesta original capitalizada
  return answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase();
}

export const transformSymptoms = (symptoms: any[]) => {
  return symptoms
    .filter(answer => {
      // Verificar que tenemos la respuesta y que indica presencia de síntoma
      return answer.answer && 
             typeof answer.answer === 'string' && 
             shouldReportSymptom(answer.answer);
    })
    .map(symptom => {
      // Acceder al question_text desde la estructura JOIN
      const questionText = symptom.form_questions?.question_text || symptom.question_text;
      const symptomName = extractSymptomFromQuestion(questionText) || 
                          questionText?.replace(/.*[¿?]\s*/, '').replace(/[¿?]*$/, '') ||
                          symptom.question_id.replace(/_/g, ' ');
      
      return {
        name: symptomName,
        severity: getFrequencyLabel(symptom.answer)
      };
    })
    .slice(0, 5); // Limitar a 5 síntomas principales
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
    // Additional clinical fields from report_comments
    technical_details: note.technical_details,
    patient_friendly_content: note.patient_friendly_content,
    warning_signs: note.warning_signs,
    action_steps: note.action_steps,
    expected_timeline: note.expected_timeline,
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
  console.log('🔄 buildTransformedReport: Input reportData:', reportData);
  console.log('🔄 buildTransformedReport: reportData.diagnosis:', reportData.diagnosis);
  console.log('🔄 buildTransformedReport: reportData.diagnosis type:', typeof reportData.diagnosis);

  const transformedReport = {
    id: reportData.id,
    form_id: reportData.form_id,
    patient: patient,
    createdAt: reportData.created_at,
    vitalityScore: reportData.diagnosis?.vitalityScore || reportData.vitality_score || 45,
    qualityOfLife: Math.min(5, Math.max(1, Math.round((reportData.diagnosis?.vitalityScore || reportData.vitality_score || 45) / 20))) as 1 | 2 | 3 | 4 | 5,
    biologicalAge: calculateBiologicalAge(patient?.date_of_birth, reportData.diagnosis?.vitalityScore || reportData.vitality_score || 45),
    chronologicalAge: calculateChronologicalAge(patient?.date_of_birth),
    risks: finalRisks,
    biomarkerSummary,
    topSymptoms,
    recentBiomarkers,
    // Use clinical_notes instead of clinicalNotes to match component expectations
    clinical_notes: transformedClinicalNotes,
    summary: typeof reportData.diagnosis === 'string' ? reportData.diagnosis : 
             (typeof reportData.diagnosis?.summary === 'string' ? reportData.diagnosis.summary : 
              generateSummary(patient, finalRisks, biomarkerSummary)),
    manualNotes: reportData.manual_notes,
    // Cambiar de actionPlan a actionPlans para usar el array completo
    actionPlans: transformedActionPlan,
    summarySections: summarySections,
    keyFindings: [], // This will be populated in useReportData
    // Additional diagnostic fields from reports table
    risk_score: reportData.average_risk, // Using average_risk as the correct field
    average_risk: reportData.average_risk,
    personalized_insights: reportData.personalized_insights || {},
    critical_biomarkers: reportData.critical_biomarkers || [],
    diagnosis_date: reportData.diagnosis_date || reportData.created_at,
    // IMPORTANT: Pass through the raw diagnosis field
    diagnosis: reportData.diagnosis
  };

  console.log('✅ buildTransformedReport: Final transformedReport.diagnosis:', transformedReport.diagnosis);
  console.log('✅ buildTransformedReport: Final transformedReport.summary:', transformedReport.summary);
  
  return transformedReport;
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
