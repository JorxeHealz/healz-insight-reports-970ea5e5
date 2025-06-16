
export type EvaluationType = 'summary' | 'general' | 'panel' | 'biomarker';
export type CriticalityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Evaluation {
  id: string;
  report_id: string;
  form_id: string;
  section_type: string;
  evaluation_type: EvaluationType;
  target_id?: string;
  title: string;
  content: string;
  evaluation_score?: number;
  recommendations?: any;
  is_auto_generated: boolean;
  criticality_level: CriticalityLevel;
  created_at: string;
  updated_at: string;
}

export interface PanelInfo {
  name: string;
  biomarkers: string[];
  description: string;
}

export interface BiomarkerInfo {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'caution' | 'outOfRange';
}
