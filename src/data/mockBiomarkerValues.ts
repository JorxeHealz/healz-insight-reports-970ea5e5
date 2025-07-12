
import { Biomarker } from '../components/report/biomarkers/types';
import { mockBiomarkerDefinitions } from './mockBiomarkerDefinitions';

export interface MockBiomarkerValue {
  name: string;
  value: number;
  status: 'optimal' | 'caution' | 'outOfRange';
  notes: string;
}

export const getAnaBiomarkerValues = (): MockBiomarkerValue[] => [
  // Hormones - typical menopause pattern
  { name: 'Estradiol', value: 18, status: 'outOfRange', notes: 'Muy bajo - típico de menopausia' },
  { name: 'FSH', value: 45, status: 'outOfRange', notes: 'Elevado - confirma menopausia' },
  { name: 'LH', value: 35, status: 'outOfRange', notes: 'Elevado - menopausia establecida' },
  { name: 'Progesterone', value: 0.1, status: 'outOfRange', notes: 'Muy bajo - ausencia de ovulación' },
  { name: 'DHEA-S', value: 65, status: 'caution', notes: 'Bajo para la edad - fatiga adrenal' },
  
  // Thyroid - subclinical hypothyroidism contributing to fatigue
  { name: 'TSH', value: 4.8, status: 'outOfRange', notes: 'Elevado - hipotiroidismo subclínico' },
  { name: 'Free T4', value: 0.9, status: 'caution', notes: 'Límite bajo - contribuye a fatiga' },
  { name: 'Free T3', value: 2.8, status: 'caution', notes: 'Bajo - conversión T4 a T3 reducida' },
  
  // Metabolic - insulin resistance developing
  { name: 'Glucose', value: 105, status: 'caution', notes: 'Ligeramente elevada - resistencia insulínica' },
  { name: 'HbA1c', value: 5.8, status: 'caution', notes: 'Prediabetes - cambios hormonales' },
  { name: 'Insulin', value: 18, status: 'outOfRange', notes: 'Elevada - resistencia insulínica' },
  
  // Nutrients - common deficiencies in menopause and fatigue
  { name: 'Vitamin D', value: 22, status: 'caution', notes: 'Deficiente - afecta energía y huesos' },
  { name: 'B12', value: 280, status: 'caution', notes: 'Bajo - contribuye a fatiga crónica' },
  { name: 'Folate', value: 3.2, status: 'caution', notes: 'Límite bajo - necesario para energía' },
  { name: 'Ferritin', value: 18, status: 'caution', notes: 'Bajo - anemia ferropénica leve' },
  { name: 'Iron', value: 55, status: 'caution', notes: 'Bajo - contribuye a fatiga' },
  { name: 'Magnesium', value: 1.8, status: 'caution', notes: 'Bajo - déficit común en menopausia' },
  
  // Cardiovascular - increased risk post-menopause
  { name: 'Cholesterol', value: 235, status: 'outOfRange', notes: 'Elevado - riesgo cardiovascular aumentado' },
  { name: 'LDL Cholesterol', value: 145, status: 'outOfRange', notes: 'Alto - sin protección estrogénica' },
  { name: 'HDL Cholesterol', value: 48, status: 'caution', notes: 'Bajo - riesgo cardiovascular' },
  { name: 'Triglycerides', value: 165, status: 'outOfRange', notes: 'Elevados - síndrome metabólico' },
  { name: 'Homocysteine', value: 12, status: 'caution', notes: 'Ligeramente elevado - riesgo CV' },
  
  // Inflammation and stress - chronic fatigue pattern
  { name: 'CRP', value: 4.2, status: 'outOfRange', notes: 'Elevado - inflamación crónica' },
  { name: 'Cortisol', value: 22, status: 'outOfRange', notes: 'Elevado - estrés crónico' },
  
  // Additional markers
  { name: 'Testosterone', value: 8, status: 'outOfRange', notes: 'Muy bajo - típico en menopausia' }
];

export const getDefaultBiomarkerValues = (): MockBiomarkerValue[] => [
  { name: 'Glucose', value: 110, status: 'outOfRange', notes: 'High after meal' },
  { name: 'Cholesterol', value: 220, status: 'outOfRange', notes: 'High total cholesterol' },
  { name: 'Vitamin D', value: 25, status: 'caution', notes: 'Slightly low' },
  { name: 'Cortisol', value: 12, status: 'optimal', notes: 'Normal range' },
  { name: 'TSH', value: 5.2, status: 'outOfRange', notes: 'Slightly elevated' },
  { name: 'CRP', value: 4.5, status: 'outOfRange', notes: 'Elevated inflammation' },
  { name: 'HbA1c', value: 6.1, status: 'outOfRange', notes: 'Elevated blood sugar' },
  { name: 'Testosterone', value: 450, status: 'optimal', notes: 'Normal range' },
  { name: 'Estradiol', value: 80, status: 'optimal', notes: 'Normal range' },
  { name: 'DHEA-S', value: 300, status: 'optimal', notes: 'Normal range' }
];

export const transformMockBiomarkerValues = (values: MockBiomarkerValue[]): Biomarker[] => {
  return values.map((biomarker) => {
    const biomarkerDef = mockBiomarkerDefinitions.find(b => b.name === biomarker.name);
    
    return {
      name: biomarker.name,
      valueWithUnit: `${biomarker.value} ${biomarkerDef?.unit || ''}`,
      status: biomarker.status,
      collectedAgo: '3 días',
      rawValue: biomarker.value,
      unit: biomarkerDef?.unit || '',
      biomarkerData: biomarkerDef,
      collectedAt: new Date().toISOString(),
      notes: biomarker.notes
    };
  });
};
