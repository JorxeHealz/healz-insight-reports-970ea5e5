
import React from 'react';
import { FormQuestion } from '../../../types/forms';
import { Label } from '../../ui/label';

interface BaseQuestionProps {
  question: FormQuestion;
  error?: string;
  children: React.ReactNode;
}

export const BaseQuestion = ({ question, error, children }: BaseQuestionProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-healz-brown font-medium text-left block">
        {question.question_text}
        {question.required && <span className="text-healz-red ml-1">*</span>}
      </Label>
      
      {children}
      
      {error && <p className="text-healz-red text-sm">{error}</p>}
    </div>
  );
};
