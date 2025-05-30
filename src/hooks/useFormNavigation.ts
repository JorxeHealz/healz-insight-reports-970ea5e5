
import { useState } from 'react';
import { FormQuestion } from '../types/forms';

export function useFormNavigation(
  questionsByCategory: Record<string, FormQuestion[]>,
  answers: Record<string, any>
) {
  const [currentStep, setCurrentStep] = useState(0);

  const categories = Object.keys(questionsByCategory).filter(
    category => questionsByCategory[category].length > 0
  );

  const isLastStep = currentStep === categories.length - 1;
  const currentCategory = categories[currentStep];
  const currentQuestions = questionsByCategory[currentCategory] || [];

  const validateCurrentStep = () => {
    if (!categories[currentStep]) return true;
    
    const currentCategory = categories[currentStep];
    const currentQuestions = questionsByCategory[currentCategory];
    
    return currentQuestions.every(question => {
      if (!question.required) return true;
      const answer = answers[question.id];
      return answer !== undefined && answer !== '' && answer !== null;
    });
  };

  const goToNextStep = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    categories,
    isLastStep,
    currentCategory,
    currentQuestions,
    validateCurrentStep,
    goToNextStep,
    goToPreviousStep
  };
}
