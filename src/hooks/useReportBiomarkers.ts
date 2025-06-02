
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

      // Step 1: Get patient biomarkers data
      const { data: patientBiomarkers, error: biomarkerError } = await supabase
        .from('patient_biomarkers')
        .select(`
          id,
          patient_id,
          biomarker_id,
          value,
          date,
          is_out_of_range,
          notes
        `)
        .eq('report_id', reportId)
        .order('date', { ascending: false });

      console.log('useReportBiomarkers: Patient biomarkers result:', {
        data: patientBiomarkers,
        error: biomarkerError,
        count: patientBiomarkers?.length || 0
      });

      if (biomarkerError) {
        console.error('useReportBiomarkers: Error fetching patient biomarkers:', biomarkerError);
        throw biomarkerError;
      }

      if (!patientBiomarkers || patientBiomarkers.length === 0) {
        console.log('useReportBiomarkers: No patient biomarkers found for report_id');
        return [];
      }

      // Step 2: Get biomarker definitions
      const biomarkerIds = patientBiomarkers.map(pb => pb.biomarker_id);
      const { data: biomarkerDefinitions, error: definitionsError } = await supabase
        .from('biomarkers')
        .select(`
          id,
          name,
          unit,
          description,
          category,
          "Panel",
          conventional_min,
          conventional_max,
          optimal_min,
          optimal_max
        `)
        .in('id', biomarkerIds);

      console.log('useReportBiomarkers: Biomarker definitions result:', {
        data: biomarkerDefinitions,
        error: definitionsError,
        count: biomarkerDefinitions?.length || 0
      });

      if (definitionsError) {
        console.error('useReportBiomarkers: Error fetching biomarker definitions:', definitionsError);
        throw definitionsError;
      }

      // Step 3: Combine the data
      const combinedData = patientBiomarkers.map(pb => {
        const biomarkerInfo = biomarkerDefinitions?.find(bd => bd.id === pb.biomarker_id);
        return {
          ...pb,
          biomarkers: biomarkerInfo
        };
      });

      console.log('useReportBiomarkers: Combined data:', {
        count: combinedData.length,
        sample: combinedData[0]
      });

      return transformBiomarkersData(combinedData);
    },
    enabled: !!reportId
  });
};

// Función mejorada para transformar los datos
function transformBiomarkersData(biomarkersData: any[]): Biomarker[] {
  console.log('transformBiomarkersData: Processing', biomarkersData.length, 'records');
  
  if (!biomarkersData || biomarkersData.length === 0) {
    console.log('transformBiomarkersData: No data to transform');
    return [];
  }
  
  const transformed = biomarkersData
    .map((record, index) => {
      console.log(`transformBiomarkersData: Processing record ${index}:`, record);
      
      // Verificar que tenemos los datos del biomarcador
      const biomarkerInfo = record.biomarkers;
      if (!biomarkerInfo) {
        console.warn(`transformBiomarkersData: Missing biomarker info for record ${index}`);
        return null;
      }
      
      // Asegurar que value es un número
      const numericValue = typeof record.value === 'string' ? parseFloat(record.value) : record.value;
      if (isNaN(numericValue)) {
        console.warn(`transformBiomarkersData: Invalid numeric value for record ${index}:`, record.value);
        return null;
      }
      
      // Determinar el estado del biomarcador
      let status: 'optimal' | 'caution' | 'outOfRange' = 'optimal';
      
      if (record.is_out_of_range) {
        status = 'outOfRange';
      } else {
        // Verificar si está fuera del rango óptimo
        const optimalMin = biomarkerInfo.optimal_min;
        const optimalMax = biomarkerInfo.optimal_max;
        
        if ((optimalMin !== null && numericValue < optimalMin) || 
            (optimalMax !== null && numericValue > optimalMax)) {
          status = 'caution';
        }
      }

      const result: Biomarker = {
        name: biomarkerInfo.name || 'Unknown Biomarker',
        valueWithUnit: `${record.value} ${biomarkerInfo.unit || ''}`,
        status,
        collectedAgo: new Date(record.date).toLocaleDateString('es-ES'),
        rawValue: numericValue,
        unit: biomarkerInfo.unit || '',
        biomarkerData: biomarkerInfo,
        collectedAt: record.date,
        notes: record.notes
      };
      
      console.log(`transformBiomarkersData: Transformed record ${index}:`, result);
      return result;
    })
    .filter((item): item is Biomarker => item !== null);
  
  console.log('transformBiomarkersData: Final result:', transformed.length, 'biomarkers');
  return transformed;
}
