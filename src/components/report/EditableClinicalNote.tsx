
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Pencil, Trash2, Star } from 'lucide-react';
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
      case 'critical': return 'bg-healz-red/20 text-healz-red';
      case 'high': return 'bg-healz-orange/20 text-healz-orange';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange';
      case 'low': return 'bg-healz-green/20 text-healz-green';
      default: return 'bg-healz-green/20 text-healz-green';
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

  return (
    <div className="bg-healz-cream/20 p-4 rounded-lg border border-healz-brown/10 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-healz-brown text-sm">{note.title}</h4>
          
          {isEvaluation ? (
            <Badge 
              variant="outline" 
              className={`text-xs ${getCriticalityColor(note.criticality_level)}`}
            >
              {getCriticalityLabel(note.criticality_level)} criticidad
            </Badge>
          ) : (
            <Badge 
              variant="outline" 
              className={`text-xs ${
                note.priority === 'high' ? 'bg-healz-red/20 text-healz-red' :
                note.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange' :
                'bg-healz-green/20 text-healz-green'
              }`}
            >
              {getPriorityLabel(note.priority)} prioridad
            </Badge>
          )}

          {note.evaluation_type && (
            <Badge variant="outline" className="text-xs">
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
            className="h-6 w-6 p-0"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(note.id)}
            className="h-6 w-6 p-0 text-healz-red hover:text-healz-red"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {note.evaluation_score && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-healz-brown">Puntuación:</span>
          <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < note.evaluation_score! ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm ml-1 text-healz-brown">{note.evaluation_score}/10</span>
          </div>
        </div>
      )}

      {note.target_id && (
        <div className="mb-3">
          <span className="text-sm text-healz-brown/70">
            🎯 Objetivo: <span className="font-medium">{note.target_id}</span>
          </span>
        </div>
      )}
      
      <p className="text-sm text-healz-brown/80 leading-relaxed mb-2 whitespace-pre-wrap">
        {note.content}
      </p>
      
      <div className="text-xs text-healz-brown/60">
        {note.author} • {note.date}
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
