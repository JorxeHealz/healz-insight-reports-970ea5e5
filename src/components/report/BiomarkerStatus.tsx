
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface BiomarkerStatusProps {
  summary: {
    optimal: number;
    caution: number;
    outOfRange: number;
  };
}

export const BiomarkerStatus: React.FC<BiomarkerStatusProps> = ({ summary }) => {
  const total = summary.optimal + summary.caution + summary.outOfRange;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Estado de Biomarcadores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <StatusCard 
            count={summary.optimal} 
            label="Óptimos"
            color="bg-healz-green/20"
            textColor="text-healz-green"
          />
          <StatusCard 
            count={summary.caution} 
            label="Precaución"
            color="bg-healz-yellow/20"
            textColor="text-healz-yellow"
          />
          <StatusCard 
            count={summary.outOfRange} 
            label="Fuera de rango"
            color="bg-healz-red/20"
            textColor="text-healz-red"
          />
        </div>
        
        <div className="mt-4 w-full h-1.5 bg-healz-cream rounded-full flex overflow-hidden">
          <div className="bg-healz-green h-full" style={{ 
            width: `${(summary.optimal / total) * 100}%` 
          }} />
          <div className="bg-healz-yellow h-full" style={{ 
            width: `${(summary.caution / total) * 100}%` 
          }} />
          <div className="bg-healz-red h-full" style={{ 
            width: `${(summary.outOfRange / total) * 100}%` 
          }} />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatusCardProps {
  count: number;
  label: string;
  color: string;
  textColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ count, label, color, textColor }) => {
  return (
    <div className={`p-3 rounded-md ${color} flex flex-col items-center justify-center`}>
      <span className={`text-lg font-bold ${textColor}`}>{count}</span>
      <span className="text-xs text-center text-healz-brown/80">{label}</span>
    </div>
  );
};
