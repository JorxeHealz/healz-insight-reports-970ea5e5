
export type FilterType = 'all' | 'notes' | 'evaluations' | 'general' | 'panel' | 'biomarker';

export interface ClinicalNote {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  author: string;
  date: string;
  evaluation_type?: string;
  target_id?: string;
  evaluation_score?: number;
  criticality_level?: string;
  is_auto_generated?: boolean;
}

export interface ClinicalNotesProps {
  report: any;
}
