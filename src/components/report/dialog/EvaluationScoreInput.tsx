
import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Star } from 'lucide-react';

interface EvaluationScoreInputProps {
  score: number;
  onScoreChange: (score: number) => void;
}

export const EvaluationScoreInput: React.FC<EvaluationScoreInputProps> = ({
  score,
  onScoreChange
}) => {
  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Crítico';
    if (score <= 5) return 'Requiere atención';
    if (score <= 7) return 'Aceptable';
    return 'Excelente';
  };

  return (
    <div>
      <Label className="text-sm font-medium text-healz-brown">Puntuación (1-10)</Label>
      <div className="flex items-center gap-3 mt-1">
        <Input
          type="number"
          min="1"
          max="10"
          value={score}
          onChange={(e) => onScoreChange(parseInt(e.target.value))}
          className="w-20"
        />
        <div className="flex">
          {[...Array(10)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 cursor-pointer ${i < score ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
              onClick={() => onScoreChange(i + 1)}
            />
          ))}
        </div>
        <span className="text-sm text-healz-brown/70">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
};
