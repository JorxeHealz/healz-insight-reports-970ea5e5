
import { useQuery } from '@tanstack/react-query';
import { Biomarker } from '../components/report/biomarkers/types';

// Mock hook to simulate fetching biomarkers for a patient
// In a real application, this would fetch data from an API
export const useDemoBiomarkers = (patientId: string) => {
  return useQuery({
    queryKey: ['demo-biomarkers', patientId],
    queryFn: async (): Promise<Biomarker[]> => {
      // Simulate fetching patient data
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock patient data
      const patientData = {
        '550e8400-e29b-41d4-a716-446655440000': { // María González (Metabolic Syndrome)
          name: 'María González',
          age: 45,
          condition: 'Metabolic Syndrome'
        },
        '550e8400-e29b-41d4-a716-446655440001': { // Ana López (Menopause)
          name: 'Ana López',
          age: 52,
          condition: 'Menopause'
        },
        '550e8400-e29b-41d4-a716-446655440002': { // Carlos Rodríguez (Athlete with Stress)
          name: 'Carlos Rodríguez',
          age: 32,
          condition: 'Athlete with Stress'
        }
      };

      // Mock biomarker definitions
      const availableBiomarkers = [
        { name: 'Glucose', unit: 'mg/dL', optimal_min: 70, optimal_max: 100 },
        { name: 'Cholesterol', unit: 'mg/dL', optimal_min: 120, optimal_max: 200 },
        { name: 'Vitamin D', unit: 'ng/mL', optimal_min: 30, optimal_max: 60 },
        { name: 'Cortisol', unit: 'μg/dL', optimal_min: 6.2, optimal_max: 19.4 },
        { name: 'TSH', unit: 'μIU/mL', optimal_min: 0.4, optimal_max: 4.0 },
        { name: 'CRP', unit: 'mg/L', optimal_min: 0, optimal_max: 3.0 },
        { name: 'HbA1c', unit: '%', optimal_min: 4.0, optimal_max: 5.6 },
        { name: 'Testosterone', unit: 'ng/dL', optimal_min: 300, optimal_max: 1000 },
        { name: 'Estradiol', unit: 'pg/mL', optimal_min: 30, optimal_max: 400 },
        { name: 'DHEA-S', unit: 'μg/dL', optimal_min: 85, optimal_max: 475 }
      ];

      // Mock biomarker values based on patient condition with proper typing
      const biomarkerValues: Array<{
        name: string;
        value: number;
        unit: string;
        status: 'optimal' | 'caution' | 'outOfRange';
        collectedAgo: string;
        notes: string;
      }> = [
        { name: 'Glucose', value: 110, unit: 'mg/dL', status: 'outOfRange', collectedAgo: '2 days ago', notes: 'High after meal' },
        { name: 'Cholesterol', value: 220, unit: 'mg/dL', status: 'outOfRange', collectedAgo: '2 days ago', notes: 'High total cholesterol' },
        { name: 'Vitamin D', value: 25, unit: 'ng/mL', status: 'caution', collectedAgo: '2 days ago', notes: 'Slightly low' },
        { name: 'Cortisol', value: 12, unit: 'μg/dL', status: 'optimal', collectedAgo: '2 days ago', notes: 'Normal range' },
        { name: 'TSH', value: 5.2, unit: 'μIU/mL', status: 'outOfRange', collectedAgo: '2 days ago', notes: 'Slightly elevated' },
        { name: 'CRP', value: 4.5, unit: 'mg/L', status: 'outOfRange', collectedAgo: '2 days ago', notes: 'Elevated inflammation' },
        { name: 'HbA1c', value: 6.1, unit: '%', status: 'outOfRange', collectedAgo: '2 days ago', notes: 'Elevated blood sugar' },
        { name: 'Testosterone', value: 450, unit: 'ng/dL', status: 'optimal', collectedAgo: '2 days ago', notes: 'Normal range' },
        { name: 'Estradiol', value: 80, unit: 'pg/mL', status: 'optimal', collectedAgo: '2 days ago', notes: 'Normal range' },
        { name: 'DHEA-S', value: 300, unit: 'μg/dL', status: 'optimal', collectedAgo: '2 days ago', notes: 'Normal range' }
      ];

      // Transform biomarkers with proper typing
      const transformedBiomarkers: Biomarker[] = biomarkerValues.map((biomarker, index) => {
        // Get the biomarker definition
        const biomarkerDef = availableBiomarkers.find(b => b.name === biomarker.name);
        
        return {
          name: biomarker.name,
          valueWithUnit: `${biomarker.value} ${biomarker.unit}`,
          status: biomarker.status,
          collectedAgo: biomarker.collectedAgo,
          rawValue: biomarker.value,
          unit: biomarker.unit,
          biomarkerData: biomarkerDef,
          collectedAt: new Date().toISOString(),
          notes: biomarker.notes
        };
      });

      return transformedBiomarkers;
    },
    enabled: !!patientId
  });
};
