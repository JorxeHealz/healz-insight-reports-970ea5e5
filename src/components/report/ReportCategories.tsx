
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RiskBars } from './RiskBars';

type ReportCategoriesProps = {
  report: any; // Idealmente crear un tipo adecuado
};

export const ReportCategories: React.FC<ReportCategoriesProps> = ({ report }) => {
  // Categorías clínicas principales para el perfil de salud
  const healthCategories = [
    {
      id: 'hormones',
      name: 'Hormones',
      description: 'Evaluación de balance hormonal y regulación endocrina',
      symptoms: ['Fatiga', 'Cambios de humor', 'Bajo libido', 'Sofocos'],
      keyBiomarkers: ['Testosterone', 'Estradiol', 'DHEA-S', 'Cortisol', 'TSH']
    },
    {
      id: 'vitality',
      name: 'Vitality',
      description: 'Indicadores de energía, vitalidad y función celular',
      symptoms: ['Baja inmunidad', 'Falta de motivación', 'Sueño deficiente'],
      keyBiomarkers: ['Vitamina D', 'Ferritina', 'Glucosa', 'TSH']
    },
    {
      id: 'cardiac',
      name: 'Cardiac Risk',
      description: 'Factores de riesgo cardiovascular y salud arterial',
      symptoms: ['Fatiga', 'Dolor torácico', 'Mareos'],
      keyBiomarkers: ['Colesterol Total', 'LDL', 'HDL', 'Triglicéridos', 'hs-CRP']
    },
    {
      id: 'weight',
      name: 'Weight Management',
      description: 'Factores metabólicos que influyen en el peso corporal',
      symptoms: ['Exceso grasa corporal', 'Antojos', 'Sueño deficiente'],
      keyBiomarkers: ['HbA1c', 'Insulina', 'TSH', 'Vitamina D', 'Triglicéridos']
    },
    {
      id: 'brain',
      name: 'Brain Health',
      description: 'Indicadores de salud cognitiva y neurológica',
      symptoms: ['Pérdida de memoria', 'Niebla mental', 'Cambios de humor'],
      keyBiomarkers: ['Homocisteína', 'TSH', 'HbA1c', 'Vitamina B12']
    },
    {
      id: 'longevity',
      name: 'Longevity',
      description: 'Factores biológicos relacionados con la longevidad',
      symptoms: ['Fatiga crónica', 'Enfermedad frecuente', 'Cambios de peso'],
      keyBiomarkers: ['CRP', 'Insulina', 'TSH', 'Vitamina D', 'ApoB']
    }
  ];

  const findMatchingSymptoms = (categorySymptoms) => {
    if (!report.topSymptoms) return [];
    return report.topSymptoms.filter(reportSymptom => 
      categorySymptoms.includes(reportSymptom.name)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorías de Salud</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-healz-brown/70 mb-4">
            Análisis por categoría clínica y objetivos de salud
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthCategories.map(category => {
              const matchingSymptoms = findMatchingSymptoms(category.symptoms);
              const hasSymptoms = matchingSymptoms.length > 0;
              
              return (
                <Card key={category.id} className={`border ${hasSymptoms ? 'border-healz-orange' : 'border-healz-brown/10'}`}>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <p className="text-sm text-healz-brown/70 mt-1 mb-3">{category.description}</p>
                    
                    {hasSymptoms && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-healz-orange mb-1">Síntomas detectados:</p>
                        <div className="flex flex-wrap gap-1">
                          {matchingSymptoms.map(symptom => (
                            <span 
                              key={symptom.name} 
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                symptom.severity === 'high' 
                                  ? 'bg-healz-red/20 text-healz-red'
                                  : symptom.severity === 'med'
                                  ? 'bg-healz-orange/20 text-healz-orange'
                                  : 'bg-healz-yellow/20 text-healz-yellow'
                              }`}
                            >
                              {symptom.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs">
                      <p className="font-medium">Biomarcadores clave:</p>
                      <p className="text-healz-brown/70">{category.keyBiomarkers.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-healz-cream/50 border border-healz-brown/10 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Perfil de Riesgo</h3>
        <RiskBars risks={report.risks} />
      </div>
    </div>
  );
};
