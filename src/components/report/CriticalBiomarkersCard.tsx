import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle } from 'lucide-react';

interface CriticalBiomarkersCardProps {
  criticalBiomarkers: any[];
}

export const CriticalBiomarkersCard: React.FC<CriticalBiomarkersCardProps> = ({
  criticalBiomarkers
}) => {
  if (!criticalBiomarkers || criticalBiomarkers.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-healz-red/5 to-healz-orange/5 border-2 border-healz-red/30 rounded-xl p-6 shadow-lg animate-fade-in relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-healz-red/5 via-transparent to-healz-orange/5 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-healz-red flex items-center gap-3 text-xl">
            <div className="p-2 bg-healz-red/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-semibold">Biomarcadores Críticos</div>
              <div className="text-sm font-normal text-healz-red/70">
                {criticalBiomarkers.length} {criticalBiomarkers.length === 1 ? 'marcador requiere' : 'marcadores requieren'} atención inmediata
              </div>
            </div>
          </h3>
          <Badge 
            className="text-sm px-4 py-2 font-bold bg-healz-red text-healz-cream border border-healz-red shadow-lg animate-pulse"
          >
            URGENTE
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {criticalBiomarkers.map((biomarker, index) => (
            <div
              key={index}
              className="group relative bg-white/60 backdrop-blur-sm border border-healz-red/20 rounded-lg p-4 hover-scale transition-all duration-300 hover:shadow-lg hover:border-healz-red/40 hover:bg-white/80"
              title={`${typeof biomarker === 'string' ? biomarker : biomarker.name} - Requiere seguimiento inmediato`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-healz-brown text-sm">
                  {typeof biomarker === 'string' ? biomarker : biomarker.name || 'Biomarcador'}
                </div>
                <div className="ml-2 p-1 bg-healz-red/10 rounded-full group-hover:bg-healz-red/20 transition-colors">
                  <AlertTriangle className="h-4 w-4 text-healz-red" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-healz-red/10 rounded-lg border border-healz-red/20">
          <p className="text-sm text-healz-red font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Estos biomarcadores requieren evaluación profesional y posible intervención terapéutica.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};