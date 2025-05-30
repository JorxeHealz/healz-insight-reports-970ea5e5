
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Progress } from '../../ui/progress';

interface FormStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  canProceed: boolean;
  isSubmitting: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const FormStepNavigation = ({
  currentStep,
  totalSteps,
  stepTitle,
  canProceed,
  isSubmitting,
  isLastStep,
  onPrevious,
  onNext,
  onSubmit
}: FormStepNavigationProps) => {
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-6 pt-4 border-t border-healz-brown/10">
      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-healz-brown">
            Progreso del formulario
          </span>
          <span className="text-healz-brown/70">
            {currentStep + 1} de {totalSteps}
          </span>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={progressValue} 
            className="h-3 bg-healz-brown/10 rounded-full overflow-hidden"
          />
          <p className="text-sm font-medium text-healz-teal text-center">
            {stepTitle}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className="flex items-center gap-2 bg-healz-teal hover:bg-healz-teal/90"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Formulario
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
