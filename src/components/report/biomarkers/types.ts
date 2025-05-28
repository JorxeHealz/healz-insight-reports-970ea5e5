
import { Database } from '../../../types/supabase';

export interface Biomarker {
  name: string;
  valueWithUnit: string;
  status: 'optimal' | 'caution' | 'outOfRange';
  collectedAgo: string;
  // New fields for integration with Supabase
  rawValue: number | string;
  unit: string;
  biomarkerData?: Database['public']['Tables']['biomarkers']['Row'];
  collectedAt: string;
}

export interface BiomarkerInfoData {
  description: string;
  reference: string;
  importance: string;
  highLevels?: string;
  lowLevels?: string;
}

export interface PatientBiomarkerData {
  id: string;
  patient_id: string;
  biomarker_id: string;
  value: number;
  date: string;
  biomarker: Database['public']['Tables']['biomarkers']['Row'];
}
