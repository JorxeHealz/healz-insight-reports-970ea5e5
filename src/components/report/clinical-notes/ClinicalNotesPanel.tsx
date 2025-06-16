
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Calendar, User, Brain, Plus } from 'lucide-react';
import { EditableClinicalNote } from '../EditableClinicalNote';
import { ClinicalNote } from './types';

interface ClinicalNotesPanelProps {
  selectedNote: ClinicalNote | null;
  reportId: string;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  availablePanels: string[];
  availableBiomarkers: { id: string; name: string }[];
}

export const ClinicalNotesPanel: React.FC<ClinicalNotesPanelProps> = ({
  selectedNote,
  reportId,
  onDelete,
  onAddClick,
  availablePanels,
  availableBiomarkers
}) => {
  const getEntryIcon = (note: ClinicalNote) => {
    if (!note.evaluation_type) return null;
    switch (note.evaluation_type) {
      case 'general': return <Brain className="h-4 w-4 text-healz-blue" />;
      default: return null;
    }
  };

  const getEntryTypeLabel = (note: ClinicalNote) => {
    if (!note.evaluation_type) return 'Nota';
    switch (note.evaluation_type) {
      case 'general': return 'Eval. General';
      case 'panel': return 'Eval. Panel';
      case 'biomarker': return 'Eval. Biomarcador';
      default: return 'Nota';
    }
  };

  const getCriticalityColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'bg-healz-red/20 text-healz-red border-healz-red/30';
      case 'high': return 'bg-healz-orange/20 text-healz-orange border-healz-orange/30';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange border-healz-yellow/30';
      case 'low': return 'bg-healz-green/20 text-healz-green border-healz-green/30';
      default: return 'bg-healz-cream/20 text-healz-brown border-healz-cream/30';
    }
  };

  const getCriticalityLabel = (level?: string) => {
    switch (level) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  };

  const getTargetDisplay = (note: ClinicalNote) => {
    if (!note.target_id) return null;
    if (note.evaluation_type === 'panel') return `Panel: ${note.target_id}`;
    if (note.evaluation_type === 'biomarker') return `Biomarcador: ${note.target_id}`;
    return note.target_id;
  };

  if (!selectedNote) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Brain className="h-12 w-12 text-healz-brown/40 mx-auto mb-4" />
          <p className="text-healz-brown/60 mb-4">No hay evaluaciones disponibles</p>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primera Evaluación
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-healz-brown/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getEntryIcon(selectedNote)}
              <CardTitle className="text-lg">{selectedNote.title}</CardTitle>
              <Badge variant="outline">
                {getEntryTypeLabel(selectedNote)}
              </Badge>
              {selectedNote.evaluation_type && (
                <Badge className={`${getCriticalityColor(selectedNote.criticality_level || 'medium')}`}>
                  {getCriticalityLabel(selectedNote.criticality_level)}
                </Badge>
              )}
              {selectedNote.is_auto_generated && (
                <Badge variant="outline" className="text-xs bg-healz-blue/10 text-healz-blue">
                  Auto-generado
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-healz-brown/70">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {selectedNote.date}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {selectedNote.author}
              </div>
              {selectedNote.evaluation_score && (
                <div className="flex items-center gap-1">
                  <span>Puntuación: {selectedNote.evaluation_score}/10</span>
                </div>
              )}
              {getTargetDisplay(selectedNote) && (
                <div className="flex items-center gap-1">
                  <span>🎯 {getTargetDisplay(selectedNote)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 overflow-y-auto">
        <EditableClinicalNote
          note={selectedNote}
          reportId={reportId}
          onDelete={onDelete}
          isEvaluation={!!selectedNote.evaluation_type}
          availablePanels={availablePanels}
          availableBiomarkers={availableBiomarkers}
        />
      </CardContent>
    </Card>
  );
};
