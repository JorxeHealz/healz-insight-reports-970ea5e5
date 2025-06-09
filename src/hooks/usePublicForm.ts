
import { useState } from 'react';
import { useFormByToken } from './usePatientForms';
import { useConditionalQuestions } from './useConditionalQuestions';
import { useFormFileHandling } from './useFormFileHandling';
import { useFormNavigation } from './useFormNavigation';
import { useFormSubmission } from './useFormSubmission';
import { FormQuestion } from '../types/forms';

export function usePublicForm(token: string) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Fetch form data
  const { 
    data: formData, 
    isLoading: formLoading, 
    error: formError 
  } = useFormByToken(token || '');

  // Ensure questions is properly typed as FormQuestion[]
  const questions = Array.isArray(formData?.questions) ? formData.questions as FormQuestion[] : [];

  // Group questions by category
  const questionsByCategory = questions.reduce(
    (acc: Record<string, FormQuestion[]>, question: FormQuestion) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, 
    {}
  );

  // Use conditional questions logic
  const { getVisibleQuestions } = useConditionalQuestions(questions, answers);

  // Filter visible questions for each category
  const visibleQuestionsByCategory = Object.entries(questionsByCategory).reduce(
    (acc, [category, categoryQuestions]) => {
      acc[category] = getVisibleQuestions(categoryQuestions);
      return acc;
    },
    {} as Record<string, FormQuestion[]>
  );

  // Use file handling hook
  const { files, handleFileChange, prepareFilesForSubmission } = useFormFileHandling();

  // Use navigation hook
  const {
    currentStep,
    categories,
    isLastStep,
    currentCategory,
    currentQuestions,
    validateCurrentStep,
    goToNextStep,
    goToPreviousStep
  } = useFormNavigation(visibleQuestionsByCategory, answers);

  // Use submission hook
  const { isSubmitting, handleSubmit: submitForm } = useFormSubmission();

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFormFileChange = (questionId: string, file: File | null) => {
    handleFileChange(questionId, file);
    handleAnswerChange(questionId, file ? file.name : '');
  };

  const handleSubmit = () => {
    submitForm(formData, token, answers, prepareFilesForSubmission);
  };

  return {
    formData,
    formLoading,
    formError,
    answers,
    files,
    isSubmitting,
    currentStep,
    categories,
    questionsByCategory: visibleQuestionsByCategory,
    isLastStep,
    validateCurrentStep,
    handleAnswerChange,
    handleFileChange: handleFormFileChange,
    handleSubmit,
    goToNextStep,
    goToPreviousStep
  };
}
