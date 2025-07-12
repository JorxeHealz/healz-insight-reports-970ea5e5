

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { evaluateBiomarkerStatus, formatBiomarkerValue } from '../utils/biomarkerEvaluation';
import { Biomarker, PatientBiomarkerData, BiomarkerRow } from '../components/report/biomarkers/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const useBiomarkerData = (patientId: string) => {
  return useQuery({
    queryKey: ['patient-biomarkers', patientId],
    queryFn: async (): Promise<Biomarker[]> => {
      console.log('Fetching biomarker data for patient:', patientId);
      
      // Fetch patient biomarkers with biomarker details using simplified structure
      const { data: patientBiomarkers, error } = await supabase
        .from('patient_biomarkers')
        .select(`
          id,
          patient_id,
          biomarker_id,
          value,
          date,
          analytics_id,
          created_at,
          created_by,
          biomarkers (
            id,
            name,
            unit,
            description,
            category,
            conventional_min,
            conventional_max,
            optimal_min,
            optimal_max,
            created_at,
            updated_at
          )
        `)
        .eq('patient_id', patientId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching biomarkers:', error);
        throw error;
      }

      if (!patientBiomarkers || patientBiomarkers.length === 0) {
        console.log('No biomarkers found for patient');
        return [];
      }

      // Get the most recent value for each biomarker
      const latestBiomarkers = new Map<string, PatientBiomarkerData>();
      
      patientBiomarkers.forEach((pb) => {
        // pb.biomarkers is an array from the join, get the first element
        const biomarkerData = Array.isArray(pb.biomarkers) ? pb.biomarkers[0] : pb.biomarkers;
        
        if (biomarkerData) {
          const key = pb.biomarker_id;
          const existing = latestBiomarkers.get(key);
          
          if (!existing || new Date(pb.date) > new Date(existing.date)) {
            latestBiomarkers.set(key, {
              id: pb.id,
              patient_id: pb.patient_id,
              biomarker_id: pb.biomarker_id,
              value: pb.value,
              date: pb.date,
              biomarker: biomarkerData as BiomarkerRow
            });
          }
        }
      });

      // Convert to Biomarker format with status evaluation
      const biomarkers: Biomarker[] = Array.from(latestBiomarkers.values()).map((pb) => {
        const evaluation = evaluateBiomarkerStatus(pb.value, pb.biomarker);
        const valueWithUnit = formatBiomarkerValue(pb.value, pb.biomarker.unit);
        const collectedAgo = formatDistanceToNow(new Date(pb.date), { 
          addSuffix: false,
          locale: es 
        });

        return {
          name: pb.biomarker.name,
          valueWithUnit,
          status: evaluation.status,
          collectedAgo,
          rawValue: pb.value,
          unit: pb.biomarker.unit,
          biomarkerData: pb.biomarker,
          collectedAt: pb.date
        };
      });

      console.log(`Processed ${biomarkers.length} biomarkers`);
      return biomarkers;
    },
    enabled: !!patientId
  });
};

