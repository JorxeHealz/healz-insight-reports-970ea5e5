
import React from 'react';
import { FormQuestion } from '../../../types/forms';
import { RadioQuestion } from '../questions/RadioQuestion';
import { CheckboxMultipleQuestion } from '../questions/CheckboxMultipleQuestion';
import { ScaleQuestion } from '../questions/ScaleQuestion';
import { FrequencyQuestion } from '../questions/FrequencyQuestion';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';

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
  
  switch (question.question_type) {
    case 'radio':
      return (
        <RadioQuestion
          question={question}
          value={value || ''}
          onChange={(val) => onAnswerChange(question.id, val)}
        />
      );

    case 'checkbox_multiple':
      return (
        <CheckboxMultipleQuestion
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={(val) => onAnswerChange(question.id, val)}
        />
      );

    case 'scale':
      return (
        <ScaleQuestion
          question={question}
          value={typeof value === 'number' ? value : 0}
          onChange={(val) => onAnswerChange(question.id, val)}
        />
      );

    case 'frequency':
      return (
        <FrequencyQuestion
          question={question}
          value={value || ''}
          onChange={(val) => onAnswerChange(question.id, val)}
        />
      );

    case 'text':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <Input
            value={value || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="Escriba su respuesta..."
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onAnswerChange(question.id, Number(e.target.value))}
            placeholder="Ingrese un número..."
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <Textarea
            value={value || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="Escriba su respuesta detallada..."
            rows={4}
          />
        </div>
      );

    case 'select':
      const selectOptions = Array.isArray(question.options) ? question.options : [];
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <Select value={value || ''} onValueChange={(val) => onAnswerChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una opción..." />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'boolean':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value === true}
              onCheckedChange={(checked) => onAnswerChange(question.id, checked)}
            />
            <span>Sí</span>
          </div>
        </div>
      );

    case 'file':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onFileChange(question.id, file);
            }}
          />
          {files[question.id] && (
            <p className="text-sm text-healz-green">
              Archivo seleccionado: {files[question.id].name}
            </p>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-healz-brown">
            {question.question_text}
            {question.required && <span className="text-healz-red ml-1">*</span>}
          </label>
          <Input 
            value={value || ''} 
            onChange={(e) => onAnswerChange(question.id, e.target.value)} 
          />
        </div>
      );
  }
};
