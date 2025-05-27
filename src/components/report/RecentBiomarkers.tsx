
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '../ui/button';

interface RecentBiomarkersProps {
  biomarkers: {
    name: string;
    valueWithUnit: string;
    status: 'optimal' | 'caution' | 'outOfRange';
    collectedAgo: string;
  }[];
}

export const RecentBiomarkers: React.FC<RecentBiomarkersProps> = ({ biomarkers }) => {
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);

  // Sort biomarkers by status priority: outOfRange -> caution -> optimal
  const sortedBiomarkers = [...biomarkers].sort((a, b) => {
    const statusPriority = {
      'outOfRange': 1,
      'caution': 2,
      'optimal': 3
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  const getStatusBadge = (status: 'optimal' | 'caution' | 'outOfRange') => {
    switch (status) {
      case 'optimal':
        return (
          <span className="px-2 py-1 text-xs bg-healz-green/20 text-healz-green rounded-full">
            Óptimo
          </span>
        );
      case 'caution':
        return (
          <span className="px-2 py-1 text-xs bg-healz-yellow/20 text-healz-yellow rounded-full">
            Precaución
          </span>
        );
      case 'outOfRange':
        return (
          <span className="px-2 py-1 text-xs bg-healz-red/20 text-healz-red rounded-full">
            Fuera de rango
          </span>
        );
    }
  };

  const toggleBiomarker = (name: string) => {
    if (expandedBiomarker === name) {
      setExpandedBiomarker(null);
    } else {
      setExpandedBiomarker(name);
    }
  };

  // Mock biomarker information (in a real app, this would come from an API)
  const getBiomarkerInfo = (name: string) => {
    const biomarkerInfo: Record<string, { 
      description: string, 
      reference: string,
      importance: string,
      highLevels?: string,
      lowLevels?: string
    }> = {
      "Cortisol": {
        description: "El cortisol es una hormona producida por las glándulas suprarrenales y está relacionada con el estrés.",
        reference: "Referencia: 8 - 25 µg/dL (mañana), 2 - 9 µg/dL (tarde)",
        importance: "El cortisol ayuda a regular el metabolismo, reducir la inflamación y controlar la respuesta al estrés.",
        highLevels: "Los niveles elevados pueden indicar síndrome de Cushing, estrés crónico o problemas de las glándulas suprarrenales.",
        lowLevels: "Los niveles bajos pueden estar asociados con enfermedad de Addison o insuficiencia suprarrenal."
      },
      "Vitamina D": {
        description: "La vitamina D es crucial para la absorción de calcio y la salud ósea.",
        reference: "Referencia: 30 - 80 ng/mL",
        importance: "La vitamina D ayuda a mantener la salud ósea, la función inmunológica y la regulación hormonal.",
        highLevels: "Niveles muy altos pueden causar hipercalcemia y daño renal.",
        lowLevels: "Niveles bajos están asociados con densidad ósea reducida, fatiga y mayor susceptibilidad a infecciones."
      },
      "Glucosa": {
        description: "La glucosa es la principal fuente de energía para las células del cuerpo.",
        reference: "Referencia: 70 - 99 mg/dL (en ayunas)",
        importance: "Mantener niveles óptimos de glucosa es esencial para el metabolismo energético.",
        highLevels: "Niveles elevados pueden indicar prediabetes o diabetes.",
        lowLevels: "Niveles bajos pueden causar hipoglucemia, mareos y fatiga."
      },
      "TSH": {
        description: "La hormona estimulante de la tiroides (TSH) regula la producción de hormonas tiroideas.",
        reference: "Referencia: 0.4 - 4.0 mU/L",
        importance: "La TSH es fundamental para el metabolismo basal y la función tiroidea.",
        highLevels: "Niveles altos pueden indicar hipotiroidismo.",
        lowLevels: "Niveles bajos pueden indicar hipertiroidismo."
      },
      "Ferritina": {
        description: "La ferritina es una proteína que almacena hierro y lo libera de forma controlada.",
        reference: "Referencia: 20 - 250 ng/mL (hombres), 10 - 120 ng/mL (mujeres)",
        importance: "La ferritina es un indicador de los niveles de hierro almacenados en el cuerpo.",
        highLevels: "Niveles altos pueden indicar sobrecarga de hierro, inflamación o enfermedad hepática.",
        lowLevels: "Niveles bajos pueden indicar deficiencia de hierro o anemia."
      }
    };

    return biomarkerInfo[name] || {
      description: "Información no disponible para este biomarcador.",
      reference: "Referencia: No disponible",
      importance: "Importancia: No disponible"
    };
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Biomarcadores Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-healz-cream">
          {sortedBiomarkers.length > 0 ? (
            sortedBiomarkers.map((biomarker, index) => (
              <div key={index} className="py-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-healz-brown">{biomarker.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 ml-1" 
                        onClick={() => toggleBiomarker(biomarker.name)}
                      >
                        {expandedBiomarker === biomarker.name ? (
                          <ChevronUp className="h-4 w-4 text-healz-brown/70" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-healz-brown/70" />
                        )}
                      </Button>
                    </div>
                    <span className="text-xs text-healz-brown/70">
                      {biomarker.valueWithUnit} · hace {biomarker.collectedAgo}
                    </span>
                  </div>
                  {getStatusBadge(biomarker.status)}
                </div>
                
                {expandedBiomarker === biomarker.name && (
                  <div className="mt-3 p-3 bg-healz-cream/30 rounded-md text-sm border border-healz-brown/10">
                    <div className="space-y-3">
                      {biomarker.status === 'outOfRange' && (
                        <div className="text-healz-red text-xs font-medium">
                          • Sobre Rango: {biomarker.valueWithUnit}
                        </div>
                      )}
                      
                      {/* Biomarker information */}
                      <div>
                        <h4 className="flex items-center text-sm font-medium text-healz-brown mb-1">
                          <Info className="h-4 w-4 mr-1" /> ¿Qué es?
                        </h4>
                        <p className="text-xs text-healz-brown/80">
                          {getBiomarkerInfo(biomarker.name).description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-healz-brown mb-1">¿Por qué es importante?</h4>
                        <p className="text-xs text-healz-brown/80">
                          {getBiomarkerInfo(biomarker.name).importance}
                        </p>
                      </div>
                      
                      <div className="text-xs text-healz-brown/70">
                        {getBiomarkerInfo(biomarker.name).reference}
                      </div>
                      
                      {/* Levels info */}
                      {getBiomarkerInfo(biomarker.name).highLevels && (
                        <div>
                          <h5 className="text-xs font-medium text-healz-red">Niveles altos</h5>
                          <p className="text-xs text-healz-brown/80">
                            {getBiomarkerInfo(biomarker.name).highLevels}
                          </p>
                        </div>
                      )}
                      
                      {getBiomarkerInfo(biomarker.name).lowLevels && (
                        <div>
                          <h5 className="text-xs font-medium text-healz-blue">Niveles bajos</h5>
                          <p className="text-xs text-healz-brown/80">
                            {getBiomarkerInfo(biomarker.name).lowLevels}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-healz-brown/70 py-2 text-center">
              No hay biomarcadores recientes.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link 
          to="#" 
          className="text-sm text-healz-teal hover:text-healz-teal/80 transition-colors"
        >
          Ver todos ›
        </Link>
      </CardFooter>
    </Card>
  );
};
