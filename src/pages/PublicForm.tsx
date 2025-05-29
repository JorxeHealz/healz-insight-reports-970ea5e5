
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FormStepNavigation } from '../components/forms/public/FormStepNavigation';
import { QuestionRenderer } from '../components/forms/public/QuestionRenderer';
import { FormStatusDisplay } from '../components/forms/public/FormStatusDisplay';
import { usePublicForm } from '../hooks/usePublicForm';
import { categoryTitles } from '../utils/formCategoryTitles';

const PublicForm = () => {
  const { token } = useParams<{ token: string }>();
  const {
    formData,
    formLoading,
    formError,
    answers,
    files,
    isSubmitting,
    currentStep,
    categories,
    questionsByCategory,
    isLastStep,
    validateCurrentStep,
    handleAnswerChange,
    handleFileChange,
    handleSubmit,
    goToNextStep,
    goToPreviousStep
  } = usePublicForm(token || '');

  console.log('PublicForm component loaded, token:', token);

  // Handle loading and error states
  if (formLoading) {
    return <FormStatusDisplay status="loading" />;
  }

  if (formError) {
    console.error('Form error details:', formError);
    return <FormStatusDisplay 
      status="error" 
      message={formError.message || 'Ocurrió un error al cargar el formulario.'} 
      token={token} 
    />;
  }

  if (!formData || !formData.success) {
    return <FormStatusDisplay status="not-found" />;
  }

  const form = formData.form;

  if (form.status === 'completed') {
    return <FormStatusDisplay status="completed" />;
  }

  if (form.status === 'expired') {
    return <FormStatusDisplay status="expired" />;
  }

  // If no questions, show message
  if (!formData.questions || formData.questions.length === 0) {
    return <FormStatusDisplay status="no-questions" />;
  }

  const currentCategory = categories[currentStep];
  const currentQuestions = questionsByCategory[currentCategory] || [];
  const canProceed = validateCurrentStep();
  const currentCategoryTitle = categoryTitles[currentCategory as keyof typeof categoryTitles] || currentCategory;

  return (
    <div className="min-h-screen bg-healz-cream py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Formulario de Salud - {form.patient.first_name} {form.patient.last_name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentQuestions.map((question) => (
              <div key={question.id}>
                <QuestionRenderer
                  question={question}
                  value={answers[question.id]}
                  onAnswerChange={handleAnswerChange}
                  onFileChange={handleFileChange}
                  files={files}
                />
              </div>
            ))}

            <FormStepNavigation
              currentStep={currentStep}
              totalSteps={categories.length}
              stepTitle={currentCategoryTitle}
              canProceed={canProceed}
              isSubmitting={isSubmitting}
              isLastStep={isLastStep}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicForm;
