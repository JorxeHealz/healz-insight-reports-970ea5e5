import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle, User, AlertCircle, Target } from 'lucide-react';

interface KeyFindingCardProps {
  finding: {
    id: string;
    category: string;
    finding: string;
    patient_explanation: string;
    why_it_matters: string;
    body_impact: string;
    impact: 'high' | 'medium' | 'low';
    related_biomarkers: string[];
  };
}

export const KeyFindingCard: React.FC<KeyFindingCardProps> = ({ finding }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-healz-red/10 text-healz-red border-healz-red/20';
      case 'medium':
        return 'bg-healz-yellow/10 text-healz-yellow border-healz-yellow/20';
      case 'low':
        return 'bg-healz-green/10 text-healz-green border-healz-green/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      case 'medium':
        return <AlertCircle className="h-3 w-3" />;
      case 'low':
        return <Target className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header con categoría e indicador de impacto */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="capitalize">
            {finding.category}
          </Badge>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(finding.impact)}`}>
            {getImpactIcon(finding.impact)}
            <span className="capitalize">{finding.impact}</span>
          </div>
        </div>

        {/* Hallazgo principal */}
        <h3 className="font-semibold text-healz-brown mb-4 leading-relaxed">
          {finding.finding}
        </h3>

        {/* Secciones de información */}
        <div className="space-y-3 text-sm">
          <div className="flex gap-2">
            <User className="h-4 w-4 text-healz-blue mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-healz-brown/80 mb-1">Explicación al paciente:</p>
              <p className="text-healz-brown/70">{finding.patient_explanation}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-healz-orange mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-healz-brown/80 mb-1">Por qué importa:</p>
              <p className="text-healz-brown/70">{finding.why_it_matters}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Target className="h-4 w-4 text-healz-teal mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-healz-brown/80 mb-1">Impacto en el cuerpo:</p>
              <p className="text-healz-brown/70">{finding.body_impact}</p>
            </div>
          </div>
        </div>

        {/* Biomarcadores relacionados */}
        {finding.related_biomarkers && finding.related_biomarkers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-healz-brown/10">
            <p className="text-xs font-medium text-healz-brown/60 mb-2">Biomarcadores relacionados:</p>
            <div className="flex flex-wrap gap-1">
              {finding.related_biomarkers.map((biomarker, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {biomarker}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};