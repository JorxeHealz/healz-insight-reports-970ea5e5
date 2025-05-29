
import React from 'react';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';

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
  onSubmit,
}: FormStepNavigationProps) => {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-sm text-healz-brown/70">
          Paso {currentStep + 1} de {totalSteps}: {stepTitle}
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className="bg-healz-green hover:bg-healz-green/90"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-healz-teal hover:bg-healz-teal/90"
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
};
