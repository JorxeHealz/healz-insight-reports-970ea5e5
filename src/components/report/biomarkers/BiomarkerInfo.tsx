
import React from 'react';
import { Info } from 'lucide-react';
import { Biomarker } from './types';
import { getBiomarkerInfo } from './biomarkerData';

interface BiomarkerInfoProps {
  biomarker: Biomarker;
}

export const BiomarkerInfo: React.FC<BiomarkerInfoProps> = ({ biomarker }) => {
  const info = getBiomarkerInfo(biomarker.name);
  const biomarkerData = biomarker.biomarkerData;

  return (
    <div className="mt-3 p-3 bg-healz-cream/30 rounded-md text-sm border border-healz-brown/10">
      <div className="space-y-3">
        {biomarker.status === 'outOfRange' && (
          <div className="text-healz-red text-xs font-medium">
            • Fuera de rango: {biomarker.valueWithUnit}
          </div>
        )}
        
        <div>
          <h4 className="flex items-center text-sm font-medium text-healz-brown mb-1">
            <Info className="h-4 w-4 mr-1" /> ¿Qué es?
          </h4>
          <p className="text-xs text-healz-brown/80">
            {biomarkerData?.description || info.description}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-healz-brown mb-1">¿Por qué es importante?</h4>
          <p className="text-xs text-healz-brown/80">
            {info.importance}
          </p>
        </div>
        
        {biomarkerData && (
          <div>
            <h4 className="text-sm font-medium text-healz-brown mb-1">Rangos de referencia</h4>
            <div className="text-xs text-healz-brown/70 space-y-1">
              <div>
                <span className="font-medium">Óptimo:</span> {biomarkerData.optimal_min} - {biomarkerData.optimal_max} {biomarkerData.unit}
              </div>
              <div>
                <span className="font-medium">Convencional:</span> {biomarkerData.conventional_min} - {biomarkerData.conventional_max} {biomarkerData.unit}
              </div>
              {biomarkerData.panel && (
                <div>
                  <span className="font-medium">Panel:</span> {biomarkerData.panel}
                </div>
              )}
              {biomarkerData.category && (
                <div>
                  <span className="font-medium">Categoría:</span> {biomarkerData.category}
                </div>
              )}
            </div>
          </div>
        )}
        
        {!biomarkerData && (
          <div className="text-xs text-healz-brown/70">
            {info.reference}
          </div>
        )}
        
        {info.highLevels && (
          <div>
            <h5 className="text-xs font-medium text-healz-red">Niveles altos</h5>
            <p className="text-xs text-healz-brown/80">
              {info.highLevels}
            </p>
          </div>
        )}
        
        {info.lowLevels && (
          <div>
            <h5 className="text-xs font-medium text-healz-blue">Niveles bajos</h5>
            <p className="text-xs text-healz-brown/80">
              {info.lowLevels}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
