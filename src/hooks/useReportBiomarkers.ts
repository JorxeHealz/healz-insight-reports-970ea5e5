
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Biomarker } from '../components/report/biomarkers/types';

export const useReportBiomarkers = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['report-biomarkers', reportId],
    queryFn: async (): Promise<Biomarker[]> => {
      if (!reportId) {
        console.log('useReportBiomarkers: No reportId provided');
        return [];
      }

      console.log('useReportBiomarkers: Fetching biomarkers for report:', reportId);

      // Consulta simple y directa con JOIN
      const { data, error } = await supabase
        .from('patient_biomarkers')
        .select(`
          id,
          patient_id,
          biomarker_id,
          value,
          date,
          is_out_of_range,
          notes,
          biomarkers (
            id,
            name,
            unit,
            description,
            category,
            Panel,
            conventional_min,
            conventional_max,
            optimal_min,
            optimal_max
          )
        `)
        .eq('report_id', reportId)
        .order('date', { ascending: false });

      console.log('useReportBiomarkers: Query result:', {
        data,
        error,
        count: data?.length || 0
      });

      if (error) {
        console.error('useReportBiomarkers: Error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('useReportBiomarkers: No biomarkers found');
        return [];
      }

      return transformBiomarkersData(data);
    },
    enabled: !!reportId
  });
};

// Función simplificada para transformar los datos
function transformBiomarkersData(biomarkersData: any[]): Biomarker[] {
  console.log('transformBiomarkersData: Processing', biomarkersData.length, 'records');
  
  return biomarkersData
    .filter(record => record.biomarkers) // Solo procesar registros con datos del biomarcador
    .map(record => {
      const biomarkerInfo = record.biomarkers;
      const numericValue = typeof record.value === 'string' ? parseFloat(record.value) : record.value;
      
      // Determinar el estado del biomarcador
      let status: 'optimal' | 'caution' | 'outOfRange' = 'optimal';
      
      if (record.is_out_of_range) {
        status = 'outOfRange';
      } else if (
        (biomarkerInfo.optimal_min !== null && numericValue < biomarkerInfo.optimal_min) ||
        (biomarkerInfo.optimal_max !== null && numericValue > biomarkerInfo.optimal_max)
      ) {
        status = 'caution';
      }

      const result: Biomarker = {
        name: biomarkerInfo.name,
        valueWithUnit: `${record.value} ${biomarkerInfo.unit || ''}`,
        status,
        collectedAgo: new Date(record.date).toLocaleDateString('es-ES'),
        rawValue: numericValue,
        unit: biomarkerInfo.unit || '',
        biomarkerData: biomarkerInfo,
        collectedAt: record.date,
        notes: record.notes
      };
      
      return result;
    });
}
