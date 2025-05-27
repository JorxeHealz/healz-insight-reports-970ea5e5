
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/button';
import { Biomarker } from './types';
import { BiomarkerStatusBadge } from './BiomarkerStatusBadge';
import { BiomarkerInfo } from './BiomarkerInfo';

interface BiomarkerItemProps {
  biomarker: Biomarker;
  isExpanded: boolean;
  onToggle: () => void;
}

export const BiomarkerItem: React.FC<BiomarkerItemProps> = ({ 
  biomarker, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-sm font-medium text-healz-brown">{biomarker.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 ml-1" 
              onClick={onToggle}
            >
              {isExpanded ? (
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
        <BiomarkerStatusBadge status={biomarker.status} />
      </div>
      
      {isExpanded && <BiomarkerInfo biomarker={biomarker} />}
    </div>
  );
};
