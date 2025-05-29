
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { BaseQuestion } from './BaseQuestion';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';

export const FrequencyQuestion = ({ question, value, onChange, error }: BaseQuestionComponentProps<string>) => {
  const options = Array.isArray(question.options) ? question.options : [];

  const getFrequencyColor = (option: string, isSelected: boolean) => {
    if (!isSelected) return 'text-healz-brown/60';
    
    switch (option) {
      case 'Nunca': return 'text-healz-green';
      case 'Rara vez': return 'text-healz-blue';
      case 'A veces': return 'text-healz-yellow';
      case 'Frecuentemente': return 'text-healz-orange';
      case 'Siempre': return 'text-healz-red';
      default: return 'text-healz-brown';
    }
  };

  return (
    <BaseQuestion question={question} error={error}>
      <RadioGroup value={value || ''} onValueChange={onChange} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-healz-cream/20 transition-colors">
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label 
              htmlFor={`${question.id}-${option}`} 
              className={`text-sm cursor-pointer ${getFrequencyColor(option, value === option)}`}
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </BaseQuestion>
  );
};
