
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Pencil, Trash2, Star, Brain } from 'lucide-react';
import { EditClinicalNoteDialog } from './EditClinicalNoteDialog';

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

  const getCriticalityColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'bg-healz-red/20 text-healz-red border-healz-red/30';
      case 'high': return 'bg-healz-orange/20 text-healz-orange border-healz-orange/30';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange border-healz-yellow/30';
      case 'low': return 'bg-healz-green/20 text-healz-green border-healz-green/30';
      default: return 'bg-healz-green/20 text-healz-green border-healz-green/30';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
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

  const getTargetDisplay = (note: any) => {
    if (!note.target_id) return null;
    if (note.evaluation_type === 'panel') return `Panel: ${note.target_id}`;
    if (note.evaluation_type === 'biomarker') {
      const biomarker = availableBiomarkers.find(b => b.id === note.target_id);
      return `Biomarcador: ${biomarker?.name || note.target_id}`;
    }
    return note.target_id;
  };

  const getScoreInterpretation = (score?: number) => {
    if (!score) return null;
    if (score <= 3) return { label: 'Crítico', color: 'text-healz-red' };
    if (score <= 5) return { label: 'Requiere atención', color: 'text-healz-orange' };
    if (score <= 7) return { label: 'Aceptable', color: 'text-healz-yellow' };
    return { label: 'Excelente', color: 'text-healz-green' };
  };

  const scoreInterpretation = getScoreInterpretation(note.evaluation_score);

  return (
    <div className="bg-healz-cream/20 p-6 rounded-lg border border-healz-brown/10 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="font-medium text-healz-brown text-lg">{note.title}</h4>
          
          {note.is_auto_generated && (
            <Badge variant="outline" className="text-xs bg-healz-blue/10 text-healz-blue border-healz-blue/30">
              <Brain className="h-3 w-3 mr-1" />
              Auto-generado
            </Badge>
          )}

          {isEvaluation ? (
            <Badge 
              variant="outline" 
              className={`text-xs border ${getCriticalityColor(note.criticality_level)}`}
            >
              {getCriticalityLabel(note.criticality_level)} criticidad
            </Badge>
          ) : (
            <Badge 
              variant="outline" 
              className={`text-xs ${
                note.priority === 'high' ? 'bg-healz-red/20 text-healz-red border-healz-red/30' :
                note.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange border-healz-yellow/30' :
                'bg-healz-green/20 text-healz-green border-healz-green/30'
              }`}
            >
              {getPriorityLabel(note.priority)} prioridad
            </Badge>
          )}

          {note.evaluation_type && (
            <Badge variant="outline" className="text-xs bg-healz-cream/50 border-healz-brown/20">
              {note.evaluation_type === 'general' ? 'Evaluación General' :
               note.evaluation_type === 'panel' ? 'Panel' :
               'Biomarcador'}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowEditDialog(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(note.id)}
            className="h-8 w-8 p-0 text-healz-red hover:text-healz-red"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {note.evaluation_score && (
        <div className="mb-4 p-3 bg-white/50 rounded-lg border border-healz-brown/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-healz-brown">Puntuación de Evaluación:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-healz-brown">{note.evaluation_score}/10</span>
              {scoreInterpretation && (
                <span className={`text-sm font-medium ${scoreInterpretation.color}`}>
                  {scoreInterpretation.label}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < note.evaluation_score! ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      )}

      {getTargetDisplay(note) && (
        <div className="mb-4 p-3 bg-healz-blue/10 rounded-lg border border-healz-blue/20">
          <span className="text-sm text-healz-brown/80">
            🎯 <span className="font-medium">{getTargetDisplay(note)}</span>
          </span>
        </div>
      )}
      
      <div className="prose prose-sm max-w-none">
        <p className="text-sm text-healz-brown/90 leading-relaxed whitespace-pre-wrap">
          {note.content}
        </p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-healz-brown/10">
        <div className="text-xs text-healz-brown/60 flex items-center justify-between">
          <span>{note.author} • {note.date}</span>
          {note.category !== 'general' && (
            <Badge variant="outline" className="text-xs">
              {note.category}
            </Badge>
          )}
        </div>
      </div>

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
