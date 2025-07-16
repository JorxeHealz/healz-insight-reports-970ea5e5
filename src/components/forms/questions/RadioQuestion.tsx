
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';

export const RadioQuestion = ({ question, value, onChange, error }: BaseQuestionComponentProps<string>) => {
  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <div className="space-y-3">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-healz-brown">
          {question.question_text}
          {question.required && <span className="text-healz-red ml-1">*</span>}
        </legend>
        
        <RadioGroup value={value || ''} onValueChange={onChange} className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
          {options.map((option) => (
            <div key={option} className="flex items-center gap-x-3 p-3 border border-healz-brown/20 rounded-lg hover:bg-healz-cream/50 transition-all duration-200 min-h-[44px]">
              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
              <Label 
                htmlFor={`${question.id}-${option}`} 
                className="text-sm cursor-pointer text-healz-brown font-medium flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>
      
      {error && <p className="text-healz-red text-sm mt-2">{error}</p>}
    </div>
  );
};
