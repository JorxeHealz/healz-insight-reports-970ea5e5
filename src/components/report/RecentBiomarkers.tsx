
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Link } from 'react-router-dom';
import { BiomarkerItem } from './biomarkers/BiomarkerItem';
import { Biomarker } from './biomarkers/types';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

interface RecentBiomarkersProps {
  formId?: string; // Use formId instead of patientId
  biomarkers?: Biomarker[]; // Fallback for mock data
}

export const RecentBiomarkers: React.FC<RecentBiomarkersProps> = ({ 
  formId, 
  biomarkers: mockBiomarkers 
}) => {
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);
  
  // Use report-specific data if formId is provided, otherwise fall back to mock data
  const { data: reportBiomarkers, isLoading, error } = useReportBiomarkers(formId || '');
  
  const biomarkers = formId ? reportBiomarkers : mockBiomarkers;
  const shouldShowLoading = formId && isLoading;
  const shouldShowError = formId && error;

  // Sort biomarkers by status priority: outOfRange -> caution -> optimal
  const sortedBiomarkers = biomarkers ? [...biomarkers].sort((a, b) => {
    const statusPriority = {
      'outOfRange': 1,
      'caution': 2,
      'optimal': 3
    };
    return statusPriority[a.status] - statusPriority[b.status];
  }) : [];

  const toggleBiomarker = (name: string) => {
    if (expandedBiomarker === name) {
      setExpandedBiomarker(null);
    } else {
      setExpandedBiomarker(name);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Biomarcadores del Informe</CardTitle>
      </CardHeader>
      <CardContent>
        {shouldShowLoading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
            <p className="mt-2 text-sm text-healz-brown/70">Cargando biomarcadores...</p>
          </div>
        ) : shouldShowError ? (
          <div className="text-center py-4 text-healz-red text-sm">
            Error al cargar los biomarcadores
          </div>
        ) : (
          <div className="divide-y divide-healz-cream">
            {sortedBiomarkers.length > 0 ? (
              sortedBiomarkers.map((biomarker, index) => (
                <BiomarkerItem
                  key={index}
                  biomarker={biomarker}
                  isExpanded={expandedBiomarker === biomarker.name}
                  onToggle={() => toggleBiomarker(biomarker.name)}
                />
              ))
            ) : (
              <p className="text-sm text-healz-brown/70 py-2 text-center">
                No hay biomarcadores disponibles para este informe.
              </p>
            )}
          </div>
        )}
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
