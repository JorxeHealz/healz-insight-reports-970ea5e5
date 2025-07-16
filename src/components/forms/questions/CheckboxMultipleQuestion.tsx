
import React from 'react';
import { BaseQuestionComponentProps } from './types';
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
    <div className="space-y-3">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-healz-brown">
          {question.question_text}
          {question.required && <span className="text-healz-red ml-1">*</span>}
        </legend>
        
        <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
          {options.map((option) => (
            <div key={option} className="flex items-center gap-x-3 p-3 border border-healz-brown/20 rounded-lg hover:bg-healz-cream/50 transition-all duration-200 min-h-[44px]">
              <Checkbox
                id={`${question.id}-${option}`}
                checked={currentValue.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
              />
              <Label 
                htmlFor={`${question.id}-${option}`} 
                className="text-sm cursor-pointer text-healz-brown font-medium flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>
      
      {currentValue.length > 0 && (
        <div className="mt-3 p-3 bg-healz-cream/30 rounded-lg">
          <p className="text-sm text-healz-brown/70">
            Seleccionados: {currentValue.join(', ')}
          </p>
        </div>
      )}
      
      {error && <p className="text-healz-red text-sm mt-2">{error}</p>}
    </div>
  );
};
