
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';

// Generate demo biomarkers when real data is not available
const generateDemoBiomarkers = (patientId: string): Biomarker[] => {
  // María González (Metabolic Syndrome)
  if (patientId === '550e8400-e29b-41d4-a716-446655440000') {
    return [
      { name: 'Glucose', valueWithUnit: '126 mg/dL', rawValue: 126, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Pre-diabetic glucose' },
      { name: 'HbA1c', valueWithUnit: '6.2%', rawValue: 6.2, unit: '%', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Pre-diabetic HbA1c' },
      { name: 'Total Cholesterol', valueWithUnit: '245 mg/dL', rawValue: 245, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Elevated cholesterol' },
      { name: 'HDL Cholesterol', valueWithUnit: '38 mg/dL', rawValue: 38, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low HDL' },
      { name: 'LDL Cholesterol', valueWithUnit: '165 mg/dL', rawValue: 165, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High LDL' },
      { name: 'Triglycerides', valueWithUnit: '210 mg/dL', rawValue: 210, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Elevated triglycerides' },
      { name: 'Insulin', valueWithUnit: '18.5 μU/mL', rawValue: 18.5, unit: 'μU/mL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Insulin resistance' },
      { name: 'Cortisol', valueWithUnit: '15.8 μg/dL', rawValue: 15.8, unit: 'μg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal cortisol' },
      { name: 'TSH', valueWithUnit: '2.8 mIU/L', rawValue: 2.8, unit: 'mIU/L', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal TSH' },
      { name: 'Free T4', valueWithUnit: '1.3 ng/dL', rawValue: 1.3, unit: 'ng/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal T4' },
      { name: 'Vitamin D', valueWithUnit: '28 ng/mL', rawValue: 28, unit: 'ng/mL', status: 'caution', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Insufficient vitamin D' },
      { name: 'hs-CRP', valueWithUnit: '4.2 mg/L', rawValue: 4.2, unit: 'mg/L', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High inflammation' },
      { name: 'Hemoglobin', valueWithUnit: '13.2 g/dL', rawValue: 13.2, unit: 'g/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal hemoglobin' },
      { name: 'Creatinine', valueWithUnit: '0.9 mg/dL', rawValue: 0.9, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal creatinine' },
      { name: 'ALT', valueWithUnit: '42 U/L', rawValue: 42, unit: 'U/L', status: 'caution', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Slightly elevated ALT' },
      { name: 'AST', valueWithUnit: '38 U/L', rawValue: 38, unit: 'U/L', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal AST' },
      { name: 'Ferritin', valueWithUnit: '185 ng/mL', rawValue: 185, unit: 'ng/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal ferritin' },
      { name: 'Vitamin B12', valueWithUnit: '420 pg/mL', rawValue: 420, unit: 'pg/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal B12' },
      { name: 'Magnesium', valueWithUnit: '1.9 mg/dL', rawValue: 1.9, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal magnesium' },
      { name: 'Calcium', valueWithUnit: '9.8 mg/dL', rawValue: 9.8, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal calcium' }
    ];
  }

  // Carlos Rodríguez (Athlete with Stress)
  if (patientId === '550e8400-e29b-41d4-a716-446655440002') {
    return [
      { name: 'Testosterone', valueWithUnit: '680 ng/dL', rawValue: 680, unit: 'ng/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Good testosterone for athlete' },
      { name: 'Cortisol', valueWithUnit: '18.5 μg/dL', rawValue: 18.5, unit: 'μg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Elevated from stress' },
      { name: 'Creatine Kinase', valueWithUnit: '280 U/L', rawValue: 280, unit: 'U/L', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High from training' },
      { name: 'Vitamin D', valueWithUnit: '48 ng/mL', rawValue: 48, unit: 'ng/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Optimal vitamin D' },
      { name: 'Magnesium', valueWithUnit: '1.7 mg/dL', rawValue: 1.7, unit: 'mg/dL', status: 'caution', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low from sweating' },
      { name: 'Hemoglobin', valueWithUnit: '15.8 g/dL', rawValue: 15.8, unit: 'g/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Excellent for athlete' },
      { name: 'Hematocrit', valueWithUnit: '46.5%', rawValue: 46.5, unit: '%', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Good hematocrit' },
      { name: 'Ferritin', valueWithUnit: '95 ng/mL', rawValue: 95, unit: 'ng/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Good iron stores' },
      { name: 'TSH', valueWithUnit: '1.8 mIU/L', rawValue: 1.8, unit: 'mIU/L', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Optimal TSH' },
      { name: 'Free T3', valueWithUnit: '3.8 pg/mL', rawValue: 3.8, unit: 'pg/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Good T3' },
      { name: 'Total Cholesterol', valueWithUnit: '185 mg/dL', rawValue: 185, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Good cholesterol' },
      { name: 'HDL Cholesterol', valueWithUnit: '58 mg/dL', rawValue: 58, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Excellent HDL' },
      { name: 'LDL Cholesterol', valueWithUnit: '95 mg/dL', rawValue: 95, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Optimal LDL' },
      { name: 'Glucose', valueWithUnit: '88 mg/dL', rawValue: 88, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Optimal glucose' },
      { name: 'HbA1c', valueWithUnit: '5.2%', rawValue: 5.2, unit: '%', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Excellent HbA1c' },
      { name: 'Creatinine', valueWithUnit: '1.2 mg/dL', rawValue: 1.2, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal for athlete' },
      { name: 'ALT', valueWithUnit: '28 U/L', rawValue: 28, unit: 'U/L', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal ALT' },
      { name: 'Vitamin B12', valueWithUnit: '580 pg/mL', rawValue: 580, unit: 'pg/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High B12' },
      { name: 'hs-CRP', valueWithUnit: '2.8 mg/L', rawValue: 2.8, unit: 'mg/L', status: 'caution', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Slightly elevated from training' },
      { name: 'Potassium', valueWithUnit: '3.8 mEq/L', rawValue: 3.8, unit: 'mEq/L', status: 'caution', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Slightly low' }
    ];
  }

  // Ana López (Menopause)
  if (patientId === '550e8400-e29b-41d4-a716-446655440001') {
    return [
      { name: 'Estradiol', valueWithUnit: '15 pg/mL', rawValue: 15, unit: 'pg/mL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low estradiol - menopause' },
      { name: 'Progesterone', valueWithUnit: '0.8 ng/mL', rawValue: 0.8, unit: 'ng/mL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low progesterone' },
      { name: 'FSH', valueWithUnit: '68 mIU/mL', rawValue: 68, unit: 'mIU/mL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High FSH - menopause' },
      { name: 'Testosterone', valueWithUnit: '18 ng/dL', rawValue: 18, unit: 'ng/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low testosterone' },
      { name: 'TSH', valueWithUnit: '3.2 mIU/L', rawValue: 3.2, unit: 'mIU/L', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal TSH' },
      { name: 'Free T3', valueWithUnit: '2.8 pg/mL', rawValue: 2.8, unit: 'pg/mL', status: 'caution', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low T3' },
      { name: 'Vitamin D', valueWithUnit: '22 ng/mL', rawValue: 22, unit: 'ng/mL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Deficient vitamin D' },
      { name: 'Hemoglobin', valueWithUnit: '11.8 g/dL', rawValue: 11.8, unit: 'g/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low hemoglobin' },
      { name: 'Ferritin', valueWithUnit: '18 ng/mL', rawValue: 18, unit: 'ng/mL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Low iron stores' },
      { name: 'Total Cholesterol', valueWithUnit: '235 mg/dL', rawValue: 235, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High cholesterol' },
      { name: 'HDL Cholesterol', valueWithUnit: '65 mg/dL', rawValue: 65, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Good HDL' },
      { name: 'LDL Cholesterol', valueWithUnit: '145 mg/dL', rawValue: 145, unit: 'mg/dL', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High LDL' },
      { name: 'Glucose', valueWithUnit: '102 mg/dL', rawValue: 102, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal glucose' },
      { name: 'HbA1c', valueWithUnit: '5.6%', rawValue: 5.6, unit: '%', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal HbA1c' },
      { name: 'Calcium', valueWithUnit: '9.5 mg/dL', rawValue: 9.5, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal calcium' },
      { name: 'hs-CRP', valueWithUnit: '3.8 mg/L', rawValue: 3.8, unit: 'mg/L', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Elevated inflammation' },
      { name: 'Vitamin B12', valueWithUnit: '380 pg/mL', rawValue: 380, unit: 'pg/mL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal B12' },
      { name: 'Cortisol', valueWithUnit: '16.8 μg/dL', rawValue: 16.8, unit: 'μg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal cortisol' },
      { name: 'Magnesium', valueWithUnit: '1.8 mg/dL', rawValue: 1.8, unit: 'mg/dL', status: 'optimal', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'Normal magnesium' },
      { name: 'Homocysteine', valueWithUnit: '14.2 μmol/L', rawValue: 14.2, unit: 'μmol/L', status: 'outOfRange', collectedAt: '2025-05-30', collectedAgo: '1 día', notes: 'High homocysteine' }
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
          valueWithUnit: `${item.value} ${item.biomarkers.unit}`,
          rawValue: item.value,
          unit: item.biomarkers.unit,
          status: item.is_out_of_range ? 'outOfRange' : 'optimal' as 'optimal' | 'caution' | 'outOfRange',
          collectedAt: item.date,
          collectedAgo: '2 días',
          notes: item.notes || ''
        }));
      }

      // Otherwise return demo data
      return generateDemoBiomarkers(patientId);
    },
    enabled: !!patientId
  });
};
