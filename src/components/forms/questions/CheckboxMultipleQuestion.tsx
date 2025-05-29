
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { BaseQuestion } from './BaseQuestion';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

export const CheckboxMultipleQuestion = ({ question, value, onChange, error }: BaseQuestionComponentProps<string[]>) => {
  const options = Array.isArray(question.options) ? question.options : [];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValue, option]);
    } else {
      onChange(currentValue.filter(v => v !== option));
    }
  };

  const currentValue = Array.isArray(value) ? value : [];

  return (
    <BaseQuestion question={question} error={error}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-healz-cream/20 transition-colors">
            <Checkbox
              id={`${question.id}-${option}`}
              checked={currentValue.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
            />
            <Label 
              htmlFor={`${question.id}-${option}`} 
              className="text-sm cursor-pointer text-healz-brown"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
      
      {currentValue.length > 0 && (
        <div className="mt-2 p-2 bg-healz-cream/30 rounded-md">
          <p className="text-sm text-healz-brown/70">
            Seleccionados: {currentValue.join(', ')}
          </p>
        </div>
      )}
    </BaseQuestion>
  );
};
