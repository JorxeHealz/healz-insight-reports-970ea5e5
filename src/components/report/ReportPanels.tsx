
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion } from '../ui/accordion';
import { BiomarkerStatus } from './BiomarkerStatus';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';
import { panelDefinitions } from './panels/PanelDefinitions';
import { PanelAccordionItem } from './panels/PanelAccordionItem';

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
          <CardTitle className="text-lg text-healz-brown">
            Paneles de Biomarcadores
            <span className="text-sm font-normal text-healz-brown/50 ml-2">
              ({reportBiomarkers?.length || 0} biomarcadores disponibles)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-healz-brown/70 mb-4">
            Vista agrupada de biomarcadores por paneles de laboratorio específicos
          </p>
          
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
