
import { Database } from '../../../types/supabase';

export interface Biomarker {
  name: string;
  valueWithUnit: string;
  status: 'optimal' | 'caution' | 'outOfRange';
  collectedAgo: string;
  // Fix: Make rawValue consistently number since we parse it
  rawValue: number;
  unit: string;
  biomarkerData?: BiomarkerRow;
  collectedAt: string;
  notes?: string;
}

export interface BiomarkerInfoData {
  description: string;
  reference: string;
  importance: string;
  highLevels?: string;
  lowLevels?: string;
}

// Updated types to match the actual database structure
export interface BiomarkerRow {
  id: string;
  name: string;
  unit: string;
  description: string | null;
  category: string;
  panel: string | null;
  conventional_min: number;
  conventional_max: number;
  optimal_min: number;
  optimal_max: number;
  created_at: string;
  updated_at: string;
}

export interface PatientBiomarkerData {
  id: string;
  patient_id: string;
  biomarker_id: string;
  value: number;
  date: string;
  biomarker: BiomarkerRow;
}
