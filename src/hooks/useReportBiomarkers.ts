
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';

export const useReportBiomarkers = (formId: string | undefined) => {
  return useQuery({
    queryKey: ['report-biomarkers', formId],
    queryFn: async (): Promise<Biomarker[]> => {
      if (!formId) return [];

      console.log('Fetching biomarkers for form:', formId);

      const { data, error } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('form_id', formId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching report biomarkers:', error);
        throw error;
      }

      const transformedBiomarkers: Biomarker[] = (data || []).map(biomarker => {
        const biomarkerInfo = biomarker.biomarker;
        
        // Determine status based on ranges
        let status: 'optimal' | 'caution' | 'outOfRange' = 'optimal';
        
        if (biomarker.is_out_of_range) {
          status = 'outOfRange';
        } else if (biomarkerInfo && (
          biomarker.value < biomarkerInfo.optimal_min || 
          biomarker.value > biomarkerInfo.optimal_max
        )) {
          status = 'caution';
        }

        return {
          name: biomarkerInfo?.name || 'Unknown',
          valueWithUnit: `${biomarker.value} ${biomarkerInfo?.unit || ''}`,
          status,
          collectedAgo: new Date(biomarker.date).toLocaleDateString(),
          rawValue: biomarker.value,
          unit: biomarkerInfo?.unit || '',
          biomarkerData: biomarkerInfo,
          collectedAt: biomarker.date,
          notes: biomarker.notes
        };
      });

      return transformedBiomarkers;
    },
    enabled: !!formId
  });
};
