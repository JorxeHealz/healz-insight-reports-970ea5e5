
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { BaseQuestion } from './BaseQuestion';
import { ScaleOptions } from '../../../types/forms';
import { Slider } from '../../ui/slider';

export const ScaleQuestion = ({ question, value, onChange, error }: BaseQuestionComponentProps<number>) => {
  const options = question.options as ScaleOptions;
  
  if (!options || typeof options !== 'object' || !('min' in options) || !('max' in options)) {
    return null;
  }

  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  const currentValue = typeof value === 'number' ? value : options.min;

  // Detect if this is a "negative" question (higher values = worse)
  const isNegativeQuestion = (questionText: string) => {
    const lowerText = questionText.toLowerCase();
    
    // First check for positive keywords that should override negative detection
    const positiveKeywords = [
      'calidad', 'quality',
      'satisfacción', 'satisfaccion', 'satisfaction',
      'bienestar', 'wellbeing', 'well-being',
      'energía', 'energia', 'energy',
      'motivación', 'motivacion', 'motivation',
      'ánimo', 'animo', 'mood' // when asking about good mood
    ];
    
    const hasPositiveKeyword = positiveKeywords.some(keyword => 
      lowerText.includes(keyword)
    );
    
    // If it has positive keywords, it's definitely a positive question
    if (hasPositiveKeyword) {
      return false;
    }
    
    // Check for negative keywords only if no positive keywords found
    const negativeKeywords = [
      'estrés', 'estres', 'stress',
      'dolor', 'pain',
      'fatiga', 'cansancio', 'tiredness',
      'ansiedad', 'anxiety',
      'irritación', 'irritacion', 'irritation',
      'molestia', 'discomfort',
      'malestar', 'unwell',
      'síntoma', 'sintoma', 'symptom',
      'preocupación', 'preocupacion', 'worry'
    ];
    
    return negativeKeywords.some(keyword => 
      lowerText.includes(keyword)
    );
  };

  // Function to get color based on value and question type
  const getValueColor = (val: number) => {
    const range = options.max - options.min;
    const normalizedValue = (val - options.min) / range;
    const isNegative = isNegativeQuestion(question.question_text);
    
    if (isNegative) {
      // For negative questions: low = good (green), high = bad (red)
      if (normalizedValue <= 0.3) {
        return 'bg-healz-green text-white';
      } else if (normalizedValue <= 0.7) {
        return 'bg-healz-yellow text-healz-brown';
      } else {
        return 'bg-healz-red text-white';
      }
    } else {
      // For positive questions: low = bad (red), high = good (green)
      if (normalizedValue <= 0.3) {
        return 'bg-healz-red text-white';
      } else if (normalizedValue <= 0.7) {
        return 'bg-healz-yellow text-healz-brown';
      } else {
        return 'bg-healz-green text-white';
      }
    }
  };

  return (
    <BaseQuestion question={question} error={error}>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-healz-brown/70">
          <span>{options.min}</span>
          <span className="font-medium">{options.label}</span>
          <span>{options.max}</span>
        </div>
        
        <div className="relative px-2">
          <Slider
            value={[currentValue]}
            onValueChange={handleValueChange}
            min={options.min}
            max={options.max}
            step={1}
            className="w-full scale-slider"
          />
        </div>
        
        <div className="text-center">
          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getValueColor(currentValue)}`}>
            {currentValue}
          </span>
        </div>
        
        <div className="text-xs text-healz-brown/60 text-center">
          Tu respuesta en la escala
        </div>
      </div>
    </BaseQuestion>
  );
};
