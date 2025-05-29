
import React from 'react';
import { FormQuestion } from '../../../types/forms';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';

interface RadioQuestionProps {
  question: FormQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RadioQuestion = ({ question, value, onChange, error }: RadioQuestionProps) => {
  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <div className="space-y-3">
      <Label className="text-healz-brown font-medium">
        {question.question_text}
        {question.required && <span className="text-healz-red ml-1">*</span>}
      </Label>
      
      <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
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
      
      {error && <p className="text-healz-red text-sm">{error}</p>}
    </div>
  );
};
