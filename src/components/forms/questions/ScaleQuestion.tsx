
import React from 'react';
import { FormQuestion, ScaleOptions } from '../../../types/forms';
import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';

interface ScaleQuestionProps {
  question: FormQuestion;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export const ScaleQuestion = ({ question, value, onChange, error }: ScaleQuestionProps) => {
  const options = question.options as ScaleOptions;
  
  if (!options || typeof options !== 'object' || !('min' in options) || !('max' in options)) {
    return null;
  }

  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-4">
      <Label className="text-healz-brown font-medium">
        {question.question_text}
        {question.required && <span className="text-healz-red ml-1">*</span>}
      </Label>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-healz-brown/70">
          <span>{options.min}</span>
          <span className="font-medium">{options.label}</span>
          <span>{options.max}</span>
        </div>
        
        <Slider
          value={[value || options.min]}
          onValueChange={handleValueChange}
          min={options.min}
          max={options.max}
          step={1}
          className="w-full"
        />
        
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-healz-teal text-white rounded-full font-bold text-lg">
            {value || options.min}
          </span>
        </div>
      </div>
      
      {error && <p className="text-healz-red text-sm">{error}</p>}
    </div>
  );
};
