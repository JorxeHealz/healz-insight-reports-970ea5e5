import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { BiomarkerStatus } from './BiomarkerStatus';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

type ReportPanelsProps = {
  report: any; // Idealmente crear un tipo adecuado
};

export const ReportPanels: React.FC<ReportPanelsProps> = ({ report }) => {
  // Use the hook to get real biomarkers data for this report
  const { data: reportBiomarkers, isLoading, error } = useReportBiomarkers(report.id);

  // Function to group biomarkers by panel
  const groupBiomarkersByPanel = () => {
    if (!reportBiomarkers) return {};
    
    const grouped = reportBiomarkers.reduce((acc, biomarker) => {
      const panel = biomarker.biomarkerData?.panel || 'Sin Panel';
      if (!acc[panel]) {
        acc[panel] = [];
      }
      acc[panel].push(biomarker);
      return acc;
    }, {} as Record<string, typeof reportBiomarkers>);
    
    return grouped;
  };

  // Function to calculate panel statistics
  const calculatePanelStats = (biomarkers: typeof reportBiomarkers) => {
    const totalBiomarkers = biomarkers.length;
    let outOfRangeCount = 0;
    let cautionCount = 0;

    biomarkers.forEach(biomarker => {
      if (biomarker.status === 'outOfRange') {
        outOfRangeCount++;
      } else if (biomarker.status === 'caution') {
        cautionCount++;
      }
    });

    return {
      total: totalBiomarkers,
      measured: totalBiomarkers,
      outOfRange: outOfRangeCount,
      caution: cautionCount,
      alerts: outOfRangeCount + cautionCount
    };
  };

  // Panel descriptions (keeping the good descriptions from the original)
  const panelDescriptions: Record<string, string> = {
    'Cardiovascular': 'Vigilar tu perfil lipídico, inflamación vascular y riesgo de aterosclerosis antes de que aparezcan síntomas.',
    'Metabolic': 'Detectar disglucemias, síndrome metabólico y señales tempranas de diabetes para ajustar dieta y ejercicio.',
    'Hormones Female': 'Optimizar fertilidad, regular el ciclo y mantener energía y estado de ánimo mediante el equilibrio endocrino.',
    'Hormones Male': 'Potenciar masa muscular, líbido y salud prostática asegurando niveles hormonales óptimos y estables.',
    'Thyroid': 'Controlar el termostato metabólico del cuerpo, clave en peso, temperatura, concentración y vitalidad.',
    'Inflammation': 'Identificar inflamación crónica silenciosa y la capacidad del sistema inmune para prevenir enfermedades.',
    'Liver': 'Monitorizar la detoxificación, el metabolismo hormonal y la producción de proteínas esenciales.',
    'Kidney': 'Comprobar la filtración glomerular y el equilibrio de sales que influyen en tensión arterial y rendimiento.',
    'Blood': 'Evaluar la capacidad de oxigenación, detectar anemias y medir la calidad de la sangre para el rendimiento.',
    'Nutrients': 'Revelar carencias de vitaminas, minerales y ácidos grasos que afectan energía, inmunidad y reparación tisular.',
    'Stress': 'Cuantificar el impacto del estrés crónico y estimar tu "edad interna" para enfocar estrategias antienvejecimiento.',
    'Urine': 'Reflejar la salud renal, el equilibrio metabólico y posibles infecciones del tracto urinario de forma rápida.',
    'Heavy Metals': 'Detectar exposición tóxica a plomo y mercurio que puede dañar cerebro, riñón y sistema inmune a largo plazo.'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-healz-red/10 text-healz-red p-4 rounded-md">
        Error al cargar los biomarcadores: {error.message}
      </div>
    );
  }

  const groupedBiomarkers = groupBiomarkersByPanel();
  const panelEntries = Object.entries(groupedBiomarkers);

  if (panelEntries.length === 0) {
    return (
      <div className="text-center py-8 text-healz-brown/70">
        No se encontraron biomarcadores para este reporte.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paneles de Biomarcadores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-healz-brown/70 mb-4">
            Vista agrupada de biomarcadores por paneles de laboratorio específicos
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {panelEntries.map(([panelName, biomarkers]) => {
              const stats = calculatePanelStats(biomarkers);
              const description = panelDescriptions[panelName] || 'Panel de biomarcadores especializados para el análisis de salud.';
              
              return (
                <AccordionItem key={panelName} value={panelName}>
                  <AccordionTrigger className="hover:text-healz-brown text-healz-brown">
                    <div className="flex items-center justify-between w-full mr-4">
                      <span className="text-left">{panelName}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-healz-teal/10 text-healz-teal border-healz-teal/30 hover:bg-healz-teal/20 rounded-md px-3 py-1"
                        >
                          {stats.measured} medidos
                        </Badge>
                        {stats.alerts > 0 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-healz-red/10 text-healz-red border-healz-red/30 hover:bg-healz-red/20 rounded-md px-3 py-1"
                          >
                            {stats.alerts} en alerta
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 text-sm">
                      <p className="mb-4 text-healz-brown/70 text-xs leading-relaxed">{description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {biomarkers.map(biomarker => (
                          <div key={biomarker.biomarkerData?.id} className="flex justify-between items-center border-b pb-1 border-healz-brown/10">
                            <span className="text-xs">{biomarker.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs">{biomarker.valueWithUnit}</span>
                              <span className={`px-1.5 py-0.5 text-xs rounded ${
                                biomarker.status === 'optimal' ? 'bg-healz-green/20 text-healz-green' :
                                biomarker.status === 'caution' ? 'bg-healz-yellow/20 text-healz-orange' :
                                'bg-healz-red/20 text-healz-red'
                              }`}>
                                {biomarker.status === 'optimal' ? 'Óptimo' :
                                 biomarker.status === 'caution' ? 'Precaución' :
                                 'Fuera de rango'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="bg-healz-cream/50 border border-healz-brown/10 p-4 rounded-lg">
        <BiomarkerStatus summary={report.biomarkerSummary} />
      </div>
    </div>
  );
};
