
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { Brain, Package, Activity } from 'lucide-react';
import { EvaluationType } from './types';

interface EvaluationTypeSelectorProps {
  value: EvaluationType;
  onChange: (value: EvaluationType) => void;
}

export const EvaluationTypeSelector: React.FC<EvaluationTypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <Label className="text-sm font-medium text-healz-brown">Tipo de Evaluación</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Evaluación General
            </div>
          </SelectItem>
          <SelectItem value="panel">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Evaluación por Panel
            </div>
          </SelectItem>
          <SelectItem value="biomarker">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Evaluación por Biomarcador
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
