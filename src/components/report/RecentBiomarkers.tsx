
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Link } from 'react-router-dom';
import { BiomarkerItem } from './biomarkers/BiomarkerItem';
import { Biomarker } from './biomarkers/types';

interface RecentBiomarkersProps {
  biomarkers: Biomarker[];
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
        <CardTitle className="text-lg text-healz-brown">Biomarcadores Recientes</CardTitle>
      </CardHeader>
      <CardContent>
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
