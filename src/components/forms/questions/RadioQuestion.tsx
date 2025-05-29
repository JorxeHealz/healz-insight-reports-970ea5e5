
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { BaseQuestion } from './BaseQuestion';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';

export const RadioQuestion = ({ question, value, onChange, error }: BaseQuestionComponentProps<string>) => {
  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <BaseQuestion question={question} error={error}>
      <RadioGroup value={value || ''} onValueChange={onChange} className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-healz-cream/20 transition-colors">
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label 
              htmlFor={`${question.id}-${option}`} 
              className="text-sm cursor-pointer text-healz-brown"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </BaseQuestion>
  );
};
