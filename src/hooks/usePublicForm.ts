
import { useState } from 'react';
import { useFormByToken } from './usePatientForms';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from './use-toast';
import { FormSubmissionData, FormQuestion } from '../types/forms';

export function usePublicForm(token: string) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch form data
  const { 
    data: formData, 
    isLoading: formLoading, 
    error: formError 
  } = useFormByToken(token || '');

  // Group questions by category
  const questionsByCategory = formData?.questions?.reduce(
    (acc: Record<string, FormQuestion[]>, question: FormQuestion) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, 
    {}
  ) || {};

  const categories = Object.keys(questionsByCategory);
  const isLastStep = currentStep === categories.length - 1;

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFileChange = (questionId: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({
        ...prev,
        [questionId]: file
      }));
      handleAnswerChange(questionId, file.name);
    }
  };

  const uploadFile = async (file: File, formId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${formId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('patient-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('patient-files')
      .getPublicUrl(filePath);

    return publicUrl;
  };

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

  const handleSubmit = async () => {
    if (!formData || !token) return;

    setIsSubmitting(true);
    try {
      // Upload files and get URLs
      const uploadedFiles: FormSubmissionData['files'] = [];
      
      for (const [questionId, file] of Object.entries(files)) {
        try {
          const fileUrl = await uploadFile(file, formData.form.id);
          uploadedFiles.push({
            name: file.name,
            url: fileUrl,
            type: file.type,
            size: file.size
          });
          
          // Update answer with file URL
          setAnswers(prev => ({
            ...prev,
            [questionId]: fileUrl
          }));
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Error",
            description: `No se pudo subir el archivo ${file.name}`,
            variant: "destructive"
          });
          return;
        }
      }

      // Submit form data
      const submissionData: FormSubmissionData = {
        form_token: token,
        answers,
        files: uploadedFiles
      };

      const { error: submitError } = await supabase.functions.invoke('submit-patient-form', {
        body: submissionData
      });

      if (submitError) throw submitError;

      toast({
        title: "Formulario enviado",
        description: "Su formulario ha sido enviado correctamente. Gracias por completarlo."
      });

      // Redirect to success page or show success message
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Por favor, inténtelo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
  };
}
