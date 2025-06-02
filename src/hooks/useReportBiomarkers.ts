
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

      // Primera consulta: obtener patient_biomarkers con report_id
      const { data: patientBiomarkers, error: biomarkersError } = await supabase
        .from('patient_biomarkers')
        .select('*')
        .eq('report_id', reportId)
        .order('date', { ascending: false });

      console.log('useReportBiomarkers: Patient biomarkers query result:', {
        data: patientBiomarkers,
        error: biomarkersError,
        count: patientBiomarkers?.length || 0
      });

      if (biomarkersError) {
        console.error('useReportBiomarkers: Error fetching patient biomarkers:', biomarkersError);
        throw biomarkersError;
      }

      if (!patientBiomarkers || patientBiomarkers.length === 0) {
        console.log('useReportBiomarkers: No patient biomarkers found');
        return [];
      }

      // Segunda consulta: obtener información de biomarkers
      const biomarkerIds = [...new Set(patientBiomarkers.map(pb => pb.biomarker_id))];
      const { data: biomarkersData, error: biomarkersDataError } = await supabase
        .from('biomarkers')
        .select('*')
        .in('id', biomarkerIds);

      console.log('useReportBiomarkers: Biomarkers data query result:', {
        data: biomarkersData,
        error: biomarkersDataError,
        count: biomarkersData?.length || 0
      });

      if (biomarkersDataError) {
        console.error('useReportBiomarkers: Error fetching biomarkers data:', biomarkersDataError);
        throw biomarkersDataError;
      }

      if (!biomarkersData) {
        console.log('useReportBiomarkers: No biomarkers data found');
        return [];
      }

      // Combinar los datos manualmente
      const transformedBiomarkers: Biomarker[] = patientBiomarkers.map(pb => {
        const biomarkerInfo = biomarkersData.find(b => b.id === pb.biomarker_id);
        
        if (!biomarkerInfo) {
          console.warn('useReportBiomarkers: No biomarker info found for ID:', pb.biomarker_id);
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
