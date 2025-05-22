
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface BiologicalAgeCardProps {
  biologicalAge: number;
  chronologicalAge: number;
}

export const BiologicalAgeCard: React.FC<BiologicalAgeCardProps> = ({ 
  biologicalAge, 
  chronologicalAge 
}) => {
  const ageDifference = chronologicalAge - biologicalAge;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Edad Biológica</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-healz-blue/20">
            <span className="text-3xl font-bold text-healz-blue">{biologicalAge}</span>
          </div>
          
          <div className="mt-3 text-center">
            {ageDifference > 0 ? (
              <p className="text-sm font-medium text-healz-green">
                {ageDifference} años menor que tu edad real
              </p>
            ) : ageDifference < 0 ? (
              <p className="text-sm font-medium text-healz-red">
                {Math.abs(ageDifference)} años mayor que tu edad real
              </p>
            ) : (
              <p className="text-sm font-medium text-healz-brown">
                Igual a tu edad cronológica
              </p>
            )}
            
            <p className="text-xs text-healz-brown/70 mt-1">
              Edad cronológica: {chronologicalAge} años
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
