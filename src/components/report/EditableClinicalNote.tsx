
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
  };
  reportId: string;
  onDelete: (id: string) => void;
  isEvaluation?: boolean;
  availablePanels?: string[];
  availableBiomarkers?: { id: string; name: string }[];
};

export const EditableClinicalNote: React.FC<EditableClinicalNoteProps> = ({
  note,
  reportId,
  onDelete,
  isEvaluation = false,
  availablePanels = [],
  availableBiomarkers = []
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
      
      <div className="prose prose-sm max-w-none">
        <p className="text-sm text-healz-brown/90 leading-relaxed whitespace-pre-wrap">
          {note.content}
        </p>
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
