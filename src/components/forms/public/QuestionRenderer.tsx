
import React from 'react';
import { FormQuestion } from '../../../types/forms';
import { 
  RadioQuestion,
  CheckboxMultipleQuestion,
  ScaleQuestion,
  FrequencyQuestion,
  BasicInputQuestion
} from '../questions';

interface QuestionRendererProps {
  question: FormQuestion;
  value: any;
  onAnswerChange: (questionId: string, value: any) => void;
  onFileChange: (questionId: string, file: File | null) => void;
  files: Record<string, File>;
}

export const QuestionRenderer = ({
  question,
  value,
  onAnswerChange,
  onFileChange,
  files
}: QuestionRendererProps) => {
  
  const handleChange = (newValue: any) => {
    onAnswerChange(question.id, newValue);
  };

  switch (question.question_type) {
    case 'radio':
      return (
        <RadioQuestion
          question={question}
          value={value || ''}
          onChange={handleChange}
        />
      );

    case 'checkbox_multiple':
      return (
        <CheckboxMultipleQuestion
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={handleChange}
        />
      );

    case 'scale':
      return (
        <ScaleQuestion
          question={question}
          value={typeof value === 'number' ? value : 0}
          onChange={handleChange}
        />
      );

    case 'frequency':
      return (
        <FrequencyQuestion
          question={question}
          value={value || ''}
          onChange={handleChange}
        />
      );

    case 'text':
    case 'number':
    case 'textarea':
    case 'select':
    case 'boolean':
    case 'file':
    default:
      return (
        <BasicInputQuestion
          question={question}
          value={value}
          onChange={handleChange}
          files={files}
          onFileChange={onFileChange}
        />
      );
  }
};
