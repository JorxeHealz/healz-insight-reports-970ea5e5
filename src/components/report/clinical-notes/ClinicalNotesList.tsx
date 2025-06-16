
import React from 'react';
import { Badge } from '../../ui/badge';
import { FileText, Brain, Package, Activity } from 'lucide-react';
import { ClinicalNote } from './types';

interface ClinicalNotesListProps {
  notes: ClinicalNote[];
  selectedNoteId: string;
  onNoteSelect: (noteId: string) => void;
}

export const ClinicalNotesList: React.FC<ClinicalNotesListProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect
}) => {
  const getEntryIcon = (note: ClinicalNote) => {
    if (!note.evaluation_type) return <FileText className="h-4 w-4 text-healz-brown" />;
    switch (note.evaluation_type) {
      case 'general': return <Brain className="h-4 w-4 text-healz-blue" />;
      case 'panel': return <Package className="h-4 w-4 text-healz-orange" />;
      case 'biomarker': return <Activity className="h-4 w-4 text-healz-green" />;
      default: return <FileText className="h-4 w-4 text-healz-brown" />;
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

  const getTargetDisplay = (note: ClinicalNote) => {
    if (!note.target_id) return null;
    if (note.evaluation_type === 'panel') return `Panel: ${note.target_id}`;
    if (note.evaluation_type === 'biomarker') return `Biomarcador: ${note.target_id}`;
    return note.target_id;
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

  if (notes.length === 0) {
    return (
      <div className="p-4 text-center text-healz-brown/60">
        <p className="text-sm">No hay evaluaciones para este filtro</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onNoteSelect(note.id)}
          className={`w-full p-3 text-left border-b border-healz-brown/10 hover:bg-healz-cream/20 transition-colors ${
            selectedNoteId === note.id ? 'bg-healz-cream/30 border-l-4 border-l-healz-orange' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              {getEntryIcon(note)}
              <span className="text-xs text-healz-brown/70">{note.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs h-4 px-1">
                {getEntryTypeLabel(note)}
              </Badge>
            </div>
          </div>
          <p className="text-sm font-medium text-healz-brown mb-1">{note.title}</p>
          
          {note.evaluation_type && (
            <div className="space-y-1">
              {note.evaluation_score && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-healz-brown/60">Puntuación:</span>
                  <span className="text-xs font-medium text-healz-orange">{note.evaluation_score}/10</span>
                </div>
              )}
              <Badge className={`text-xs h-4 px-1 ${getCriticalityColor(note.criticality_level || 'medium')}`}>
                {getCriticalityLabel(note.criticality_level)}
              </Badge>
            </div>
          )}
          
          {getTargetDisplay(note) && (
            <p className="text-xs text-healz-brown/60 mt-1">🎯 {getTargetDisplay(note)}</p>
          )}
          <p className="text-xs text-healz-brown/60 mt-1">{note.author}</p>
        </button>
      ))}
    </div>
  );
};
