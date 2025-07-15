
import React from 'react';
import { MainDiagnosisCard } from './diagnosis/MainDiagnosisCard';
import { ClinicalEvaluationsSection } from './diagnosis/ClinicalEvaluationsSection';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';
import { useReportClinicalNotes } from '../../hooks/useReportClinicalNotes';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

interface Report {
  id: string;
  form_id?: string;
  diagnosis?: any;
  personalized_insights?: any;
  critical_biomarkers?: any[];
  vitality_score?: number;
  average_risk?: number;
  diagnosis_date?: string;
  created_at?: string;
}

interface ClinicalNotesStructuredProps {
  report: Report;
}

export const ClinicalNotesStructured: React.FC<ClinicalNotesStructuredProps> = ({ report }) => {
  const { deleteClinicalNote } = useClinicalNotes(report.id);
  
  // Usar el nuevo hook específico para obtener las notas clínicas
  const { data: clinicalNotes = [], isLoading } = useReportClinicalNotes(report.form_id);
  
  // Fetch biomarkers para este reporte
  const { data: reportBiomarkers } = useReportBiomarkers(report.id);

  // Debugging del diagnóstico
  console.log('🔍 DEBUG ClinicalNotesStructured - report.diagnosis:', report.diagnosis);
  console.log('🔍 DEBUG ClinicalNotesStructured - typeof report.diagnosis:', typeof report.diagnosis);
  
  // Extraer información principal del diagnóstico
  const mainDiagnosis = typeof report.diagnosis === 'string' ? report.diagnosis : 
                       typeof report.diagnosis?.summary === 'string' ? report.diagnosis.summary : 
                       'No se ha generado un diagnóstico para este reporte.';
                       
  console.log('🔍 DEBUG ClinicalNotesStructured - mainDiagnosis resultado:', mainDiagnosis);
  
  const personalizedInsights = report.personalized_insights || {};
  const criticalBiomarkers = Array.isArray(report.critical_biomarkers) ? report.critical_biomarkers : [];
  const vitalityScore = report.vitality_score || 0;
  const riskScore = report.average_risk || 0;
  const diagnosisDate = report.diagnosis_date ? new Date(report.diagnosis_date).toLocaleDateString('es-ES') : 
                       new Date(report.created_at || '').toLocaleDateString('es-ES');

  // Paneles y biomarcadores disponibles
  const availablePanels = [
    'Salud Cardiovascular',
    'Función Tiroidea', 
    'Metabolismo',
    'Hormonas del Estrés',
    'Estado Nutricional',
    'Hormonas Sexuales',
    'Función Hepática',
    'Función Renal',
    'Perfil Hematológico',
    'Inflamación'
  ];
  
  const availableBiomarkers = (reportBiomarkers || []).map((biomarker: any) => ({
    id: biomarker.biomarkerData?.id || biomarker.name?.toLowerCase().replace(/\s+/g, '_'),
    name: biomarker.name
  }));

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteClinicalNote.mutateAsync(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-healz-cream/30 rounded-lg mb-6"></div>
          <div className="h-96 bg-healz-cream/30 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Diagnóstico Principal - Prominente */}
      <MainDiagnosisCard
        diagnosis={mainDiagnosis}
        diagnosisDate={diagnosisDate}
        vitalityScore={vitalityScore}
        riskScore={riskScore}
        personalizedInsights={personalizedInsights}
        criticalBiomarkers={criticalBiomarkers}
      />

      {/* Evaluaciones Clínicas Detalladas */}
      <ClinicalEvaluationsSection
        clinicalNotes={clinicalNotes}
        reportId={report.id}
        formId={report.form_id || 'default'}
        availablePanels={availablePanels}
        availableBiomarkers={availableBiomarkers}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
};
