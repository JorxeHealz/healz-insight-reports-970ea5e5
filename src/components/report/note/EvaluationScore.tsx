
import React from 'react';
import { Star } from 'lucide-react';

interface EvaluationScoreProps {
  score: number;
}

export const EvaluationScore: React.FC<EvaluationScoreProps> = ({ score }) => {
  const getScoreInterpretation = (score: number) => {
    if (score <= 3) return { label: 'Crítico', color: 'text-healz-red' };
    if (score <= 5) return { label: 'Requiere atención', color: 'text-healz-orange' };
    if (score <= 7) return { label: 'Aceptable', color: 'text-healz-yellow' };
    return { label: 'Excelente', color: 'text-healz-green' };
  };

  const scoreInterpretation = getScoreInterpretation(score);

  return (
    <div className="mb-4 p-3 bg-white/50 rounded-lg border border-healz-brown/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-healz-brown">Puntuación de Evaluación:</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-healz-brown">{score}/10</span>
          <span className={`text-sm font-medium ${scoreInterpretation.color}`}>
            {scoreInterpretation.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < score ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};
