
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from './use-toast';
import { FormSubmissionData } from '../types/forms';

export function useFormSubmission() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    formData: any,
    token: string,
    answers: Record<string, any>,
    prepareFilesForSubmission: () => Promise<Record<string, { name: string; type: string; size: number; data: string }>>
  ) => {
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
      console.log('Starting form submission...');
      
      // Prepare files for submission (convert to base64)
      const preparedFiles = await prepareFilesForSubmission();
      console.log('Files prepared:', Object.keys(preparedFiles));

      // Submit form data with prepared files
      const submissionData: FormSubmissionData & { files_data?: Record<string, any> } = {
        form_token: token,
        answers: answers,
        files: [], // Will be populated by edge function
        files_data: preparedFiles // Send base64 files to edge function
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

      // Redirect to success page
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

  return {
    isSubmitting,
    handleSubmit
  };
}
