
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

      // Use RPC function to execute the SQL query that we know works
      const { data: rawData, error: biomarkersError } = await supabase
        .rpc('get_report_biomarkers', { p_report_id: reportId });

      console.log('useReportBiomarkers: RPC query result:', {
        data: rawData,
        error: biomarkersError,
        count: rawData?.length || 0
      });

      if (biomarkersError) {
        console.error('useReportBiomarkers: Error fetching biomarkers with RPC:', biomarkersError);
        throw biomarkersError;
      }

      if (!rawData || rawData.length === 0) {
        console.log('useReportBiomarkers: No biomarkers found via RPC');
        return [];
      }

      // Transform the RPC result into Biomarker format
      const transformedBiomarkers: Biomarker[] = rawData.map((row: any) => {
        const numericValue = typeof row.value === 'string' ? parseFloat(row.value) : row.value;
        
        // Create biomarker info object from the flat row data
        // Handle panel field as array (after migration)
        const biomarkerInfo = {
          id: row.biomarker_id,
          name: row.biomarker_name,
          unit: row.unit,
          description: row.description,
          category: row.category,
          panel: Array.isArray(row.panel) ? row.panel : (row.panel ? [row.panel] : null), // Handle both array and string cases
          conventional_min: row.conventional_min,
          conventional_max: row.conventional_max,
          optimal_min: row.optimal_min,
          optimal_max: row.optimal_max,
          created_at: row.biomarker_created_at,
          updated_at: row.biomarker_updated_at
        };
        
        // Determinar el estado del biomarcador usando la utilidad existente
        const evaluation = evaluateBiomarkerStatus(numericValue, biomarkerInfo);
        const valueWithUnit = formatBiomarkerValue(numericValue, biomarkerInfo.unit);
        const collectedAgo = formatDistanceToNow(new Date(row.date), { 
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
          collectedAt: row.date,
          notes: row.notes
        };
        
        console.log('useReportBiomarkers: Transformed biomarker:', result);
        return result;
      });

      console.log('useReportBiomarkers: Final transformed biomarkers:', transformedBiomarkers.length);
      return transformedBiomarkers;
    },
    enabled: !!reportId
  });
};
