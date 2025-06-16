
import React from 'react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { AddClinicalNoteFormData, EvaluationType } from './types';

interface FormFieldsProps {
  formData: AddClinicalNoteFormData;
  onFormDataChange: (data: Partial<AddClinicalNoteFormData>) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  const getContentPlaceholder = () => {
    if (formData.entryType === 'note') return 'Contenido de la nota clínica...';
    
    switch (formData.evaluationType) {
      case 'general':
        return 'Evaluación general del estado de salud del paciente, considerando todos los parámetros analizados...';
      case 'panel':
        return 'Análisis específico del panel seleccionado, evaluación de biomarcadores relacionados y recomendaciones...';
      case 'biomarker':
        return 'Evaluación detallada del biomarcador específico, interpretación de valores y recomendaciones...';
      default:
        return 'Contenido de la evaluación...';
    }
  };

  return (
    <>
      <div>
        <Label className="text-sm font-medium text-healz-brown">Título</Label>
        <Input
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
          placeholder={formData.entryType === 'note' ? 'Título de la nota' : 'Título de la evaluación'}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-healz-brown">Categoría</Label>
          <Select value={formData.category} onValueChange={(category) => onFormDataChange({ category })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
              <SelectItem value="metabolic">Metabólico</SelectItem>
              <SelectItem value="hormonal">Hormonal</SelectItem>
              <SelectItem value="inflammatory">Inflamatorio</SelectItem>
              <SelectItem value="nutritional">Nutricional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-healz-brown">
            {formData.entryType === 'note' ? 'Prioridad' : 'Nivel de Criticidad'}
          </Label>
          <Select 
            value={formData.entryType === 'note' ? formData.priority : formData.criticalityLevel} 
            onValueChange={(value) => formData.entryType === 'note' 
              ? onFormDataChange({ priority: value }) 
              : onFormDataChange({ criticalityLevel: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              {formData.entryType === 'evaluation' && <SelectItem value="critical">Crítica</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-healz-brown">Contenido</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => onFormDataChange({ content: e.target.value })}
          rows={6}
          placeholder={getContentPlaceholder()}
        />
      </div>
    </>
  );
};
