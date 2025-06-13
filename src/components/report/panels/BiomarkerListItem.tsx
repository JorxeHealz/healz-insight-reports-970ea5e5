
import React from 'react';
import { getBiomarkerData } from './PanelStatsCalculator';
import { Biomarker } from '../biomarkers/types';

type BiomarkerListItemProps = {
  biomarkerName: string;
  reportBiomarkers: Biomarker[] | undefined;
};

export const BiomarkerListItem: React.FC<BiomarkerListItemProps> = ({ 
  biomarkerName, 
  reportBiomarkers 
}) => {
  const biomarkerData = getBiomarkerData(biomarkerName, reportBiomarkers);
  
  // Debug log for troubleshooting
  React.useEffect(() => {
    if (!biomarkerData && reportBiomarkers) {
      console.log(`Biomarker "${biomarkerName}" not found. Available biomarkers:`, 
        reportBiomarkers.map(b => b.name));
    }
  }, [biomarkerName, biomarkerData, reportBiomarkers]);
  
  return (
    <div className="flex justify-between items-center border-b pb-1 border-healz-brown/10">
      <span className="text-xs font-medium text-healz-brown">{biomarkerName}</span>
      <div className="flex items-center gap-2">
        {biomarkerData ? (
          <>
            <span className="font-medium text-xs text-healz-brown">{biomarkerData.valueWithUnit}</span>
            <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${
              biomarkerData.status === 'optimal' ? 'bg-healz-green/20 text-healz-green' :
              biomarkerData.status === 'caution' ? 'bg-healz-orange/20 text-healz-orange' :
              'bg-healz-red/20 text-healz-red'
            }`}>
              {biomarkerData.status === 'optimal' ? 'Óptimo' :
               biomarkerData.status === 'caution' ? 'Precaución' :
               'Fuera de rango'}
            </span>
          </>
        ) : (
          <span className="text-xs text-healz-brown/50 px-2 py-0.5 bg-healz-brown/5 rounded">
            No medido
          </span>
        )}
      </div>
    </div>
  );
};
