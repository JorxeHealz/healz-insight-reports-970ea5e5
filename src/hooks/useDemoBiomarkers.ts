import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';

// Generate demo biomarkers when real data is not available
const generateDemoBiomarkers = (patientId: string): Biomarker[] => {
  // María González (Metabolic Syndrome)
  if (patientId === '550e8400-e29b-41d4-a716-446655440000') {
    return [
      { name: 'Glucose', value: 126, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Pre-diabetic glucose' },
      { name: 'HbA1c', value: 6.2, unit: '%', status: 'outOfRange', date: '2025-05-30', notes: 'Pre-diabetic HbA1c' },
      { name: 'Total Cholesterol', value: 245, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Elevated cholesterol' },
      { name: 'HDL Cholesterol', value: 38, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Low HDL' },
      { name: 'LDL Cholesterol', value: 165, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'High LDL' },
      { name: 'Triglycerides', value: 210, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Elevated triglycerides' },
      { name: 'Insulin', value: 18.5, unit: 'μU/mL', status: 'outOfRange', date: '2025-05-30', notes: 'Insulin resistance' },
      { name: 'Cortisol', value: 15.8, unit: 'μg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal cortisol' },
      { name: 'TSH', value: 2.8, unit: 'mIU/L', status: 'optimal', date: '2025-05-30', notes: 'Normal TSH' },
      { name: 'Free T4', value: 1.3, unit: 'ng/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal T4' },
      { name: 'Vitamin D', value: 28, unit: 'ng/mL', status: 'caution', date: '2025-05-30', notes: 'Insufficient vitamin D' },
      { name: 'hs-CRP', value: 4.2, unit: 'mg/L', status: 'outOfRange', date: '2025-05-30', notes: 'High inflammation' },
      { name: 'Hemoglobin', value: 13.2, unit: 'g/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal hemoglobin' },
      { name: 'Creatinine', value: 0.9, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal creatinine' },
      { name: 'ALT', value: 42, unit: 'U/L', status: 'caution', date: '2025-05-30', notes: 'Slightly elevated ALT' },
      { name: 'AST', value: 38, unit: 'U/L', status: 'optimal', date: '2025-05-30', notes: 'Normal AST' },
      { name: 'Ferritin', value: 185, unit: 'ng/mL', status: 'optimal', date: '2025-05-30', notes: 'Normal ferritin' },
      { name: 'Vitamin B12', value: 420, unit: 'pg/mL', status: 'optimal', date: '2025-05-30', notes: 'Normal B12' },
      { name: 'Magnesium', value: 1.9, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal magnesium' },
      { name: 'Calcium', value: 9.8, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal calcium' }
    ];
  }

  // Carlos Rodríguez (Athlete with Stress)
  if (patientId === '550e8400-e29b-41d4-a716-446655440002') {
    return [
      { name: 'Testosterone', value: 680, unit: 'ng/dL', status: 'optimal', date: '2025-05-30', notes: 'Good testosterone for athlete' },
      { name: 'Cortisol', value: 18.5, unit: 'μg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Elevated from stress' },
      { name: 'Creatine Kinase', value: 280, unit: 'U/L', status: 'outOfRange', date: '2025-05-30', notes: 'High from training' },
      { name: 'Vitamin D', value: 48, unit: 'ng/mL', status: 'optimal', date: '2025-05-30', notes: 'Optimal vitamin D' },
      { name: 'Magnesium', value: 1.7, unit: 'mg/dL', status: 'caution', date: '2025-05-30', notes: 'Low from sweating' },
      { name: 'Hemoglobin', value: 15.8, unit: 'g/dL', status: 'optimal', date: '2025-05-30', notes: 'Excellent for athlete' },
      { name: 'Hematocrit', value: 46.5, unit: '%', status: 'optimal', date: '2025-05-30', notes: 'Good hematocrit' },
      { name: 'Ferritin', value: 95, unit: 'ng/mL', status: 'optimal', date: '2025-05-30', notes: 'Good iron stores' },
      { name: 'TSH', value: 1.8, unit: 'mIU/L', status: 'optimal', date: '2025-05-30', notes: 'Optimal TSH' },
      { name: 'Free T3', value: 3.8, unit: 'pg/mL', status: 'optimal', date: '2025-05-30', notes: 'Good T3' },
      { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Good cholesterol' },
      { name: 'HDL Cholesterol', value: 58, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Excellent HDL' },
      { name: 'LDL Cholesterol', value: 95, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Optimal LDL' },
      { name: 'Glucose', value: 88, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Optimal glucose' },
      { name: 'HbA1c', value: 5.2, unit: '%', status: 'optimal', date: '2025-05-30', notes: 'Excellent HbA1c' },
      { name: 'Creatinine', value: 1.2, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal for athlete' },
      { name: 'ALT', value: 28, unit: 'U/L', status: 'optimal', date: '2025-05-30', notes: 'Normal ALT' },
      { name: 'Vitamin B12', value: 580, unit: 'pg/mL', status: 'optimal', date: '2025-05-30', notes: 'High B12' },
      { name: 'hs-CRP', value: 2.8, unit: 'mg/L', status: 'caution', date: '2025-05-30', notes: 'Slightly elevated from training' },
      { name: 'Potassium', value: 3.8, unit: 'mEq/L', status: 'caution', date: '2025-05-30', notes: 'Slightly low' }
    ];
  }

  // Ana López (Menopause)
  if (patientId === '550e8400-e29b-41d4-a716-446655440001') {
    return [
      { name: 'Estradiol', value: 15, unit: 'pg/mL', status: 'outOfRange', date: '2025-05-30', notes: 'Low estradiol - menopause' },
      { name: 'Progesterone', value: 0.8, unit: 'ng/mL', status: 'outOfRange', date: '2025-05-30', notes: 'Low progesterone' },
      { name: 'FSH', value: 68, unit: 'mIU/mL', status: 'outOfRange', date: '2025-05-30', notes: 'High FSH - menopause' },
      { name: 'Testosterone', value: 18, unit: 'ng/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Low testosterone' },
      { name: 'TSH', value: 3.2, unit: 'mIU/L', status: 'optimal', date: '2025-05-30', notes: 'Normal TSH' },
      { name: 'Free T3', value: 2.8, unit: 'pg/mL', status: 'caution', date: '2025-05-30', notes: 'Low T3' },
      { name: 'Vitamin D', value: 22, unit: 'ng/mL', status: 'outOfRange', date: '2025-05-30', notes: 'Deficient vitamin D' },
      { name: 'Hemoglobin', value: 11.8, unit: 'g/dL', status: 'outOfRange', date: '2025-05-30', notes: 'Low hemoglobin' },
      { name: 'Ferritin', value: 18, unit: 'ng/mL', status: 'outOfRange', date: '2025-05-30', notes: 'Low iron stores' },
      { name: 'Total Cholesterol', value: 235, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'High cholesterol' },
      { name: 'HDL Cholesterol', value: 65, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Good HDL' },
      { name: 'LDL Cholesterol', value: 145, unit: 'mg/dL', status: 'outOfRange', date: '2025-05-30', notes: 'High LDL' },
      { name: 'Glucose', value: 102, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal glucose' },
      { name: 'HbA1c', value: 5.6, unit: '%', status: 'optimal', date: '2025-05-30', notes: 'Normal HbA1c' },
      { name: 'Calcium', value: 9.5, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal calcium' },
      { name: 'hs-CRP', value: 3.8, unit: 'mg/L', status: 'outOfRange', date: '2025-05-30', notes: 'Elevated inflammation' },
      { name: 'Vitamin B12', value: 380, unit: 'pg/mL', status: 'optimal', date: '2025-05-30', notes: 'Normal B12' },
      { name: 'Cortisol', value: 16.8, unit: 'μg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal cortisol' },
      { name: 'Magnesium', value: 1.8, unit: 'mg/dL', status: 'optimal', date: '2025-05-30', notes: 'Normal magnesium' },
      { name: 'Homocysteine', value: 14.2, unit: 'μmol/L', status: 'outOfRange', date: '2025-05-30', notes: 'High homocysteine' }
    ];
  }

  return [];
};

export const useDemoBiomarkers = (patientId: string) => {
  return useQuery({
    queryKey: ['demo-biomarkers', patientId],
    queryFn: async () => {
      // First try to get real biomarkers from database
      const { data: realBiomarkers, error } = await supabase
        .from('patient_biomarkers')
        .select(`
          id,
          value,
          date,
          is_out_of_range,
          notes,
          biomarkers!inner (
            name,
            unit
          )
        `)
        .eq('patient_id', patientId)
        .order('date', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching real biomarkers:', error);
      }

      // If we have real biomarkers, transform them
      if (realBiomarkers && realBiomarkers.length > 0) {
        return realBiomarkers.map(item => ({
          name: item.biomarkers.name,
          value: item.value,
          unit: item.biomarkers.unit,
          status: item.is_out_of_range ? 'outOfRange' : 'optimal' as 'optimal' | 'caution' | 'outOfRange',
          date: item.date,
          notes: item.notes || ''
        }));
      }

      // Otherwise return demo data
      return generateDemoBiomarkers(patientId);
    },
    enabled: !!patientId
  });
};
