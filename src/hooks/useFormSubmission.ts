
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
    files: Record<string, File>,
    uploadFile: (file: File, formId: string) => Promise<string>
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
      console.log('Starting form submission with files:', Object.keys(files));
      
      // Upload files and get URLs
      const uploadedFiles: FormSubmissionData['files'] = [];
      const updatedAnswers = { ...answers };
      
      // If there are files, try to upload them
      if (Object.keys(files).length > 0) {
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
            
            // Show warning but continue with form submission
            toast({
              title: "Advertencia",
              description: `No se pudo subir el archivo ${file.name}. El formulario se enviará sin este archivo.`,
              variant: "default"
            });
            
            // Remove the file from answers if upload failed
            updatedAnswers[questionId] = `Error al subir: ${file.name}`;
          }
        }
      }

      console.log('Submitting form data (with or without files)');

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

  return {
    isSubmitting,
    handleSubmit
  };
}
