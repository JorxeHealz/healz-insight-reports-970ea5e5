
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

  // Función para obtener el color basado en el valor
  const getValueColor = (val: number) => {
    const range = options.max - options.min;
    const normalizedValue = (val - options.min) / range;
    
    if (normalizedValue <= 0.3) {
      return 'bg-healz-red text-white';
    } else if (normalizedValue <= 0.7) {
      return 'bg-healz-yellow text-healz-brown';
    } else {
      return 'bg-healz-green text-white';
    }
  };

  // Crear gradiente para el slider
  const getSliderGradient = () => {
    return {
      background: `linear-gradient(to right, 
        #CD4631 0%, 
        #CD4631 30%, 
        #ECBD4F 30%, 
        #ECBD4F 70%, 
        #86A676 70%, 
        #86A676 100%)`
    };
  };

  return (
    <BaseQuestion question={question} error={error}>
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-healz-brown/70">
          <span>{options.min}</span>
          <span className="font-medium">{options.label}</span>
          <span>{options.max}</span>
        </div>
        
        <div className="relative">
          <Slider
            value={[currentValue]}
            onValueChange={handleValueChange}
            min={options.min}
            max={options.max}
            step={1}
            className="w-full"
            style={getSliderGradient()}
          />
        </div>
        
        <div className="text-center">
          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getValueColor(currentValue)}`}>
            {currentValue}
          </span>
        </div>
      </div>
    </BaseQuestion>
  );
};
