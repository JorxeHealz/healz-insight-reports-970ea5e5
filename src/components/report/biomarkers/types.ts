

import { Database } from '../../../types/supabase';

export interface Biomarker {
  name: string;
  valueWithUnit: string;
  status: 'optimal' | 'caution' | 'outOfRange';
  collectedAgo: string;
  rawValue: number;
  unit: string;
  biomarkerData?: BiomarkerRow;
  collectedAt: string;
}

export interface BiomarkerInfoData {
  description: string;
  reference: string;
  importance: string;
  highLevels?: string;
  lowLevels?: string;
}

// Updated types to match the actual database structure with category as TEXT[]
export interface BiomarkerRow {
  id: string;
  name: string;
  unit: string;
  description: string | null;
  category: string[]; // category now contains panel information
  conventional_min: number;
  conventional_max: number;
  optimal_min: number;
  optimal_max: number;
  created_at: string;
  updated_at: string;
}

// Simplified PatientBiomarkerData interface without removed columns
export interface PatientBiomarkerData {
  id: string;
  patient_id: string;
  biomarker_id: string;
  value: number;
  date: string;
  biomarker: BiomarkerRow;
}

