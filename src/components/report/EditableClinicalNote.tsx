
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
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
  };
  reportId: string;
  onDelete: (id: string) => void;
};

export const EditableClinicalNote: React.FC<EditableClinicalNoteProps> = ({
  note,
  reportId,
  onDelete
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="bg-healz-cream/20 p-4 rounded-lg border border-healz-brown/10 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-healz-brown text-sm">{note.title}</h4>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              note.priority === 'high' ? 'bg-healz-red/20 text-healz-red' :
              note.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange' :
              'bg-healz-green/20 text-healz-green'
            }`}
          >
            {note.priority === 'high' ? 'Alta' : 
             note.priority === 'medium' ? 'Media' : 'Baja'} prioridad
          </Badge>
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
      
      <p className="text-sm text-healz-brown/80 leading-relaxed mb-2">
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
      />
    </div>
  );
};
