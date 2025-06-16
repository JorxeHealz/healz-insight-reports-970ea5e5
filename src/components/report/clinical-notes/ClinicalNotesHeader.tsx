
import React from 'react';
import { CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Brain, Plus, Filter } from 'lucide-react';
import { FilterType } from './types';

interface ClinicalNotesHeaderProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddClick: () => void;
}

export const ClinicalNotesHeader: React.FC<ClinicalNotesHeaderProps> = ({
  filter,
  onFilterChange,
  onAddClick
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Evaluaciones Clínicas
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddClick}
          className="h-6 px-2"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-3 w-3 text-healz-brown/60" />
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-6 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo</SelectItem>
            <SelectItem value="evaluations">Evaluaciones</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="panel">Paneles</SelectItem>
            <SelectItem value="biomarker">Biomarcadores</SelectItem>
            <SelectItem value="notes">Solo Notas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
