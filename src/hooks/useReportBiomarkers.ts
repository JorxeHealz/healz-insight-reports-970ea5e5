
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

      // Primera consulta: intentar obtener biomarcadores por report_id
      const { data: reportBiomarkers, error: reportError } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('report_id', reportId)
        .order('date', { ascending: false });

      console.log('useReportBiomarkers: Direct report_id query result:', {
        data: reportBiomarkers,
        error: reportError,
        count: reportBiomarkers?.length || 0
      });

      // Si tenemos biomarcadores con report_id, los usamos directamente
      if (reportBiomarkers && reportBiomarkers.length > 0) {
        console.log('useReportBiomarkers: Found biomarkers with report_id, transforming...');
        const transformedBiomarkers = transformBiomarkersData(reportBiomarkers);
        console.log('useReportBiomarkers: Transformed biomarkers:', transformedBiomarkers);
        return transformedBiomarkers;
      }

      console.log('useReportBiomarkers: No biomarkers found with report_id, trying fallback with form_id...');

      // Fallback: obtener form_id del report y buscar por form_id
      const { data: reportData, error: reportFormError } = await supabase
        .from('reports')
        .select('form_id')
        .eq('id', reportId)
        .single();

      console.log('useReportBiomarkers: Report form_id query result:', {
        reportData,
        error: reportFormError
      });

      if (reportFormError) {
        console.error('useReportBiomarkers: Error fetching report form_id:', reportFormError);
        throw reportFormError;
      }

      if (!reportData?.form_id) {
        console.log('useReportBiomarkers: No form_id found for report');
        return [];
      }

      // Consulta fallback por form_id
      const { data: fallbackBiomarkers, error: fallbackError } = await supabase
        .from('patient_biomarkers')
        .select(`
          *,
          biomarker:biomarkers(*)
        `)
        .eq('form_id', reportData.form_id)
        .order('date', { ascending: false });

      console.log('useReportBiomarkers: Fallback form_id query result:', {
        data: fallbackBiomarkers,
        error: fallbackError,
        count: fallbackBiomarkers?.length || 0
      });

      if (fallbackError) {
        console.error('useReportBiomarkers: Error fetching fallback biomarkers:', fallbackError);
        throw fallbackError;
      }

      const transformedFallbackBiomarkers = transformBiomarkersData(fallbackBiomarkers || []);
      console.log('useReportBiomarkers: Final transformed biomarkers:', transformedFallbackBiomarkers);
      
      return transformedFallbackBiomarkers;
    },
    enabled: !!reportId
  });
};

// Función helper para transformar los datos de Supabase a nuestro formato
function transformBiomarkersData(biomarkersData: any[]): Biomarker[] {
  console.log('transformBiomarkersData: Input data:', biomarkersData);
  
  const transformed = biomarkersData.map((biomarker, index) => {
    console.log(`transformBiomarkersData: Processing biomarker ${index}:`, biomarker);
    
    const biomarkerInfo = biomarker.biomarker;
    
    if (!biomarkerInfo) {
      console.warn(`transformBiomarkersData: Missing biomarker info for index ${index}`);
      return null;
    }
    
    let status: 'optimal' | 'caution' | 'outOfRange' = 'optimal';
    
    // Determinar el estado basado en is_out_of_range y rangos óptimos
    if (biomarker.is_out_of_range) {
      status = 'outOfRange';
    } else if (biomarkerInfo && (
      (biomarkerInfo.optimal_min !== null && biomarker.value < biomarkerInfo.optimal_min) || 
      (biomarkerInfo.optimal_max !== null && biomarker.value > biomarkerInfo.optimal_max)
    )) {
      status = 'caution';
    }

    const result = {
      name: biomarkerInfo.name || 'Unknown',
      valueWithUnit: `${biomarker.value} ${biomarkerInfo.unit || ''}`,
      status,
      collectedAgo: new Date(biomarker.date).toLocaleDateString('es-ES'),
      rawValue: biomarker.value,
      unit: biomarkerInfo.unit || '',
      biomarkerData: biomarkerInfo,
      collectedAt: biomarker.date,
      notes: biomarker.notes
    };
    
    console.log(`transformBiomarkersData: Transformed biomarker ${index}:`, result);
    return result;
  }).filter(Boolean) as Biomarker[];
  
  console.log('transformBiomarkersData: Final result:', transformed);
  return transformed;
}
