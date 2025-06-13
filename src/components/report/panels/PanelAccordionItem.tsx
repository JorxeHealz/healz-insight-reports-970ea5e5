
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Badge } from '../../ui/badge';
import { BiomarkerListItem } from './BiomarkerListItem';
import { calculatePanelStats } from './PanelStatsCalculator';
import { Biomarker } from '../biomarkers/types';

type PanelAccordionItemProps = {
  panelName: string;
  panelData: {
    biomarkers: string[];
    description: string;
  };
  reportBiomarkers: Biomarker[] | undefined;
};

export const PanelAccordionItem: React.FC<PanelAccordionItemProps> = ({
  panelName,
  panelData,
  reportBiomarkers
}) => {
  const stats = calculatePanelStats(panelData.biomarkers, reportBiomarkers);
  
  // Debug information
  React.useEffect(() => {
    console.log(`Panel "${panelName}":`, {
      totalBiomarkers: panelData.biomarkers.length,
      stats,
      availableBiomarkers: reportBiomarkers?.length || 0,
      biomarkerNames: reportBiomarkers?.map(b => b.name) || []
    });
  }, [panelName, panelData.biomarkers, stats, reportBiomarkers]);
  
  return (
    <AccordionItem value={panelName}>
      <AccordionTrigger className="hover:text-healz-brown text-healz-brown">
        <div className="flex items-center justify-between w-full mr-4">
          <span className="text-left font-medium">{panelName}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="text-xs bg-healz-teal/10 text-healz-teal border-healz-teal/30 hover:bg-healz-teal/20 rounded-md px-3 py-1 font-medium"
            >
              {stats.measured}/{stats.total} medidos
            </Badge>
            {stats.alerts > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-healz-red/10 text-healz-red border-healz-red/30 hover:bg-healz-red/20 rounded-md px-3 py-1 font-medium"
              >
                {stats.alerts} en alerta
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-4 text-sm">
          <p className="mb-4 text-healz-brown/70 text-sm leading-relaxed">{panelData.description}</p>
          <div className="grid grid-cols-1 gap-3">
            {panelData.biomarkers.map(biomarkerName => (
              <BiomarkerListItem 
                key={biomarkerName}
                biomarkerName={biomarkerName}
                reportBiomarkers={reportBiomarkers}
              />
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
