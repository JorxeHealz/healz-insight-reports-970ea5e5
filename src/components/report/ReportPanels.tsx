
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BiomarkerStatus } from './BiomarkerStatus';

type ReportPanelsProps = {
  report: any; // Idealmente crear un tipo adecuado
};

export const ReportPanels: React.FC<ReportPanelsProps> = ({ report }) => {
  // Definición de los 13 paneles específicos de biomarcadores
  const biomarkerPanels = [
    {
      id: 'cardiovascular',
      name: 'Salud Cardiovascular',
      description: 'Vigilar tu perfil lipídico, inflamación vascular y riesgo de aterosclerosis antes de que aparezcan síntomas.',
      biomarkers: ['Apolipoproteína B (Apo B)', 'Colesterol total', 'Colesterol HDL', 'Relación Colesterol/HDL', 'Colesterol no-HDL', 'LDL-C', 'Número de partículas LDL', 'HDL large', 'Triglicéridos', 'Lipoproteína (a)', 'Proteína C reactiva ultrasensible (hs-CRP)', 'Homocisteína']
    },
    {
      id: 'metabolismo',
      name: 'Metabolismo y Resistencia a la Insulina',
      description: 'Detectar disglucemias, síndrome metabólico y señales tempranas de diabetes para ajustar dieta y ejercicio.',
      biomarkers: ['Glucosa en ayunas', 'Hemoglobina A1c', 'Insulina (con cálculo HOMA-IR)', 'Leptina', 'Ácido úrico', 'Triglicéridos', 'ALT', 'AST', 'ALP']
    },
    {
      id: 'hormonas-femeninas',
      name: 'Hormonas Femeninas',
      description: 'Optimizar fertilidad, regular el ciclo y mantener energía y estado de ánimo mediante el equilibrio endocrino.',
      biomarkers: ['FSH', 'LH', 'Estradiol', 'Testosterona libre y total', 'SHBG', 'Prolactina', 'DHEA-S', 'Hormona anti-Mülleriana (AMH)']
    },
    {
      id: 'hormonas-masculinas',
      name: 'Hormonas Masculinas',
      description: 'Potenciar masa muscular, líbido y salud prostática asegurando niveles hormonales óptimos y estables.',
      biomarkers: ['Testosterona libre y total', 'SHBG', 'LH', 'FSH', 'Estradiol', 'Prolactina', 'DHEA-S', 'PSA total', 'PSA libre y % libre']
    },
    {
      id: 'tiroides',
      name: 'Función Tiroidea',
      description: 'Controlar el termostato metabólico del cuerpo, clave en peso, temperatura, concentración y vitalidad.',
      biomarkers: ['TSH', 'T4 libre', 'T3 libre', 'Anticuerpos antitiroglobulina', 'Anticuerpos antiperoxidasa tiroidea']
    },
    {
      id: 'inflamacion',
      name: 'Inflamación e Inmunidad',
      description: 'Identificar inflamación crónica silenciosa y la capacidad del sistema inmune para prevenir enfermedades.',
      biomarkers: ['Recuento leucocitario total', 'Neutrófilos', 'Linfocitos', 'Monocitos', 'Eosinófilos', 'Basófilos', 'hs-CRP', 'Proteína total', 'Cociente Albúmina/Globulina']
    },
    {
      id: 'higado',
      name: 'Hígado',
      description: 'Monitorizar la detoxificación, el metabolismo hormonal y la producción de proteínas esenciales.',
      biomarkers: ['ALT', 'AST', 'ALP', 'GGT', 'Bilirrubina total', 'Albúmina', 'Globulina', 'Relación A/G', 'Proteínas totales']
    },
    {
      id: 'rinon',
      name: 'Riñón y Electrolitos',
      description: 'Comprobar la filtración glomerular y el equilibrio de sales que influyen en tensión arterial y rendimiento.',
      biomarkers: ['Creatinina', 'BUN', 'Cociente BUN/Creatinina', 'eGFR', 'Sodio', 'Potasio', 'Cloruro', 'CO₂ (bicarbonato)', 'Calcio sérico']
    },
    {
      id: 'hematologia',
      name: 'Hematología Completa',
      description: 'Evaluar la capacidad de oxigenación, detectar anemias y medir la calidad de la sangre para el rendimiento.',
      biomarkers: ['Hematocrito', 'Hemoglobina', 'Recuento eritrocitario (RBC)', 'MCV', 'MCH', 'MCHC', 'RDW', 'Plaquetas', 'MPV', 'Grupo sanguíneo ABO/Rh']
    },
    {
      id: 'nutrientes',
      name: 'Nutrientes Esenciales',
      description: 'Revelar carencias de vitaminas, minerales y ácidos grasos que afectan energía, inmunidad y reparación tisular.',
      biomarkers: ['Ferritina', 'Hierro', 'Capacidad fijadora total de hierro (TIBC)', '% saturación de hierro', 'Vitamina D', 'Magnesio', 'Zinc', 'Homocisteína', 'Omega-3 total', 'Cociente Ω-6/Ω-3', 'Cociente Ácido araquidónico/EPA', 'Ácido metilmalónico', 'Calcio']
    },
    {
      id: 'estres',
      name: 'Estrés y Edad Biológica',
      description: 'Cuantificar el impacto del estrés crónico y estimar tu "edad interna" para enfocar estrategias antienvejecimiento.',
      biomarkers: ['Cortisol', 'DHEA-S', 'Índice de Edad Biológica (algoritmo multi-marcador)']
    },
    {
      id: 'urianalisis',
      name: 'Urianálisis',
      description: 'Reflejar la salud renal, el equilibrio metabólico y posibles infecciones del tracto urinario de forma rápida.',
      biomarkers: ['Proteína', 'Glucosa', 'Cetonas', 'Sangre oculta', 'Leucocitos', 'Nitritos', 'Bilirrubina', 'pH', 'Densidad específica', 'Apariencia/Color', 'Albúmina-orina', 'Eritrocitos-orina (RBC)', 'Leucocitos-orina (WBC)', 'Cilindros granulosos']
    },
    {
      id: 'metales',
      name: 'Metales Pesados',
      description: 'Detectar exposición tóxica a plomo y mercurio que puede dañar cerebro, riñón y sistema inmune a largo plazo.',
      biomarkers: ['Plomo', 'Mercurio']
    }
  ];

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
            {biomarkerPanels.map(panel => (
              <AccordionItem key={panel.id} value={panel.id}>
                <AccordionTrigger className="hover:text-healz-brown text-healz-brown">
                  {panel.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 text-sm">
                    <p className="mb-4 text-healz-brown/70 text-xs leading-relaxed">{panel.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {panel.biomarkers.map(biomarker => {
                        // Buscar si existe este biomarcador en el reporte actual
                        const biomarkerData = report.recentBiomarkers?.find(
                          b => b.name === biomarker || b.name.includes(biomarker.split(' ')[0])
                        );
                        
                        return (
                          <div key={biomarker} className="flex justify-between items-center border-b pb-1 border-healz-brown/10">
                            <span className="text-xs">{biomarker}</span>
                            {biomarkerData ? (
                              <div className="flex items-center gap-2">
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
                              </div>
                            ) : (
                              <span className="text-healz-brown/40 text-xs">No medido</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="bg-healz-cream/50 border border-healz-brown/10 p-4 rounded-lg">
        <BiomarkerStatus summary={report.biomarkerSummary} />
      </div>
    </div>
  );
};
