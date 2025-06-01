
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Link } from 'react-router-dom';
import { BiomarkerItem } from './biomarkers/BiomarkerItem';
import { Biomarker } from './biomarkers/types';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

interface RecentBiomarkersProps {
  reportId?: string;
  biomarkers?: Biomarker[];
}

export const RecentBiomarkers: React.FC<RecentBiomarkersProps> = ({ 
  reportId, 
  biomarkers: mockBiomarkers
}) => {
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);
  
  console.log('RecentBiomarkers: Component rendered with reportId:', reportId);
  
  const { data: reportBiomarkers, isLoading, error } = useReportBiomarkers(reportId);
  
  console.log('RecentBiomarkers: Hook result:', {
    data: reportBiomarkers,
    isLoading,
    error,
    count: reportBiomarkers?.length || 0
  });
  
  // Use report biomarkers if available, otherwise fallback to mock data
  const biomarkers = reportId ? reportBiomarkers : mockBiomarkers;

  console.log('RecentBiomarkers: Final biomarkers to display:', {
    biomarkers,
    count: biomarkers?.length || 0,
    isUsingReportData: !!reportId
  });

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
        <CardTitle className="text-lg text-healz-brown">
          Biomarcadores del Informe
          {/* Debugging info - se puede quitar después */}
          <span className="text-sm font-normal text-healz-brown/50 ml-2">
            ({sortedBiomarkers.length} encontrados)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
            <p className="mt-2 text-sm text-healz-brown/70">Cargando biomarcadores...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-healz-red text-sm mb-2">
              Error al cargar los biomarcadores
            </div>
            <div className="text-xs text-healz-brown/70">
              {error.message}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-healz-cream">
            {sortedBiomarkers.length > 0 ? (
              sortedBiomarkers.map((biomarker, index) => (
                <BiomarkerItem
                  key={`${biomarker.name}-${index}`}
                  biomarker={biomarker}
                  isExpanded={expandedBiomarker === biomarker.name}
                  onToggle={() => toggleBiomarker(biomarker.name)}
                />
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-healz-brown/70 mb-2">
                  No hay biomarcadores disponibles para este informe.
                </p>
                {/* Debugging info */}
                <div className="text-xs text-healz-brown/50">
                  Report ID: {reportId || 'No reportId'}<br/>
                  Hook called: {reportId ? 'Sí' : 'No'}<br/>
                  Loading: {isLoading ? 'Sí' : 'No'}<br/>
                  Error: {error ? 'Sí' : 'No'}
                </div>
              </div>
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
