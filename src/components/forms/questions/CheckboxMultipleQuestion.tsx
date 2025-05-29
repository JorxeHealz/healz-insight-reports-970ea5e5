
import React from 'react';
import { FormQuestion } from '../../../types/forms';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

interface CheckboxMultipleQuestionProps {
  question: FormQuestion;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const CheckboxMultipleQuestion = ({ question, value, onChange, error }: CheckboxMultipleQuestionProps) => {
  const options = Array.isArray(question.options) ? question.options : [];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...value, option]);
    } else {
      onChange(value.filter(v => v !== option));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-healz-brown font-medium">
        {question.question_text}
        {question.required && <span className="text-healz-red ml-1">*</span>}
      </Label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-healz-cream/20 transition-colors">
            <Checkbox
              id={`${question.id}-${option}`}
              checked={value.includes(option)}
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
      
      {value.length > 0 && (
        <div className="mt-2 p-2 bg-healz-cream/30 rounded-md">
          <p className="text-sm text-healz-brown/70">
            Seleccionados: {value.join(', ')}
          </p>
        </div>
      )}
      
      {error && <p className="text-healz-red text-sm">{error}</p>}
    </div>
  );
};
