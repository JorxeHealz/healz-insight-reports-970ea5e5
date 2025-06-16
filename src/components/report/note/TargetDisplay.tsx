
import React from 'react';

interface TargetDisplayProps {
  note: {
    target_id?: string;
    evaluation_type?: string;
  };
  availableBiomarkers: { id: string; name: string }[];
}

export const TargetDisplay: React.FC<TargetDisplayProps> = ({ note, availableBiomarkers }) => {
  const getTargetDisplay = () => {
    if (!note.target_id) return null;
    if (note.evaluation_type === 'panel') return `Panel: ${note.target_id}`;
    if (note.evaluation_type === 'biomarker') {
      const biomarker = availableBiomarkers.find(b => b.id === note.target_id);
      return `Biomarcador: ${biomarker?.name || note.target_id}`;
    }
    return note.target_id;
  };

  const targetDisplay = getTargetDisplay();

  if (!targetDisplay) return null;

  return (
    <div className="mb-4 p-3 bg-healz-blue/10 rounded-lg border border-healz-blue/20">
      <span className="text-sm text-healz-brown/80">
        🎯 <span className="font-medium">{targetDisplay}</span>
      </span>
    </div>
  );
};
