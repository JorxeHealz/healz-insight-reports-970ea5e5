
import React from 'react';
import { FormQuestion } from '../../../types/forms';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';

interface FrequencyQuestionProps {
  question: FormQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FrequencyQuestion = ({ question, value, onChange, error }: FrequencyQuestionProps) => {
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
    <div className="space-y-3">
      <Label className="text-healz-brown font-medium">
        {question.question_text}
        {question.required && <span className="text-healz-red ml-1">*</span>}
      </Label>
      
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
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
      
      {error && <p className="text-healz-red text-sm">{error}</p>}
    </div>
  );
};
