
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Link } from 'react-router-dom';
import { BiomarkerItem } from './biomarkers/BiomarkerItem';
import { Biomarker } from './biomarkers/types';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';
import { useRealBiomarkers } from '../../hooks/useRealBiomarkers';

interface RecentBiomarkersProps {
  formId?: string;
  biomarkers?: Biomarker[];
  patientId?: string; // Add patientId for real data
}

export const RecentBiomarkers: React.FC<RecentBiomarkersProps> = ({ 
  formId, 
  biomarkers: mockBiomarkers,
  patientId 
}) => {
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);
  
  // Use real data if patientId is Ana's ID, otherwise use report-specific data or mock data
  const shouldUseRealData = patientId === '550e8400-e29b-41d4-a716-446655440003';
  
  const { data: realBiomarkers, isLoading: realLoading, error: realError } = useRealBiomarkers(
    shouldUseRealData ? patientId : ''
  );
  
  const { data: reportBiomarkers, isLoading: reportLoading, error: reportError } = useReportBiomarkers(
    !shouldUseRealData && formId ? formId : ''
  );
  
  // Determine which data to use
  let biomarkers: Biomarker[] | undefined;
  let isLoading: boolean;
  let error: Error | null = null;

  if (shouldUseRealData) {
    biomarkers = realBiomarkers;
    isLoading = realLoading;
    error = realError;
  } else if (formId) {
    biomarkers = reportBiomarkers;
    isLoading = reportLoading;
    error = reportError;
  } else {
    biomarkers = mockBiomarkers;
    isLoading = false;
    error = null;
  }

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
        {isLoading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
            <p className="mt-2 text-sm text-healz-brown/70">Cargando biomarcadores...</p>
          </div>
        ) : error ? (
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
