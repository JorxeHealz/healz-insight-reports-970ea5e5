
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SymptomsListProps {
  symptoms: {
    name: string;
    severity: 'low' | 'med' | 'high';
  }[];
}

export const SymptomsList: React.FC<SymptomsListProps> = ({ symptoms }) => {
  const getSeverityBadge = (severity: 'low' | 'med' | 'high') => {
    switch (severity) {
      case 'high':
        return (
          <span className="px-2 py-1 text-xs bg-healz-red/20 text-healz-red rounded-full">
            Alto
          </span>
        );
      case 'med':
        return (
          <span className="px-2 py-1 text-xs bg-healz-orange/20 text-healz-orange rounded-full">
            Medio
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 text-xs bg-healz-yellow/20 text-healz-yellow rounded-full">
            Bajo
          </span>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Síntomas Principales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-healz-cream">
          {symptoms.length > 0 ? (
            symptoms.map((symptom, index) => (
              <div key={index} className="py-2 flex justify-between items-center">
                <span className="text-sm text-healz-brown">{symptom.name}</span>
                {getSeverityBadge(symptom.severity)}
              </div>
            ))
          ) : (
            <p className="text-sm text-healz-brown/70 py-2 text-center">
              No se han registrado síntomas.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
