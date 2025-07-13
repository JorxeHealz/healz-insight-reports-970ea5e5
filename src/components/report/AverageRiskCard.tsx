import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AverageRiskCardProps {
  averageRisk: number;
}

export const AverageRiskCard: React.FC<AverageRiskCardProps> = ({ 
  averageRisk 
}) => {
  const getRiskLevel = (risk: number) => {
    if (risk <= 30) return { level: 'bajo', color: 'healz-green', bgColor: 'healz-green/20' };
    if (risk <= 70) return { level: 'medio', color: 'healz-orange', bgColor: 'healz-orange/20' };
    return { level: 'alto', color: 'healz-red', bgColor: 'healz-red/20' };
  };

  const getRiskMessage = (risk: number) => {
    if (risk <= 30) return 'Riesgo bajo - Excelente estado general';
    if (risk <= 70) return 'Riesgo moderado - Área de mejora identificada';
    return 'Riesgo alto - Requiere atención inmediata';
  };

  const riskInfo = getRiskLevel(averageRisk);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Riesgo Medio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-${riskInfo.bgColor}`}>
            <span className={`text-3xl font-bold text-${riskInfo.color}`}>
              {averageRisk}%
            </span>
          </div>
          
          <div className="mt-3 text-center">
            <p className={`text-sm font-medium text-${riskInfo.color} capitalize`}>
              Riesgo {riskInfo.level}
            </p>
            
            <p className="text-xs text-healz-brown/70 mt-1">
              {getRiskMessage(averageRisk)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};