
import React from 'react';
import { BaseQuestionComponentProps } from './types';
import { BaseQuestion } from './BaseQuestion';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';

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
        const currentFile = files?.[question.id];
        return (
          <div className="space-y-3">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (onFileChange) {
                  onFileChange(question.id, file);
                }
              }}
              className="cursor-pointer"
            />
            
            <div className="text-xs text-healz-brown/70">
              Formatos permitidos: PDF, JPEG, PNG (máximo 10MB)
            </div>
            
            {currentFile && (
              <div className="flex items-center justify-between p-3 bg-healz-cream/30 rounded-md border">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-healz-green">
                    ✓ Archivo seleccionado
                  </span>
                  <span className="text-xs text-healz-brown/70">
                    {currentFile.name} ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (onFileChange) {
                      onFileChange(question.id, null);
                    }
                  }}
                  className="text-healz-red hover:text-healz-red/80"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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
