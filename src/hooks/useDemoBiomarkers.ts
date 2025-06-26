
import { useQuery } from '@tanstack/react-query';
import { Biomarker } from '../components/report/biomarkers/types';
import { mockPatients } from '../data/mockPatients';
import { 
  getAnaBiomarkerValues, 
  getDefaultBiomarkerValues, 
  transformMockBiomarkerValues 
} from '../data/mockBiomarkerValues';

// Mock hook to simulate fetching biomarkers for a patient
// In a real application, this would fetch data from an API
export const useDemoBiomarkers = (patientId: string) => {
  return useQuery({
    queryKey: ['demo-biomarkers', patientId],
    queryFn: async (): Promise<Biomarker[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Validate patient exists
      const patient = mockPatients[patientId];
      if (!patient) {
        console.warn(`Patient with ID ${patientId} not found`);
        return [];
      }

      // Generate biomarker values based on patient condition
      if (patientId === '550e8400-e29b-41d4-a716-446655440003') {
        // Ana López with menopause and chronic fatigue - comprehensive profile
        const anaBiomarkerValues = getAnaBiomarkerValues();
        return transformMockBiomarkerValues(anaBiomarkerValues);
      }

      // Default biomarker values for other patients
      const defaultBiomarkerValues = getDefaultBiomarkerValues();
      return transformMockBiomarkerValues(defaultBiomarkerValues);
    },
    enabled: !!patientId
  });
};
