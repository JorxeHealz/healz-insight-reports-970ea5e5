
import React from 'react';
import { Biomarker } from './types';

interface BiomarkerInfoProps {
  biomarker: Biomarker;
}

export const BiomarkerInfo: React.FC<BiomarkerInfoProps> = ({ biomarker }) => {
  return (
    <div className="mt-3 p-3 bg-healz-cream/30 rounded-md text-sm border border-healz-brown/10">
      {biomarker.status === 'outOfRange' && (
        <div className="text-healz-red text-xs font-medium">
          Fuera de rango: {biomarker.valueWithUnit}
        </div>
      )}
    </div>
  );
};
