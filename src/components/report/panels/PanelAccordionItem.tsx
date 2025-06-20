
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Badge } from '../../ui/badge';
import { BiomarkerListItem } from './BiomarkerListItem';
import { calculatePanelStats } from './PanelStatsCalculator';
import { Biomarker } from '../biomarkers/types';
import { AlertTriangle, Info } from 'lucide-react';

type PanelAccordionItemProps = {
  panelName: string;
  panelData: {
    biomarkers: string[];
    description: string;
    symptoms?: string[];
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
      symptomsCount: panelData.symptoms?.length || 0
    });
  }, [panelName, panelData.biomarkers, stats, reportBiomarkers, panelData.symptoms]);
  
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
        <div className="p-4 text-sm space-y-6">
          {/* Descripción del Panel */}
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-2">
              <Info className="h-4 w-4 text-healz-teal mt-0.5 flex-shrink-0" />
              <p className="text-healz-brown/70 text-sm leading-relaxed">{panelData.description}</p>
            </div>
          </div>

          {/* Síntomas Asociados */}
          {panelData.symptoms && panelData.symptoms.length > 0 && (
            <div className="bg-healz-orange/5 border border-healz-orange/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-healz-orange" />
                <h4 className="font-medium text-healz-brown">Síntomas Comunes Asociados</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {panelData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-healz-orange rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-healz-brown/80">{symptom}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-healz-orange/20">
                <p className="text-xs text-healz-brown/60 italic">
                  Si experimentas alguno de estos síntomas, revisa los biomarcadores de este panel para identificar posibles desequilibrios.
                </p>
              </div>
            </div>
          )}

          {/* Lista de Biomarcadores */}
          <div>
            <h4 className="font-medium text-healz-brown mb-3">Biomarcadores Analizados</h4>
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
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
