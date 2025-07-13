
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Brain, Calendar, Target, AlertTriangle } from 'lucide-react';

interface MainDiagnosisCardProps {
  diagnosis: string;
  diagnosisDate: string;
  vitalityScore: number;
  riskScore: number;
  personalizedInsights: any;
  criticalBiomarkers: any[];
}

export const MainDiagnosisCard: React.FC<MainDiagnosisCardProps> = ({
  diagnosis,
  diagnosisDate,
  vitalityScore,
  riskScore,
  personalizedInsights,
  criticalBiomarkers
}) => {
  const systemsAffected = personalizedInsights.sistemas_afectados || personalizedInsights.systems_affected || [];
  const rootCauses = personalizedInsights.causas_raiz || personalizedInsights.root_causes || [];
  const interconnections = personalizedInsights.interconexiones || personalizedInsights.interconnections || '';

  return (
    <Card className="border-2 border-healz-blue/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-healz-blue/5 to-healz-teal/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl text-healz-brown">
            <Brain className="h-8 w-8 text-healz-blue" />
            Diagnóstico Integral
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <Calendar className="h-4 w-4" />
              {diagnosisDate}
            </Badge>
            {vitalityScore > 0 && (
              <Badge 
                variant={vitalityScore >= 70 ? 'default' : vitalityScore >= 50 ? 'secondary' : 'destructive'}
                className="px-3 py-1"
              >
                Vitalidad: {vitalityScore}%
              </Badge>
            )}
            {riskScore > 0 && (
              <Badge 
                variant={riskScore >= 70 ? 'destructive' : riskScore >= 40 ? 'secondary' : 'default'}
                className="px-3 py-1"
              >
                Riesgo: {riskScore}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Diagnóstico Principal */}
        <div className="bg-healz-cream/30 rounded-lg p-5">
          <h3 className="font-semibold text-healz-brown mb-3 text-lg">Evaluación Clínica Principal</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-healz-brown leading-relaxed whitespace-pre-wrap text-base">
              {diagnosis}
            </p>
          </div>
        </div>

        {/* Insights Personalizados */}
        {(systemsAffected.length > 0 || rootCauses.length > 0 || interconnections) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-healz-brown flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-healz-orange" />
              Análisis Personalizado
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {systemsAffected.length > 0 && (
                <Card className="border-l-4 border-l-healz-blue bg-healz-blue/5">
                  <CardContent className="p-4">
                    <div className="font-semibold text-healz-brown mb-3">
                      Sistemas Afectados
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {systemsAffected.map((system: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {rootCauses.length > 0 && (
                <Card className="border-l-4 border-l-healz-orange bg-healz-orange/5">
                  <CardContent className="p-4">
                    <div className="font-semibold text-healz-brown mb-3">
                      Causas Identificadas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rootCauses.map((cause: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                          {cause}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {interconnections && (
                <Card className="border-l-4 border-l-healz-teal bg-healz-teal/5">
                  <CardContent className="p-4">
                    <div className="font-semibold text-healz-brown mb-3">
                      Interconexiones
                    </div>
                    <div className="text-sm text-healz-brown/80">
                      {interconnections}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Biomarcadores Críticos */}
        {criticalBiomarkers.length > 0 && (
          <div className="bg-gradient-to-r from-healz.red/5 to-healz.orange/5 border-2 border-healz.red/30 rounded-xl p-6 shadow-lg animate-fade-in relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-healz.red/5 via-transparent to-healz.orange/5 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-healz.red flex items-center gap-3 text-xl">
                  <div className="p-2 bg-healz.red/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Biomarcadores Críticos</div>
                    <div className="text-sm font-normal text-healz.red/70">
                      {criticalBiomarkers.length} {criticalBiomarkers.length === 1 ? 'marcador requiere' : 'marcadores requieren'} atención inmediata
                    </div>
                  </div>
                </h3>
                <Badge 
                  className="text-sm px-4 py-2 font-bold bg-healz.red text-healz.cream border border-healz.red shadow-lg animate-pulse"
                >
                  URGENTE
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {criticalBiomarkers.map((biomarker, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/60 backdrop-blur-sm border border-healz.red/20 rounded-lg p-4 hover-scale transition-all duration-300 hover:shadow-lg hover:border-healz.red/40 hover:bg-white/80"
                    title={`${typeof biomarker === 'string' ? biomarker : biomarker.name} - Requiere seguimiento inmediato`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-healz.brown text-sm">
                        {typeof biomarker === 'string' ? biomarker : biomarker.name || 'Biomarcador'}
                      </div>
                      <div className="ml-2 p-1 bg-healz.red/10 rounded-full group-hover:bg-healz.red/20 transition-colors">
                        <AlertTriangle className="h-4 w-4 text-healz.red" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-healz.red/10 rounded-lg border border-healz.red/20">
                <p className="text-sm text-healz.red font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    Estos biomarcadores requieren evaluación profesional y posible intervención terapéutica.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Puntuaciones Resumidas */}
        {(vitalityScore > 0 || riskScore > 0) && (
          <div className="bg-gradient-to-r from-healz-cream/50 to-healz-blue/10 rounded-lg p-5">
            <h3 className="font-semibold text-healz-brown mb-4 text-lg text-center">
              Métricas de Salud General
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {vitalityScore > 0 && (
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    vitalityScore >= 70 ? 'text-healz-green' : 
                    vitalityScore >= 50 ? 'text-healz-yellow' : 'text-healz-orange'
                  }`}>
                    {vitalityScore}%
                  </div>
                  <div className="font-semibold text-healz-brown">Índice de Vitalidad</div>
                  <div className="text-sm text-healz-brown/70 mt-1">
                    {vitalityScore >= 70 ? 'Excelente estado general' : 
                     vitalityScore >= 50 ? 'Estado moderado' : 'Requiere atención'}
                  </div>
                </div>
              )}
              {riskScore > 0 && (
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    riskScore >= 70 ? 'text-healz-red' : 
                    riskScore >= 40 ? 'text-healz-orange' : 'text-healz-green'
                  }`}>
                    {riskScore}%
                  </div>
                  <div className="font-semibold text-healz-brown">Nivel de Riesgo</div>
                  <div className="text-sm text-healz-brown/70 mt-1">
                    {riskScore >= 70 ? 'Alto - acción inmediata' : 
                     riskScore >= 40 ? 'Moderado - seguimiento' : 'Bajo - mantenimiento'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
