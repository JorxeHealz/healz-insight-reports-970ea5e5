
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
        },
        '550e8400-e29b-41d4-a716-446655440003': { // Ana López específica para form
          name: 'Ana López',
          age: 52,
          condition: 'Menopause with Chronic Fatigue',
          formId: '660e8400-e29b-41d4-a716-446655440003'
        }
      };

      // Mock biomarker definitions with all required BiomarkerRow properties
      const availableBiomarkers = [
        { 
          id: '1', name: 'Glucose', unit: 'mg/dL', optimal_min: 70, optimal_max: 100, 
          description: 'Blood glucose level', category: 'metabolic', Panel: 'Basic Metabolic',
          conventional_min: 65, conventional_max: 110, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '2', name: 'Cholesterol', unit: 'mg/dL', optimal_min: 120, optimal_max: 200,
          description: 'Total cholesterol', category: 'cardiovascular', Panel: 'Lipid',
          conventional_min: 100, conventional_max: 240, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '3', name: 'Vitamin D', unit: 'ng/mL', optimal_min: 30, optimal_max: 60,
          description: 'Vitamin D 25-OH', category: 'nutrients', Panel: 'Vitamins',
          conventional_min: 20, conventional_max: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '4', name: 'Cortisol', unit: 'μg/dL', optimal_min: 6.2, optimal_max: 19.4,
          description: 'Morning cortisol', category: 'hormones', Panel: 'Stress',
          conventional_min: 4.0, conventional_max: 25.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '5', name: 'TSH', unit: 'μIU/mL', optimal_min: 0.4, optimal_max: 4.0,
          description: 'Thyroid stimulating hormone', category: 'hormones', Panel: 'Thyroid',
          conventional_min: 0.3, conventional_max: 5.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '6', name: 'CRP', unit: 'mg/L', optimal_min: 0, optimal_max: 3.0,
          description: 'C-reactive protein', category: 'inflammation', Panel: 'Inflammatory',
          conventional_min: 0, conventional_max: 10.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '7', name: 'HbA1c', unit: '%', optimal_min: 4.0, optimal_max: 5.6,
          description: 'Hemoglobin A1c', category: 'metabolic', Panel: 'Diabetes',
          conventional_min: 4.0, conventional_max: 6.5, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '8', name: 'Testosterone', unit: 'ng/dL', optimal_min: 300, optimal_max: 1000,
          description: 'Total testosterone', category: 'hormones', Panel: 'Male Hormones',
          conventional_min: 200, conventional_max: 1200, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '9', name: 'Estradiol', unit: 'pg/mL', optimal_min: 30, optimal_max: 400,
          description: 'Estradiol hormone', category: 'hormones', Panel: 'Female Hormones',
          conventional_min: 15, conventional_max: 500, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '10', name: 'DHEA-S', unit: 'μg/dL', optimal_min: 85, optimal_max: 475,
          description: 'DHEA sulfate', category: 'hormones', Panel: 'Adrenal',
          conventional_min: 50, conventional_max: 600, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        // New biomarkers for Ana's comprehensive profile
        { 
          id: '11', name: 'FSH', unit: 'mIU/mL', optimal_min: 5, optimal_max: 20,
          description: 'Follicle stimulating hormone', category: 'hormones', Panel: 'Female Hormones',
          conventional_min: 1.4, conventional_max: 18.1, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '12', name: 'LH', unit: 'mIU/mL', optimal_min: 5, optimal_max: 25,
          description: 'Luteinizing hormone', category: 'hormones', Panel: 'Female Hormones',
          conventional_min: 1.9, conventional_max: 12.5, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '13', name: 'Progesterone', unit: 'ng/mL', optimal_min: 0.2, optimal_max: 25,
          description: 'Progesterone hormone', category: 'hormones', Panel: 'Female Hormones',
          conventional_min: 0.1, conventional_max: 30, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '14', name: 'Free T4', unit: 'ng/dL', optimal_min: 1.0, optimal_max: 1.8,
          description: 'Free thyroxine', category: 'hormones', Panel: 'Thyroid',
          conventional_min: 0.8, conventional_max: 2.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '15', name: 'Free T3', unit: 'pg/mL', optimal_min: 3.0, optimal_max: 4.5,
          description: 'Free triiodothyronine', category: 'hormones', Panel: 'Thyroid',
          conventional_min: 2.3, conventional_max: 5.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '16', name: 'Insulin', unit: 'μIU/mL', optimal_min: 2, optimal_max: 10,
          description: 'Fasting insulin', category: 'metabolic', Panel: 'Diabetes',
          conventional_min: 2, conventional_max: 25, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '17', name: 'Ferritin', unit: 'ng/mL', optimal_min: 30, optimal_max: 150,
          description: 'Iron storage protein', category: 'nutrients', Panel: 'Iron Studies',
          conventional_min: 12, conventional_max: 300, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '18', name: 'B12', unit: 'pg/mL', optimal_min: 400, optimal_max: 1000,
          description: 'Vitamin B12', category: 'nutrients', Panel: 'Vitamins',
          conventional_min: 200, conventional_max: 900, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '19', name: 'Folate', unit: 'ng/mL', optimal_min: 4, optimal_max: 20,
          description: 'Folic acid', category: 'nutrients', Panel: 'Vitamins',
          conventional_min: 3, conventional_max: 17, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '20', name: 'Magnesium', unit: 'mg/dL', optimal_min: 2.0, optimal_max: 2.6,
          description: 'Serum magnesium', category: 'nutrients', Panel: 'Electrolytes',
          conventional_min: 1.7, conventional_max: 2.2, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '21', name: 'HDL Cholesterol', unit: 'mg/dL', optimal_min: 60, optimal_max: 100,
          description: 'High density lipoprotein', category: 'cardiovascular', Panel: 'Lipid',
          conventional_min: 40, conventional_max: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '22', name: 'LDL Cholesterol', unit: 'mg/dL', optimal_min: 70, optimal_max: 100,
          description: 'Low density lipoprotein', category: 'cardiovascular', Panel: 'Lipid',
          conventional_min: 70, conventional_max: 160, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '23', name: 'Triglycerides', unit: 'mg/dL', optimal_min: 50, optimal_max: 100,
          description: 'Blood triglycerides', category: 'cardiovascular', Panel: 'Lipid',
          conventional_min: 50, conventional_max: 150, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '24', name: 'Homocysteine', unit: 'μmol/L', optimal_min: 5, optimal_max: 10,
          description: 'Cardiovascular risk marker', category: 'cardiovascular', Panel: 'Cardiac Risk',
          conventional_min: 5, conventional_max: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        },
        { 
          id: '25', name: 'Iron', unit: 'μg/dL', optimal_min: 70, optimal_max: 150,
          description: 'Serum iron', category: 'nutrients', Panel: 'Iron Studies',
          conventional_min: 60, conventional_max: 170, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }
      ];

      // Generate biomarker values for Ana López with menopause and chronic fatigue
      if (patientId === '550e8400-e29b-41d4-a716-446655440003') {
        const anaBiomarkerValues = [
          // Hormones - typical menopause pattern
          { name: 'Estradiol', value: 18, status: 'outOfRange' as const, notes: 'Muy bajo - típico de menopausia' },
          { name: 'FSH', value: 45, status: 'outOfRange' as const, notes: 'Elevado - confirma menopausia' },
          { name: 'LH', value: 35, status: 'outOfRange' as const, notes: 'Elevado - menopausia establecida' },
          { name: 'Progesterone', value: 0.1, status: 'outOfRange' as const, notes: 'Muy bajo - ausencia de ovulación' },
          { name: 'DHEA-S', value: 65, status: 'caution' as const, notes: 'Bajo para la edad - fatiga adrenal' },
          
          // Thyroid - subclinical hypothyroidism contributing to fatigue
          { name: 'TSH', value: 4.8, status: 'outOfRange' as const, notes: 'Elevado - hipotiroidismo subclínico' },
          { name: 'Free T4', value: 0.9, status: 'caution' as const, notes: 'Límite bajo - contribuye a fatiga' },
          { name: 'Free T3', value: 2.8, status: 'caution' as const, notes: 'Bajo - conversión T4 a T3 reducida' },
          
          // Metabolic - insulin resistance developing
          { name: 'Glucose', value: 105, status: 'caution' as const, notes: 'Ligeramente elevada - resistencia insulínica' },
          { name: 'HbA1c', value: 5.8, status: 'caution' as const, notes: 'Prediabetes - cambios hormonales' },
          { name: 'Insulin', value: 18, status: 'outOfRange' as const, notes: 'Elevada - resistencia insulínica' },
          
          // Nutrients - common deficiencies in menopause and fatigue
          { name: 'Vitamin D', value: 22, status: 'caution' as const, notes: 'Deficiente - afecta energía y huesos' },
          { name: 'B12', value: 280, status: 'caution' as const, notes: 'Bajo - contribuye a fatiga crónica' },
          { name: 'Folate', value: 3.2, status: 'caution' as const, notes: 'Límite bajo - necesario para energía' },
          { name: 'Ferritin', value: 18, status: 'caution' as const, notes: 'Bajo - anemia ferropénica leve' },
          { name: 'Iron', value: 55, status: 'caution' as const, notes: 'Bajo - contribuye a fatiga' },
          { name: 'Magnesium', value: 1.8, status: 'caution' as const, notes: 'Bajo - déficit común en menopausia' },
          
          // Cardiovascular - increased risk post-menopause
          { name: 'Cholesterol', value: 235, status: 'outOfRange' as const, notes: 'Elevado - riesgo cardiovascular aumentado' },
          { name: 'LDL Cholesterol', value: 145, status: 'outOfRange' as const, notes: 'Alto - sin protección estrogénica' },
          { name: 'HDL Cholesterol', value: 48, status: 'caution' as const, notes: 'Bajo - riesgo cardiovascular' },
          { name: 'Triglycerides', value: 165, status: 'outOfRange' as const, notes: 'Elevados - síndrome metabólico' },
          { name: 'Homocysteine', value: 12, status: 'caution' as const, notes: 'Ligeramente elevado - riesgo CV' },
          
          // Inflammation and stress - chronic fatigue pattern
          { name: 'CRP', value: 4.2, status: 'outOfRange' as const, notes: 'Elevado - inflamación crónica' },
          { name: 'Cortisol', value: 22, status: 'outOfRange' as const, notes: 'Elevado - estrés crónico' },
          
          // Additional markers
          { name: 'Testosterone', value: 8, status: 'outOfRange' as const, notes: 'Muy bajo - típico en menopausia' }
        ];

        const transformedBiomarkers: Biomarker[] = anaBiomarkerValues.map((biomarker, index) => {
          const biomarkerDef = availableBiomarkers.find(b => b.name === biomarker.name);
          
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

        return transformedBiomarkers;
      }

      // Mock biomarker values based on patient condition with proper typing for other patients
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
