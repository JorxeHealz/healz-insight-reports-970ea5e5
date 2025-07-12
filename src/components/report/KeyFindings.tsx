import React from 'react';
import { KeyFindingCard } from './KeyFindingCard';
import { Card, CardContent } from '../ui/card';

interface KeyFindingsProps {
  report: {
    keyFindings?: Array<{
      id: string;
      category: string;
      finding: string;
      patient_explanation: string;
      why_it_matters: string;
      body_impact: string;
      impact: 'high' | 'medium' | 'low';
      related_biomarkers: string[];
    }>;
  };
}

export const KeyFindings: React.FC<KeyFindingsProps> = ({ report }) => {
  const keyFindings = report.keyFindings || [];

  // Ordenar por impacto (high, medium, low) y luego por orden si existe
  const sortedFindings = keyFindings.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  if (keyFindings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-healz-brown/70">
            No se encontraron hallazgos clave para este reporte.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-healz-brown">Hallazgos Clave</h2>
          <p className="text-sm text-healz-brown/70 mt-1">
            Descubrimientos más importantes del análisis de biomarcadores
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-healz-brown/60">
            {keyFindings.length} hallazgo{keyFindings.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedFindings.map((finding) => (
          <KeyFindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </div>
  );
};