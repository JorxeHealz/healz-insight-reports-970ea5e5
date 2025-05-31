
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';

export const useRealBiomarkers = (patientId: string) => {
  return useQuery({
    queryKey: ['real-biomarkers', patientId],
    queryFn: async (): Promise<Biomarker[]> => {
      if (!patientId) return [];

      console.log('Fetching real biomarkers for patient:', patientId);

      // Fetch biomarkers with their definitions
      const { data, error } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('patient_id', patientId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching biomarkers:', error);
        throw error;
      }

      console.log('Real biomarkers data:', data);

      // Transform the data to match our Biomarker interface
      const transformedBiomarkers: Biomarker[] = (data || []).map(record => {
        const biomarkerInfo = record.biomarker;
        
        // Determine status based on ranges
        let status: 'optimal' | 'caution' | 'outOfRange' = 'optimal';
        
        if (record.is_out_of_range) {
          status = 'outOfRange';
        } else if (biomarkerInfo && (
          record.value < biomarkerInfo.optimal_min || 
          record.value > biomarkerInfo.optimal_max
        )) {
          status = 'caution';
        }

        return {
          name: biomarkerInfo?.name || 'Unknown',
          valueWithUnit: `${record.value} ${biomarkerInfo?.unit || ''}`,
          status,
          collectedAgo: new Date(record.date).toLocaleDateString('es-ES'),
          rawValue: record.value,
          unit: biomarkerInfo?.unit || '',
          biomarkerData: biomarkerInfo,
          collectedAt: record.date,
          notes: record.notes
        };
      });

      return transformedBiomarkers;
    },
    enabled: !!patientId
  });
};
