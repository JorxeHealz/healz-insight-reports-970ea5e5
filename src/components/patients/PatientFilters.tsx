
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, Calendar, AlertCircle } from 'lucide-react';
import type { PatientFilter } from '../../hooks/usePatientFilters';

interface PatientFiltersProps {
  activeFilter: PatientFilter;
  onFilterChange: (filter: PatientFilter) => void;
  stats: {
    totalPatients: number;
    activeMonth: number;
    noConsultation: number;
  };
}

export const PatientFilters = ({ activeFilter, onFilterChange, stats }: PatientFiltersProps) => {
  const filters = [
    {
      key: 'all' as PatientFilter,
      label: 'Todos los pacientes',
      icon: Users,
      count: stats.totalPatients,
      color: 'bg-healz-teal',
    },
    {
      key: 'active_month' as PatientFilter,
      label: 'Activos este mes',
      icon: Calendar,
      count: stats.activeMonth,
      color: 'bg-healz-green',
    },
    {
      key: 'no_consultation' as PatientFilter,
      label: 'Sin consulta agendada',
      icon: AlertCircle,
      count: stats.noConsultation,
      color: 'bg-healz-orange',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-healz-brown">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? 'default' : 'ghost'}
            className={`w-full justify-start gap-3 h-auto p-3 ${
              activeFilter === filter.key 
                ? 'bg-healz-teal hover:bg-healz-teal/90 text-white' 
                : 'hover:bg-healz-cream/50'
            }`}
            onClick={() => onFilterChange(filter.key)}
          >
            <div className={`p-1.5 rounded-md ${filter.color}/20`}>
              <filter.icon className={`h-4 w-4 text-healz-brown`} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{filter.label}</div>
            </div>
            <Badge variant="secondary" className="bg-healz-cream text-healz-brown">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
