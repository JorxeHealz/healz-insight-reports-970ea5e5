
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

  return (
    <BaseQuestion question={question} error={error}>
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-healz-brown/70">
          <span>{options.min}</span>
          <span className="font-medium">{options.label}</span>
          <span>{options.max}</span>
        </div>
        
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          min={options.min}
          max={options.max}
          step={1}
          className="w-full"
        />
        
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-healz-teal text-white rounded-full font-bold text-lg">
            {currentValue}
          </span>
        </div>
      </div>
    </BaseQuestion>
  );
};
