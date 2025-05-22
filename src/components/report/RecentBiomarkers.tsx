
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Link } from 'react-router-dom';

interface RecentBiomarkersProps {
  biomarkers: {
    name: string;
    valueWithUnit: string;
    status: 'optimal' | 'caution' | 'outOfRange';
    collectedAgo: string;
  }[];
}

export const RecentBiomarkers: React.FC<RecentBiomarkersProps> = ({ biomarkers }) => {
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Biomarcadores Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-healz-cream">
          {biomarkers.length > 0 ? (
            biomarkers.map((biomarker, index) => (
              <div key={index} className="py-2 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-healz-brown">{biomarker.name}</span>
                  <span className="text-xs text-healz-brown/70">
                    {biomarker.valueWithUnit} · hace {biomarker.collectedAgo}
                  </span>
                </div>
                {getStatusBadge(biomarker.status)}
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
