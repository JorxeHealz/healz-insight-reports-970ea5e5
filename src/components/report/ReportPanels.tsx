
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion } from '../ui/accordion';
import { BiomarkerStatus } from './BiomarkerStatus';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';
import { panelDefinitions } from './panels/PanelDefinitions';
import { PanelAccordionItem } from './panels/PanelAccordionItem';
import { Target, TrendingUp } from 'lucide-react';

type ReportPanelsProps = {
  report: any;
};

export const ReportPanels: React.FC<ReportPanelsProps> = ({ report }) => {
  // Use the hook to get real biomarkers data for this report
  const { data: reportBiomarkers, isLoading, error } = useReportBiomarkers(report.id);

  // Debug information
  React.useEffect(() => {
    console.log('ReportPanels debug:', {
      reportId: report.id,
      biomarkersCount: reportBiomarkers?.length || 0,
      isLoading,
      error: error?.message,
      panelsCount: Object.keys(panelDefinitions).length,
      biomarkerNames: reportBiomarkers?.map(b => b.name) || []
    });
  }, [report.id, reportBiomarkers, isLoading, error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
        <span className="ml-3 text-healz-brown">Cargando paneles de biomarcadores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-healz-red/10 text-healz-red p-4 rounded-md">
        <h3 className="font-medium mb-2">Error al cargar los biomarcadores</h3>
        <p className="text-sm">{error.message}</p>
        <p className="text-xs mt-2 opacity-70">Report ID: {report.id}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-healz-brown flex items-center gap-2">
            <Target className="h-5 w-5 text-healz-teal" />
            Paneles por Objetivos de Salud
            <span className="text-sm font-normal text-healz-brown/50 ml-2">
              ({reportBiomarkers?.length || 0} biomarcadores disponibles)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-healz-teal/5 border border-healz-teal/20 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-healz-teal mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-healz-brown mb-2">DEJA DE ADIVINAR, EMPIEZA A ABORDAR</h3>
                <p className="text-sm text-healz-brown/70 mb-2">
                  Utilizamos machine learning combinado con la experiencia de clínicos expertos para analizar 50+ biomarcadores que nos dicen cómo está funcionando tu cuerpo y dónde podemos optimizar tu salud.
                </p>
                <p className="text-xs text-healz-brown/60 italic">
                  Los paneles están organizados por objetivos específicos de salud para facilitar la interpretación clínica y el seguimiento de síntomas relacionados.
                </p>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(panelDefinitions).map(([panelName, panelData]) => (
              <PanelAccordionItem
                key={panelName}
                panelName={panelName}
                panelData={panelData}
                reportBiomarkers={reportBiomarkers}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="bg-healz-cream/50 border border-healz-brown/10 p-4 rounded-lg">
        <BiomarkerStatus reportId={report.id} />
      </div>
    </div>
  );
};
