
import { useEffect } from 'react';
import { EvaluationType } from './types';

export const useTitleSuggestions = (
  evaluationType: EvaluationType,
  targetId: string,
  availableBiomarkers: { id: string; name: string }[],
  currentTitle: string,
  onTitleChange: (title: string) => void
) => {
  useEffect(() => {
    const getTitleSuggestion = () => {
      switch (evaluationType) {
        case 'general':
          return 'Evaluación General del Estado de Salud';
        case 'panel':
          return targetId ? `Evaluación Panel ${targetId}` : 'Evaluación de Panel Específico';
        case 'biomarker':
          const biomarker = availableBiomarkers.find(b => b.id === targetId);
          return biomarker ? `Evaluación ${biomarker.name}` : 'Evaluación de Biomarcador Específico';
        default:
          return '';
      }
    };

    const suggestion = getTitleSuggestion();
    if (suggestion && !currentTitle) {
      onTitleChange(suggestion);
    }
  }, [evaluationType, targetId, availableBiomarkers, currentTitle, onTitleChange]);
};
