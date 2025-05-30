
import { FormQuestion } from '../types/forms';

export const useConditionalQuestions = (
  questions: FormQuestion[],
  answers: Record<string, any>
) => {
  const shouldShowQuestion = (question: FormQuestion): boolean => {
    // Ocultar pregunta de tipo de ejercicio si la frecuencia de ejercicio es "Nunca"
    if (question.question_text.toLowerCase().includes('tipo') && 
        question.question_text.toLowerCase().includes('ejercicio')) {
      
      // Buscar la pregunta de frecuencia de ejercicio
      const exerciseFrequencyQuestion = questions.find(q => 
        q.question_text.toLowerCase().includes('ejercicio') && 
        q.question_type === 'frequency'
      );
      
      if (exerciseFrequencyQuestion) {
        const exerciseFrequencyAnswer = answers[exerciseFrequencyQuestion.id];
        if (exerciseFrequencyAnswer === 'Nunca') {
          return false;
        }
      }
    }
    
    return true;
  };

  const getVisibleQuestions = (categoryQuestions: FormQuestion[]): FormQuestion[] => {
    return categoryQuestions.filter(shouldShowQuestion);
  };

  return {
    shouldShowQuestion,
    getVisibleQuestions
  };
};
