
import React from 'react';
import { EvaluationsManager } from './evaluations/EvaluationsManager';
import { PanelInfo } from './evaluations/types';

type ReportEvaluationsProps = {
  report: any;
};

// Panel definitions based on the biomarker categories
const AVAILABLE_PANELS: PanelInfo[] = [
  { name: 'Heart', biomarkers: ['LDL-C', 'HDL-C', 'Triglycerides', 'ApoB', 'hs-CRP'], description: 'Salud cardiovascular' },
  { name: 'Thyroid', biomarkers: ['TSH', 'Free T4', 'Free T3', 'rT3', 'Anti-TPO'], description: 'Función tiroidea' },
  { name: 'Metabolic', biomarkers: ['Fasting Glucose', 'HbA1c', 'Insulin'], description: 'Metabolismo y glucosa' },
  { name: 'Stress & Aging', biomarkers: ['Cortisol AM', 'Cortisol PM', 'DHEA-S'], description: 'Estrés y envejecimiento' },
  { name: 'Nutrients', biomarkers: ['Vitamin D', 'B12', 'Folate', 'Ferritin'], description: 'Estado nutricional' },
  { name: 'Male Health', biomarkers: ['Total Testosterone', 'Free Testosterone', 'SHBG'], description: 'Salud hormonal masculina' },
  { name: 'Liver', biomarkers: ['ALT', 'AST', 'ALP', 'GGT', 'Bilirubin'], description: 'Función hepática' },
  { name: 'Kidney', biomarkers: ['Creatinine', 'eGFR', 'BUN'], description: 'Función renal' },
  { name: 'Blood', biomarkers: ['RBC', 'WBC', 'Hemoglobin', 'Platelets'], description: 'Hemograma completo' },
  { name: 'Immune Regulation', biomarkers: ['IgG subclasses', 'CD4/CD8 ratio'], description: 'Sistema inmune' },
  { name: 'Cancer Detection', biomarkers: ['AFP', 'CEA', 'PSA', 'CA-125'], description: 'Marcadores tumorales' },
  { name: 'Heavy Metals', biomarkers: ['Lead', 'Mercury'], description: 'Metales pesados' },
  { name: 'Environmental Toxins', biomarkers: ['BPA', 'Phthalates'], description: 'Toxinas ambientales' }
];

export const ReportEvaluations: React.FC<ReportEvaluationsProps> = ({ report }) => {
  // Extract available biomarkers from the report
  const availableBiomarkers = report.recentBiomarkers?.map((biomarker: any) => ({
    id: biomarker.biomarkerData?.id || biomarker.name,
    name: biomarker.name
  })) || [];

  return (
    <EvaluationsManager
      reportId={report.id}
      formId={report.form_id}
      availablePanels={AVAILABLE_PANELS}
      availableBiomarkers={availableBiomarkers}
    />
  );
};
