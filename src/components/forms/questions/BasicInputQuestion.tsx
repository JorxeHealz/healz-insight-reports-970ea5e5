
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { BaseQuestion } from './BaseQuestion';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';

interface BasicInputQuestionProps extends BaseQuestionComponentProps {
  files?: Record<string, File>;
  onFileChange?: (questionId: string, file: File | null) => void;
}

export const BasicInputQuestion = ({ 
  question, 
  value, 
  onChange, 
  error, 
  files, 
  onFileChange 
}: BasicInputQuestionProps) => {
  
  const renderInput = () => {
    switch (question.question_type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escriba su respuesta..."
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="Ingrese un número..."
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escriba su respuesta detallada..."
            rows={4}
          />
        );

      case 'select':
        const selectOptions = Array.isArray(question.options) ? question.options : [];
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una opción..." />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value === true}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <span>Sí</span>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (onFileChange) {
                  onFileChange(question.id, file);
                }
              }}
            />
            {files?.[question.id] && (
              <p className="text-sm text-healz-green">
                Archivo seleccionado: {files[question.id].name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <Input 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
          />
        );
    }
  };

  return (
    <BaseQuestion question={question} error={error}>
      {renderInput()}
    </BaseQuestion>
  );
};
