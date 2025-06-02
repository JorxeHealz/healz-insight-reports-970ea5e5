
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';
import { evaluateBiomarkerStatus, formatBiomarkerValue } from '../utils/biomarkerEvaluation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const useReportBiomarkers = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['report-biomarkers', reportId],
    queryFn: async (): Promise<Biomarker[]> => {
      if (!reportId) {
        console.log('useReportBiomarkers: No reportId provided');
        return [];
      }

      console.log('useReportBiomarkers: Fetching biomarkers for report:', reportId);

      // Single query with JOIN to get both patient_biomarkers and biomarkers data
      const { data: patientBiomarkers, error: biomarkersError } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarkers (*)
        `)
        .eq('report_id', reportId)
        .order('date', { ascending: false });

      console.log('useReportBiomarkers: Patient biomarkers with JOIN query result:', {
        data: patientBiomarkers,
        error: biomarkersError,
        count: patientBiomarkers?.length || 0
      });

      if (biomarkersError) {
        console.error('useReportBiomarkers: Error fetching patient biomarkers with JOIN:', biomarkersError);
        throw biomarkersError;
      }

      if (!patientBiomarkers || patientBiomarkers.length === 0) {
        console.log('useReportBiomarkers: No patient biomarkers found');
        return [];
      }

      // Transform the data now that we have both patient_biomarkers and biomarkers in one query
      const transformedBiomarkers: Biomarker[] = patientBiomarkers.map(pb => {
        const biomarkerInfo = pb.biomarkers;
        
        if (!biomarkerInfo) {
          console.warn('useReportBiomarkers: No biomarker info found for patient biomarker:', pb.id);
          return null;
        }

        const numericValue = typeof pb.value === 'string' ? parseFloat(pb.value) : pb.value;
        
        // Determinar el estado del biomarcador usando la utilidad existente
        const evaluation = evaluateBiomarkerStatus(numericValue, biomarkerInfo);
        const valueWithUnit = formatBiomarkerValue(numericValue, biomarkerInfo.unit);
        const collectedAgo = formatDistanceToNow(new Date(pb.date), { 
          addSuffix: false,
          locale: es 
        });

        const result: Biomarker = {
          name: biomarkerInfo.name,
          valueWithUnit,
          status: evaluation.status,
          collectedAgo,
          rawValue: numericValue,
          unit: biomarkerInfo.unit || '',
          biomarkerData: biomarkerInfo,
          collectedAt: pb.date,
          notes: pb.notes
        };
        
        console.log('useReportBiomarkers: Transformed biomarker:', result);
        return result;
      }).filter(Boolean) as Biomarker[];

      console.log('useReportBiomarkers: Final transformed biomarkers:', transformedBiomarkers.length);
      return transformedBiomarkers;
    },
    enabled: !!reportId
  });
};
