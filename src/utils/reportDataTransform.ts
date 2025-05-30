
// Helper functions for transforming report data
export const calculateBiologicalAge = (dateOfBirth: string | null, vitalityScore: number): number => {
  if (!dateOfBirth) return 0;
  
  const chronologicalAge = calculateChronologicalAge(dateOfBirth);
  const adjustment = (70 - vitalityScore) / 10; // Lower vitality = higher biological age
  return Math.max(18, Math.round(chronologicalAge + adjustment));
};

export const calculateChronologicalAge = (dateOfBirth: string | null): number => {
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

export const getRiskPercentage = (riskLevel: string | undefined): number => {
  switch (riskLevel) {
    case 'low': return Math.floor(Math.random() * 25) + 5;
    case 'medium': return Math.floor(Math.random() * 25) + 35;
    case 'high': return Math.floor(Math.random() * 25) + 65;
    default: return Math.floor(Math.random() * 30) + 20;
  }
};

export const generateSymptomsFromRisk = (riskProfile: any) => {
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

export const generateClinicalNotes = (reportData: any, patient: any) => {
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
