
export type EvaluationType = 'general' | 'panel' | 'biomarker';

export interface AddClinicalNoteFormData {
  title: string;
  content: string;
  category: string;
  priority: string;
  entryType: 'note' | 'evaluation';
  evaluationType: EvaluationType;
  targetId: string;
  evaluationScore: number;
  criticalityLevel: string;
}

export interface AddClinicalNoteDialogProps {
  reportId: string;
  formId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePanels?: string[];
  availableBiomarkers?: { id: string; name: string }[];
}
