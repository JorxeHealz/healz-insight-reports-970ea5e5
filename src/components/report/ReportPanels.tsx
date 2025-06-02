
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { BiomarkerStatus } from './BiomarkerStatus';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

type ReportPanelsProps = {
  report: any;
};

export const ReportPanels: React.FC<ReportPanelsProps> = ({ report }) => {
  // Use the hook to get real biomarkers data for this report
  const { data: reportBiomarkers, isLoading, error } = useReportBiomarkers(report.id);

  // Panel definitions with static biomarker lists (restored original functionality)
  const panelDefinitions = {
    'Salud Cardiovascular': {
      biomarkers: [
        'Apolipoproteína B (Apo B)',
        'Colesterol total',
        'Colesterol HDL',
        'Relación Colesterol/HDL',
        'Colesterol no-HDL',
        'LDL-C',
        'Número de partículas LDL',
        'HDL large',
        'Triglicéridos',
        'Lipoproteína (a)',
        'Proteína C reactiva ultrasensible (hs-CRP)',
        'Homocisteína'
      ],
      description: 'Vigilar tu perfil lipídico, inflamación vascular y riesgo de aterosclerosis antes de que aparezcan síntomas.'
    },
    'Metabolismo y Resistencia a la Insulina': {
      biomarkers: [
        'Glucosa en ayunas',
        'Hemoglobina glicosilada (HbA1c)',
        'Insulina en ayunas',
        'HOMA-IR',
        'Péptido C',
        'Fructosamina'
      ],
      description: 'Detectar disglucemias, síndrome metabólico y señales tempranas de diabetes para ajustar dieta y ejercicio.'
    },
    'Hormonas Femeninas': {
      biomarkers: [
        'Estradiol',
        'Progesterona',
        'Hormona luteinizante (LH)',
        'Hormona foliculoestimulante (FSH)',
        'Testosterona total',
        'Testosterona libre',
        'SHBG',
        'DHEA-S',
        'Prolactina',
        'Hormona antimülleriana (AMH)'
      ],
      description: 'Optimizar fertilidad, regular el ciclo y mantener energía y estado de ánimo mediante el equilibrio endocrino.'
    },
    'Hormonas Masculinas': {
      biomarkers: [
        'Testosterona total',
        'Testosterona libre',
        'SHBG',
        'DHEA-S',
        'Estradiol',
        'Prolactina',
        'Hormona luteinizante (LH)',
        'Hormona foliculoestimulante (FSH)',
        'PSA total',
        'PSA libre'
      ],
      description: 'Potenciar masa muscular, líbido y salud prostática asegurando niveles hormonales óptimos y estables.'
    },
    'Función Tiroidea': {
      biomarkers: [
        'TSH',
        'T4 libre',
        'T3 libre',
        'T3 reversa',
        'Anticuerpos anti-TPO',
        'Anticuerpos anti-tiroglobulina',
        'Tiroglobulina'
      ],
      description: 'Controlar el termostato metabólico del cuerpo, clave en peso, temperatura, concentración y vitalidad.'
    },
    'Inflamación e Inmunidad': {
      biomarkers: [
        'Proteína C reactiva ultrasensible (hs-CRP)',
        'Velocidad de sedimentación globular (VSG)',
        'Interleucina-6 (IL-6)',
        'Factor de necrosis tumoral alfa (TNF-α)',
        'Inmunoglobulina A (IgA)',
        'Inmunoglobulina G (IgG)',
        'Inmunoglobulina M (IgM)',
        'Complemento C3',
        'Complemento C4'
      ],
      description: 'Identificar inflamación crónica silenciosa y la capacidad del sistema inmune para prevenir enfermedades.'
    },
    'Función Hepática': {
      biomarkers: [
        'ALT (Alanina aminotransferasa)',
        'AST (Aspartato aminotransferasa)',
        'Fosfatasa alcalina',
        'Gamma-glutamil transferasa (GGT)',
        'Bilirrubina total',
        'Bilirrubina directa',
        'Albúmina',
        'Proteínas totales',
        'Tiempo de protrombina (TP)'
      ],
      description: 'Monitorizar la detoxificación, el metabolismo hormonal y la producción de proteínas esenciales.'
    },
    'Función Renal': {
      biomarkers: [
        'Creatinina',
        'Urea',
        'Ácido úrico',
        'Filtrado glomerular estimado (eGFR)',
        'Microalbuminuria',
        'Ratio albúmina/creatinina',
        'Cistatin C',
        'Beta-2 microglobulina'
      ],
      description: 'Comprobar la filtración glomerular y el equilibrio de sales que influyen en tensión arterial y rendimiento.'
    },
    'Perfil Hematológico': {
      biomarkers: [
        'Hemoglobina',
        'Hematocrito',
        'Eritrocitos',
        'VCM (Volumen corpuscular medio)',
        'HCM (Hemoglobina corpuscular media)',
        'CHCM (Concentración de hemoglobina corpuscular media)',
        'Leucocitos',
        'Neutrófilos',
        'Linfocitos',
        'Plaquetas'
      ],
      description: 'Evaluar la capacidad de oxigenación, detectar anemias y medir la calidad de la sangre para el rendimiento.'
    },
    'Nutrientes y Vitaminas': {
      biomarkers: [
        'Vitamina D (25-OH)',
        'Vitamina B12',
        'Ácido fólico',
        'Ferritina',
        'Hierro sérico',
        'Transferrina',
        'Saturación de transferrina',
        'Vitamina B1 (Tiamina)',
        'Vitamina B6 (Piridoxina)',
        'Magnesio',
        'Zinc',
        'Selenio'
      ],
      description: 'Revelar carencias de vitaminas, minerales y ácidos grasos que afectan energía, inmunidad y reparación tisular.'
    },
    'Estrés y Envejecimiento': {
      biomarkers: [
        'Cortisol matutino',
        'Cortisol nocturno',
        'DHEA-S',
        'Ratio cortisol/DHEA',
        'IGF-1',
        'Telómeros',
        'Homocisteína'
      ],
      description: 'Cuantificar el impacto del estrés crónico y estimar tu "edad interna" para enfocar estrategias antienvejecimiento.'
    },
    'Análisis de Orina': {
      biomarkers: [
        'Densidad urinaria',
        'pH urinario',
        'Glucosa en orina',
        'Proteínas en orina',
        'Cetonas en orina',
        'Sangre en orina',
        'Leucocitos en orina',
        'Nitritos en orina',
        'Cristales urinarios'
      ],
      description: 'Reflejar la salud renal, el equilibrio metabólico y posibles infecciones del tracto urinario de forma rápida.'
    },
    'Metales Pesados': {
      biomarkers: [
        'Plomo',
        'Mercurio',
        'Cadmio',
        'Arsénico',
        'Aluminio'
      ],
      description: 'Detectar exposición tóxica a plomo y mercurio que puede dañar cerebro, riñón y sistema inmune a largo plazo.'
    }
  };

  // Function to match biomarkers from database with panel biomarkers
  const getBiomarkerData = (biomarkerName: string) => {
    if (!reportBiomarkers) return null;
    
    // Try to find exact match first
    let match = reportBiomarkers.find(b => 
      b.name.toLowerCase() === biomarkerName.toLowerCase()
    );
    
    // If no exact match, try partial matching
    if (!match) {
      match = reportBiomarkers.find(b => {
        const dbName = b.name.toLowerCase();
        const panelName = biomarkerName.toLowerCase();
        return dbName.includes(panelName.split('(')[0].trim()) || 
               panelName.includes(dbName.split('(')[0].trim());
      });
    }
    
    return match;
  };

  // Function to calculate panel statistics
  const calculatePanelStats = (panelBiomarkers: string[]) => {
    const totalBiomarkers = panelBiomarkers.length;
    let measuredCount = 0;
    let outOfRangeCount = 0;
    let cautionCount = 0;

    panelBiomarkers.forEach(biomarkerName => {
      const biomarkerData = getBiomarkerData(biomarkerName);
      if (biomarkerData) {
        measuredCount++;
        if (biomarkerData.status === 'outOfRange') {
          outOfRangeCount++;
        } else if (biomarkerData.status === 'caution') {
          cautionCount++;
        }
      }
    });

    return {
      total: totalBiomarkers,
      measured: measuredCount,
      outOfRange: outOfRangeCount,
      caution: cautionCount,
      alerts: outOfRangeCount + cautionCount
    };
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
            {Object.entries(panelDefinitions).map(([panelName, panelData]) => {
              const stats = calculatePanelStats(panelData.biomarkers);
              
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
                          {stats.measured}/{stats.total} medidos
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
                      <p className="mb-4 text-healz-brown/70 text-xs leading-relaxed">{panelData.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {panelData.biomarkers.map(biomarkerName => {
                          const biomarkerData = getBiomarkerData(biomarkerName);
                          
                          return (
                            <div key={biomarkerName} className="flex justify-between items-center border-b pb-1 border-healz-brown/10">
                              <span className="text-xs">{biomarkerName}</span>
                              <div className="flex items-center gap-2">
                                {biomarkerData ? (
                                  <>
                                    <span className="font-medium text-xs">{biomarkerData.valueWithUnit}</span>
                                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                                      biomarkerData.status === 'optimal' ? 'bg-healz-green/20 text-healz-green' :
                                      biomarkerData.status === 'caution' ? 'bg-healz-yellow/20 text-healz-orange' :
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
                        })}
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
        <BiomarkerStatus reportId={report.id} />
      </div>
    </div>
  );
};
