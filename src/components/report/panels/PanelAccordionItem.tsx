
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
  
  // Debug information
  React.useEffect(() => {
    console.log(`Panel "${panelName}":`, {
      totalBiomarkers: panelData.biomarkers.length,
      stats,
      availableBiomarkers: reportBiomarkers?.length || 0,
      symptomsCount: panelData.symptoms?.length || 0,
      reportedSymptoms,
      formId
    });
  }, [panelName, panelData.biomarkers, stats, reportBiomarkers, panelData.symptoms, reportedSymptoms, formId]);

  // Función para verificar si un síntoma fue reportado por el paciente
  const isSymptomReported = (symptom: string): boolean => {
    return reportedSymptoms.some(reported => 
      reported.toLowerCase().includes(symptom.toLowerCase()) ||
      symptom.toLowerCase().includes(reported.toLowerCase())
    );
  };

  // Contar síntomas reportados
  const reportedSymptomsCount = panelData.symptoms?.filter(symptom => 
    isSymptomReported(symptom)
  ).length || 0;
  
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
            {reportedSymptomsCount > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-healz-orange/10 text-healz-orange border-healz-orange/30 hover:bg-healz-orange/20 rounded-md px-3 py-1 font-medium"
              >
                {reportedSymptomsCount} síntomas reportados
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
                <h4 className="font-medium text-healz-brown">Síntomas Clínicos Asociados</h4>
                {reportedSymptomsCount > 0 && (
                  <Badge variant="outline" className="text-xs bg-healz-orange/20 text-healz-orange border-healz-orange/50">
                    {reportedSymptomsCount} reportados
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {panelData.symptoms.map((symptom, index) => {
                  const isReported = isSymptomReported(symptom);
                  return (
                    <div key={index} className={`flex items-center gap-2 p-2 rounded-md ${
                      isReported ? 'bg-healz-orange/10 border border-healz-orange/30' : ''
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isReported ? 'bg-healz-orange' : 'bg-healz-brown/30'
                      }`}></div>
                      <span className={`text-xs ${
                        isReported ? 'text-healz-brown font-medium' : 'text-healz-brown/80'
                      }`}>
                        {symptom}
                      </span>
                      {isReported && (
                        <div className="ml-auto flex items-center gap-1">
                          <Check className="h-3 w-3 text-healz-orange" />
                          <span className="text-xs text-healz-orange font-medium">Reportado</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-healz-orange/20">
                <p className="text-xs text-healz-brown/60 italic">
                  {reportedSymptomsCount > 0 
                    ? `El paciente ha reportado ${reportedSymptomsCount} de estos síntomas en el formulario. Correlacione con los biomarcadores para confirmar el diagnóstico.`
                    : 'Evalúe la presencia de estos síntomas en el paciente y correlacione con los valores de biomarcadores para identificar patrones clínicos relevantes.'
                  }
                </p>
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
