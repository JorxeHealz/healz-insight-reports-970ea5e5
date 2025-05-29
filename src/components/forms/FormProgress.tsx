
import React from 'react';
import { FormSection, FORM_SECTIONS } from '../../types/forms';
import { Progress } from '../ui/progress';
import { CheckCircle } from 'lucide-react';

interface FormProgressProps {
  sections: FormSection[];
  currentSectionId: string;
  completedSections: string[];
  onSectionChange: (sectionId: string) => void;
}

export const FormProgress = ({ 
  sections, 
  currentSectionId, 
  completedSections, 
  onSectionChange 
}: FormProgressProps) => {
  const totalSections = sections.length;
  const completedCount = completedSections.length;
  const progressPercentage = (completedCount / totalSections) * 100;

  return (
    <div className="bg-white p-4 rounded-lg border border-healz-brown/20 mb-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-healz-brown">Progreso del Formulario</h3>
          <span className="text-sm text-healz-brown/70">
            {completedCount} de {totalSections} secciones completadas
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {sections.map((section) => {
          const isCompleted = completedSections.includes(section.id);
          const isCurrent = currentSectionId === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                p-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1
                ${isCurrent 
                  ? 'bg-healz-teal text-white' 
                  : isCompleted 
                    ? 'bg-healz-green text-white' 
                    : 'bg-healz-cream text-healz-brown hover:bg-healz-cream/70'
                }
              `}
            >
              {isCompleted && <CheckCircle className="h-3 w-3" />}
              <span className="truncate">{FORM_SECTIONS[section.id as keyof typeof FORM_SECTIONS]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
