
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
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten archivos PDF, JPEG y PNG",
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Archivo demasiado grande",
          description: "El archivo debe ser menor a 10MB",
          variant: "destructive"
        });
        return;
      }

      setFiles(prev => ({
        ...prev,
        [questionId]: file
      }));
      handleAnswerChange(questionId, file.name);
    } else {
      // Remove file if null
      setFiles(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
      handleAnswerChange(questionId, '');
    }
  };

  const uploadFile = async (file: File, formId: string, retries = 3): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${formId}/${fileName}`;

    console.log('Attempting to upload file:', { fileName, filePath, size: file.size, type: file.type });

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('patient-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Upload attempt ${attempt} failed:`, uploadError);
          
          if (attempt === retries) {
            throw new Error(`Error al subir archivo después de ${retries} intentos: ${uploadError.message}`);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        // Verify upload by checking if file exists
        const { data: fileData, error: checkError } = await supabase.storage
          .from('patient-files')
          .list(formId, {
            search: fileName
          });

        if (checkError || !fileData?.length) {
          console.error('File verification failed:', checkError);
          if (attempt === retries) {
            throw new Error('Error al verificar la subida del archivo');
          }
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('patient-files')
          .getPublicUrl(filePath);

        console.log('File uploaded successfully:', { filePath, publicUrl });
        return publicUrl;

      } catch (error) {
        console.error(`Upload attempt ${attempt} error:`, error);
        
        if (attempt === retries) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error('Error inesperado al subir archivo');
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
    if (!formData || !token) {
      toast({
        title: "Error",
        description: "No se pudo encontrar la información del formulario",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting form submission with files:', Object.keys(files));
      
      // Upload files and get URLs
      const uploadedFiles: FormSubmissionData['files'] = [];
      const updatedAnswers = { ...answers };
      
      for (const [questionId, file] of Object.entries(files)) {
        try {
          console.log(`Uploading file for question ${questionId}:`, file.name);
          
          const fileUrl = await uploadFile(file, formData.form.id);
          
          uploadedFiles.push({
            name: file.name,
            url: fileUrl,
            type: file.type,
            size: file.size
          });
          
          // Update answer with file URL
          updatedAnswers[questionId] = fileUrl;
          
          console.log(`File uploaded successfully for question ${questionId}`);
          
        } catch (error) {
          console.error(`Error uploading file for question ${questionId}:`, error);
          toast({
            title: "Error al subir archivo",
            description: `No se pudo subir el archivo ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            variant: "destructive"
          });
          return;
        }
      }

      console.log('All files uploaded, submitting form data');

      // Submit form data
      const submissionData: FormSubmissionData = {
        form_token: token,
        answers: updatedAnswers,
        files: uploadedFiles
      };

      const { error: submitError } = await supabase.functions.invoke('submit-patient-form', {
        body: submissionData
      });

      if (submitError) {
        console.error('Form submission error:', submitError);
        throw new Error(submitError.message || 'Error al enviar formulario');
      }

      console.log('Form submitted successfully');

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
        description: `No se pudo enviar el formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
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
