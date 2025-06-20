
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Badge } from '../../ui/badge';
import { BiomarkerListItem } from './BiomarkerListItem';
import { calculatePanelStats } from './PanelStatsCalculator';
import { Biomarker } from '../biomarkers/types';
import { AlertTriangle, Info, Check } from 'lucide-react';
import { useFormSymptoms } from '../../../hooks/useFormSymptoms';

type PanelAccordionItemProps = {
  panelName: string;
  panelData: {
    biomarkers: string[];
    description: string;
    symptoms?: string[];
  };
  reportBiomarkers: Biomarker[] | undefined;
  formId?: string;
};

export const PanelAccordionItem: React.FC<PanelAccordionItemProps> = ({
  panelName,
  panelData,
  reportBiomarkers,
  formId
}) => {
  const stats = calculatePanelStats(panelData.biomarkers, reportBiomarkers);
  const { data: reportedSymptoms = [], isLoading: loadingSymptoms } = useFormSymptoms(formId);
  
  // Función mejorada para verificar si un síntoma fue reportado por el paciente
  const isSymptomReported = (symptom: string): boolean => {
    return reportedSymptoms.some(reported => {
      const normalizedReported = reported.toLowerCase().trim();
      const normalizedSymptom = symptom.toLowerCase().trim();
      
      // Coincidencia exacta
      if (normalizedReported === normalizedSymptom) {
        return true;
      }
      
      // Coincidencia parcial (una palabra clave importante)
      const keywordsReported = normalizedReported.split(/\s+/);
      const keywordsSymptom = normalizedSymptom.split(/\s+/);
      
      // Buscar palabras clave importantes
      for (const keywordReported of keywordsReported) {
        if (keywordReported.length >= 4) { // Solo palabras de 4+ caracteres
          for (const keywordSymptom of keywordsSymptom) {
            if (keywordSymptom.includes(keywordReported) || keywordReported.includes(keywordSymptom)) {
              return true;
            }
          }
        }
      }
      
      return false;
    });
  };

  // Filtrar solo los síntomas coincidentes (reportados por el paciente y presentes en el panel)
  const coincidentSymptoms = panelData.symptoms?.filter(symptom => 
    isSymptomReported(symptom)
  ) || [];
  
  // Debug information
  React.useEffect(() => {
    console.log(`Panel "${panelName}":`, {
      totalBiomarkers: panelData.biomarkers.length,
      stats,
      availableBiomarkers: reportBiomarkers?.length || 0,
      totalPanelSymptoms: panelData.symptoms?.length || 0,
      reportedSymptoms,
      coincidentSymptoms: coincidentSymptoms.length,
      formId,
      panelSymptoms: panelData.symptoms,
      matchingDetails: panelData.symptoms?.map(symptom => ({
        symptom,
        matches: isSymptomReported(symptom)
      }))
    });
  }, [panelName, panelData.biomarkers, stats, reportBiomarkers, panelData.symptoms, reportedSymptoms, coincidentSymptoms.length, formId]);
  
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
            {coincidentSymptoms.length > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-healz-orange/10 text-healz-orange border-healz-orange/30 hover:bg-healz-orange/20 rounded-md px-3 py-1 font-medium"
              >
                {coincidentSymptoms.length} síntomas
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-4 text-sm space-y-4">
          {/* Descripción del Panel */}
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-2">
              <Info className="h-4 w-4 text-healz-teal mt-0.5 flex-shrink-0" />
              <p className="text-healz-brown/70 text-sm leading-relaxed">{panelData.description}</p>
            </div>
          </div>

          {/* Síntomas Coincidentes */}
          {coincidentSymptoms.length > 0 && (
            <div className="bg-healz-orange/10 border border-healz-orange/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-healz-orange" />
                <h4 className="font-medium text-healz-brown">Síntomas Reportados por el Paciente</h4>
                <Badge variant="outline" className="text-xs bg-healz-orange/20 text-healz-orange border-healz-orange/50">
                  {coincidentSymptoms.length} coincidentes
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {coincidentSymptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-healz-orange/15 border border-healz-orange/40 rounded-md">
                    <Check className="h-3 w-3 text-healz-orange flex-shrink-0" />
                    <span className="text-xs text-healz-brown font-medium">
                      {symptom}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay síntomas coincidentes */}
          {panelData.symptoms && panelData.symptoms.length > 0 && coincidentSymptoms.length === 0 && (
            <div className="bg-healz-brown/5 border border-healz-brown/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-healz-brown/50" />
                <span className="text-xs text-healz-brown/60 italic">
                  No se encontraron síntomas reportados por el paciente que coincidan con este panel clínico.
                </span>
              </div>
            </div>
          )}

          {/* Lista de Biomarcadores */}
          <div>
            <h4 className="font-medium text-healz-brown mb-3">Biomarcadores del Panel</h4>
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
