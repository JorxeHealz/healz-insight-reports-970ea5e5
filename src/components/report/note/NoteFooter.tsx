
import React from 'react';
import { Badge } from '../../ui/badge';

interface NoteFooterProps {
  note: {
    author: string;
    date: string;
    category: string;
  };
}

export const NoteFooter: React.FC<NoteFooterProps> = ({ note }) => {
  return (
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
  );
};
