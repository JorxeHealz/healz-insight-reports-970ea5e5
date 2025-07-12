
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';
import { evaluateBiomarkerStatus, formatBiomarkerValue } from '../utils/biomarkerEvaluation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const useRealBiomarkers = (patientId: string) => {
  return useQuery({
    queryKey: ['real-biomarkers', patientId],
    queryFn: async (): Promise<Biomarker[]> => {
      if (!patientId) return [];

      console.log('Fetching real biomarkers for patient:', patientId);

      // Fetch biomarkers with their definitions using simplified structure
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
        
        // Determine status based on ranges using evaluation utility
        const evaluation = evaluateBiomarkerStatus(record.value, biomarkerInfo);
        const valueWithUnit = formatBiomarkerValue(record.value, biomarkerInfo?.unit || '');
        const collectedAgo = formatDistanceToNow(new Date(record.date), { 
          addSuffix: false,
          locale: es 
        });

        return {
          name: biomarkerInfo?.name || 'Unknown',
          valueWithUnit,
          status: evaluation.status,
          collectedAgo,
          rawValue: record.value,
          unit: biomarkerInfo?.unit || '',
          biomarkerData: biomarkerInfo,
          collectedAt: record.date
        };
      });

      return transformedBiomarkers;
    },
    enabled: !!patientId
  });
};
