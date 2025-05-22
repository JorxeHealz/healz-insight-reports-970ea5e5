
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface RiskBarsProps {
  risks: {
    cardio: number;
    mental: number;
    adrenal: number;
    oncologic: number;
    metabolic: number;
    inflammatory: number;
  };
}

export const RiskBars: React.FC<RiskBarsProps> = ({ risks }) => {
  const riskNames = {
    cardio: 'Cardiovascular',
    mental: 'Mental',
    adrenal: 'Adrenal',
    oncologic: 'Oncológico',
    metabolic: 'Metabólico',
    inflammatory: 'Inflamatorio'
  };

  const getRiskColor = (value: number) => {
    if (value < 25) return 'bg-healz-green';
    if (value < 50) return 'bg-healz-yellow';
    if (value < 75) return 'bg-healz-orange';
    return 'bg-healz-red';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Perfil de Riesgo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(risks).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-healz-brown">{riskNames[key as keyof typeof riskNames]}</span>
              <span className="font-medium">{value}%</span>
            </div>
            <div className="w-full bg-healz-cream h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getRiskColor(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
