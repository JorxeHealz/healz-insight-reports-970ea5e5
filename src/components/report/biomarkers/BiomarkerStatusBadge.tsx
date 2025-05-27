
import React from 'react';

interface BiomarkerStatusBadgeProps {
  status: 'optimal' | 'caution' | 'outOfRange';
}

export const BiomarkerStatusBadge: React.FC<BiomarkerStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'optimal':
      return (
        <span className="px-3 py-1 text-xs bg-healz-green/20 text-healz-green rounded-md">
          Óptimo
        </span>
      );
    case 'caution':
      return (
        <span className="px-3 py-1 text-xs bg-healz-yellow/20 text-healz-yellow rounded-md">
          Precaución
        </span>
      );
    case 'outOfRange':
      return (
        <span className="px-3 py-1 text-xs bg-healz-red/20 text-healz-red rounded-md">
          Fuera de rango
        </span>
      );
  }
};
