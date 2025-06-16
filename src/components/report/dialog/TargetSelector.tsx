
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { EvaluationType } from './types';

interface TargetSelectorProps {
  evaluationType: EvaluationType;
  targetId: string;
  onTargetChange: (value: string) => void;
  availablePanels: string[];
  availableBiomarkers: { id: string; name: string }[];
}

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  evaluationType,
  targetId,
  onTargetChange,
  availablePanels,
  availableBiomarkers
}) => {
  if (evaluationType === 'general') return null;

  return (
    <div>
      <Label className="text-sm font-medium text-healz-brown">
        {evaluationType === 'panel' ? 'Panel' : 'Biomarcador'}
      </Label>
      <Select value={targetId} onValueChange={onTargetChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Seleccionar ${evaluationType === 'panel' ? 'panel' : 'biomarcador'}`} />
        </SelectTrigger>
        <SelectContent>
          {evaluationType === 'panel' 
            ? availablePanels.map((panel) => (
                <SelectItem key={panel} value={panel}>
                  {panel}
                </SelectItem>
              ))
            : availableBiomarkers.map((biomarker) => (
                <SelectItem key={biomarker.id} value={biomarker.id}>
                  {biomarker.name}
                </SelectItem>
              ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};
