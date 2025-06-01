import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';

export const useReportBiomarkers = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['report-biomarkers', reportId],
    queryFn: async (): Promise<Biomarker[]> => {
      if (!reportId) return [];

      console.log('Fetching biomarkers for report:', reportId);

      // Primero intentar obtener biomarcadores por report_id
      const { data, error } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('report_id', reportId)
        .order('date', { ascending: false });

      // Si no hay biomarcadores con report_id, usar form_id como fallback
      if ((!data || data.length === 0) && !error) {
        const { data: reportData } = await supabase
          .from('reports')
          .select('form_id')
          .eq('id', reportId)
          .single();

        if (reportData?.form_id) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('patient_biomarkers')
            .select(`
              *,
              biomarker:biomarkers(*)
            `)
            .eq('form_id', reportData.form_id)
            .order('date', { ascending: false });

          if (fallbackError) {
            console.error('Error fetching fallback biomarkers:', fallbackError);
            throw fallbackError;
          }

          const transformedBiomarkers: Biomarker[] = (fallbackData || []).map(biomarker => {
            const biomarkerInfo = biomarker.biomarker;
            
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
        }
      }

      if (error) {
        console.error('Error fetching report biomarkers:', error);
        throw error;
      }

      const transformedBiomarkers: Biomarker[] = (data || []).map(biomarker => {
        const biomarkerInfo = biomarker.biomarker;
        
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
    enabled: !!reportId
  });
};
