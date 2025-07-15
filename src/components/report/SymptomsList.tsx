import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SymptomsListProps {
  symptoms: {
    name: string;
    severity: string;
  }[];
}

export const SymptomsList: React.FC<SymptomsListProps> = ({ symptoms }) => {
  const getSeverityBadge = (severity: string) => {
    const lowerSeverity = severity.toLowerCase();
    
    if (lowerSeverity.includes('siempre')) {
      return (
        <span className="px-3 py-1 text-xs bg-healz-red/20 text-healz-red rounded-md">
          {severity}
        </span>
      );
    }
    
    if (lowerSeverity.includes('frecuentemente')) {
      return (
        <span className="px-3 py-1 text-xs bg-healz-orange/20 text-healz-orange rounded-md">
          {severity}
        </span>
      );
    }
    
    if (lowerSeverity.includes('a veces')) {
      return (
        <span className="px-3 py-1 text-xs bg-healz-yellow/20 text-healz-yellow rounded-md">
          {severity}
        </span>
      );
    }
    
    if (lowerSeverity.includes('rara vez')) {
      return (
        <span className="px-3 py-1 text-xs bg-healz-green/20 text-healz-green rounded-md">
          {severity}
        </span>
      );
    }
    
    // Fallback para respuestas no categorizadas
    return (
      <span className="px-3 py-1 text-xs bg-healz-cream text-healz-brown rounded-md">
        {severity}
      </span>
    );
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
