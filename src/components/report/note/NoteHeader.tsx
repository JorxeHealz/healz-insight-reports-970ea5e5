
import React from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Pencil, Trash2, Brain } from 'lucide-react';

interface NoteHeaderProps {
  note: {
    id: string;
    title: string;
    priority: string;
    evaluation_type?: string;
    target_id?: string;
    criticality_level?: string;
    is_auto_generated?: boolean;
  };
  isEvaluation: boolean;
  availableBiomarkers: { id: string; name: string }[];
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteHeader: React.FC<NoteHeaderProps> = ({
  note,
  isEvaluation,
  availableBiomarkers,
  onEdit,
  onDelete
}) => {
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

  return (
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
          onClick={onEdit}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-healz-red hover:text-healz-red"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
