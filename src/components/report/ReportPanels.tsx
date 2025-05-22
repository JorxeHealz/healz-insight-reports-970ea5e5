
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BiomarkerStatus } from './BiomarkerStatus';

type ReportPanelsProps = {
  report: any; // Idealmente crear un tipo adecuado
};

export const ReportPanels: React.FC<ReportPanelsProps> = ({ report }) => {
  // Definición de paneles comunes de biomarcadores
  const biomarkerPanels = [
    {
      id: 'metabolic',
      name: 'Metabolic',
      description: 'Biomarcadores relacionados con el metabolismo energético y regulación de glucosa',
      biomarkers: ['Glucosa', 'HbA1c', 'Insulina', 'HOMA-IR']
    },
    {
      id: 'heart',
      name: 'Heart',
      description: 'Biomarcadores de salud cardiovascular y perfil lipídico',
      biomarkers: ['Colesterol Total', 'LDL', 'HDL', 'Triglicéridos', 'ApoB', 'hs-CRP']
    },
    {
      id: 'thyroid',
      name: 'Thyroid',
      description: 'Biomarcadores de función tiroidea',
      biomarkers: ['TSH', 'T4 libre', 'T3 libre', 'Anticuerpos anti-TPO']
    },
    {
      id: 'stress',
      name: 'Stress & Aging',
      description: 'Biomarcadores relacionados con estrés crónico y envejecimiento',
      biomarkers: ['Cortisol AM', 'Cortisol PM', 'DHEA-S', 'Longitud telomérica']
    },
    {
      id: 'nutrients',
      name: 'Nutrients',
      description: 'Estado nutricional y deficiencias vitamínicas',
      biomarkers: ['Vitamina D', 'Vitamina B12', 'Folato', 'Ferritina', 'Zinc', 'Magnesio']
    },
    {
      id: 'immune',
      name: 'Immune Regulation',
      description: 'Biomarcadores de función inmunitaria e inflamación',
      biomarkers: ['hs-CRP', 'IL-6', 'TNF-alfa', 'Inmunoglobulinas', 'Poblaciones linfocitarias']
    },
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
                    <p className="mb-2 text-healz-brown/70">{panel.description}</p>
                    <ul className="space-y-2">
                      {panel.biomarkers.map(biomarker => {
                        // Buscar si existe este biomarcador en el reporte actual
                        const biomarkerData = report.recentBiomarkers?.find(
                          b => b.name === biomarker
                        );
                        
                        return (
                          <li key={biomarker} className="flex justify-between items-center border-b pb-1 border-healz-brown/10">
                            <span>{biomarker}</span>
                            {biomarkerData ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{biomarkerData.valueWithUnit}</span>
                                <span className={`px-2 py-0.5 text-xs rounded ${
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
                          </li>
                        );
                      })}
                    </ul>
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
