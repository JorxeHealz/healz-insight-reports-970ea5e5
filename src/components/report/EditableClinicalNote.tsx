
import React, { useState } from 'react';
import { EditClinicalNoteDialog } from './EditClinicalNoteDialog';
import { NoteHeader } from './note/NoteHeader';
import { EvaluationScore } from './note/EvaluationScore';
import { TargetDisplay } from './note/TargetDisplay';
import { NoteFooter } from './note/NoteFooter';

type EditableClinicalNoteProps = {
  note: {
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
    technical_details?: string;
    patient_friendly_content?: string;
    warning_signs?: string;
    action_steps?: string;
    expected_timeline?: string;
  };
  reportId: string;
  onDelete: (id: string) => void;
  isEvaluation?: boolean;
  availablePanels?: string[];
  availableBiomarkers?: { id: string; name: string }[];
  showTechnicalView?: boolean;
};

export const EditableClinicalNote: React.FC<EditableClinicalNoteProps> = ({
  note,
  reportId,
  onDelete,
  isEvaluation = false,
  availablePanels = [],
  availableBiomarkers = [],
  showTechnicalView = false
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="bg-healz-cream/20 p-6 rounded-lg border border-healz-brown/10 group">
      <NoteHeader
        note={note}
        isEvaluation={isEvaluation}
        availableBiomarkers={availableBiomarkers}
        onEdit={() => setShowEditDialog(true)}
        onDelete={() => onDelete(note.id)}
      />

      {note.evaluation_score && (
        <EvaluationScore score={note.evaluation_score} />
      )}

      <TargetDisplay note={note} availableBiomarkers={availableBiomarkers} />
      
      <div className="prose prose-sm max-w-none space-y-4">
        {/* Main content - use patient-friendly version if available and not in technical view */}
        <div>
          <p className="text-sm text-healz-brown/90 leading-relaxed whitespace-pre-wrap">
            {!showTechnicalView && note.patient_friendly_content ? 
              note.patient_friendly_content : 
              note.content
            }
          </p>
        </div>

        {/* Technical details - only show in technical view */}
        {showTechnicalView && note.technical_details && (
          <div className="bg-healz-cream/40 p-3 rounded border-l-4 border-l-healz-blue">
            <h5 className="text-xs font-semibold text-healz-brown/80 mb-2">Detalles Técnicos:</h5>
            <p className="text-xs text-healz-brown/80 leading-relaxed whitespace-pre-wrap">
              {note.technical_details}
            </p>
          </div>
        )}

        {/* Warning signs */}
        {note.warning_signs && (
          <div className="bg-healz-red/10 p-3 rounded border-l-4 border-l-healz-red">
            <h5 className="text-xs font-semibold text-healz-red mb-2">⚠️ Señales de Alerta:</h5>
            <p className="text-xs text-healz-brown/80 leading-relaxed whitespace-pre-wrap">
              {note.warning_signs}
            </p>
          </div>
        )}

        {/* Action steps */}
        {note.action_steps && (
          <div className="bg-healz-green/10 p-3 rounded border-l-4 border-l-healz-green">
            <h5 className="text-xs font-semibold text-healz-green mb-2">📋 Pasos a Seguir:</h5>
            <p className="text-xs text-healz-brown/80 leading-relaxed whitespace-pre-wrap">
              {note.action_steps}
            </p>
          </div>
        )}

        {/* Expected timeline */}
        {note.expected_timeline && (
          <div className="bg-healz-orange/10 p-3 rounded border-l-4 border-l-healz-orange">
            <h5 className="text-xs font-semibold text-healz-orange mb-2">⏱️ Cronograma Esperado:</h5>
            <p className="text-xs text-healz-brown/80 leading-relaxed whitespace-pre-wrap">
              {note.expected_timeline}
            </p>
          </div>
        )}
      </div>
      
      <NoteFooter note={note} />

      <EditClinicalNoteDialog
        note={note}
        reportId={reportId}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        isEvaluation={isEvaluation}
        availablePanels={availablePanels}
        availableBiomarkers={availableBiomarkers}
      />
    </div>
  );
};
