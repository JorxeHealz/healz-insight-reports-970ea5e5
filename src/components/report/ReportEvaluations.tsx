
import React from 'react';
import { EvaluationsManager } from './evaluations/EvaluationsManager';
import { PanelInfo } from './evaluations/types';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

type ReportEvaluationsProps = {
  report: any;
};

// Panel definitions updated to match Spanish biomarker names in the database
const AVAILABLE_PANELS: PanelInfo[] = [
  { 
    name: 'Salud Cardiovascular', 
    biomarkers: ['Colesterol Total', 'Colesterol HDL', 'Colesterol LDL', 'Triglicéridos', 'Apolipoproteína B', 'Proteína C Reactiva'], 
    description: 'Perfil lipídico y riesgo cardiovascular' 
  },
  { 
    name: 'Función Tiroidea', 
    biomarkers: ['TSH', 'T4 Libre', 'T3 Libre', 'T3 Reversa', 'Anticuerpos Anti-TPO'], 
    description: 'Evaluación completa de la función tiroidea' 
  },
  { 
    name: 'Metabolismo', 
    biomarkers: ['Glucosa', 'Hemoglobina Glicosilada', 'Insulina', 'HOMA-IR'], 
    description: 'Control metabólico y resistencia a la insulina' 
  },
  { 
    name: 'Hormonas del Estrés', 
    biomarkers: ['Cortisol', 'DHEA-S', 'Cortisol Salival'], 
    description: 'Evaluación del eje adrenal y estrés' 
  },
  { 
    name: 'Estado Nutricional', 
    biomarkers: ['Vitamina D', 'Vitamina B12', 'Ácido Fólico', 'Ferritina', 'Hierro Sérico'], 
    description: 'Vitaminas y minerales esenciales' 
  },
  { 
    name: 'Hormonas Sexuales', 
    biomarkers: ['Testosterona Total', 'Testosterona Libre', 'Estradiol', 'Progesterona', 'SHBG'], 
    description: 'Perfil hormonal reproductivo' 
  },
  { 
    name: 'Función Hepática', 
    biomarkers: ['ALT', 'AST', 'Fosfatasa Alcalina', 'GGT', 'Bilirrubina Total'], 
    description: 'Evaluación de la función del hígado' 
  },
  { 
    name: 'Función Renal', 
    biomarkers: ['Creatinina', 'Urea', 'Filtrado Glomerular', 'Ácido Úrico'], 
    description: 'Evaluación de la función renal' 
  },
  { 
    name: 'Perfil Hematológico', 
    biomarkers: ['Hemoglobina', 'Hematocrito', 'Leucocitos', 'Plaquetas'], 
    description: 'Análisis del hemograma completo' 
  },
  { 
    name: 'Inflamación', 
    biomarkers: ['Proteína C Reactiva', 'VSG', 'Fibrinógeno'], 
    description: 'Marcadores de inflamación sistémica' 
  }
];

export const ReportEvaluations: React.FC<ReportEvaluationsProps> = ({ report }) => {
  // Fetch biomarkers directly using the hook for this report
  const { data: reportBiomarkers, isLoading, error } = useReportBiomarkers(report.id);

  console.log('ReportEvaluations - Report data:', {
    reportId: report.id,
    formId: report.form_id,
    recentBiomarkers: report.recentBiomarkers?.length || 0,
    fetchedBiomarkers: reportBiomarkers?.length || 0,
    isLoading,
    error: error?.message
  });

  // Extract available biomarkers from the fetched data or fallback to report data
  const biomarkersSource = reportBiomarkers || report.recentBiomarkers || [];
  
  const availableBiomarkers = biomarkersSource.map((biomarker: any) => ({
    id: biomarker.biomarkerData?.id || biomarker.name?.toLowerCase().replace(/\s+/g, '_'),
    name: biomarker.name
  }));

  console.log('ReportEvaluations - Available biomarkers:', availableBiomarkers);
  console.log('ReportEvaluations - Available panels:', AVAILABLE_PANELS.length);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
        <span className="ml-3 text-healz-brown">Cargando biomarcadores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-healz-red/10 text-healz-red p-4 rounded-md">
        <h3 className="font-medium mb-2">Error al cargar biomarcadores</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-healz-cream/30 p-4 rounded-lg border border-healz-brown/10">
        <h4 className="font-medium text-healz-brown mb-2">Información de Debug</h4>
        <div className="text-sm text-healz-brown/70 space-y-1">
          <p>Report ID: {report.id}</p>
          <p>Form ID: {report.form_id}</p>
          <p>Biomarcadores disponibles: {availableBiomarkers.length}</p>
          <p>Paneles disponibles: {AVAILABLE_PANELS.length}</p>
          <p>Nombres de biomarcadores: {availableBiomarkers.map(b => b.name).join(', ')}</p>
        </div>
      </div>

      <EvaluationsManager
        reportId={report.id}
        formId={report.form_id}
        availablePanels={AVAILABLE_PANELS}
        availableBiomarkers={availableBiomarkers}
      />
    </div>
  );
};
