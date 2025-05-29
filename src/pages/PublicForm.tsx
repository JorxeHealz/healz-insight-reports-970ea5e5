import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormByToken } from '../hooks/usePatientForms';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { FormQuestion, FormSubmissionData } from '../types/forms';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from '../hooks/use-toast';
import { Progress } from '../components/ui/progress';
import { RadioQuestion } from '../components/forms/questions/RadioQuestion';
import { CheckboxMultipleQuestion } from '../components/forms/questions/CheckboxMultipleQuestion';
import { ScaleQuestion } from '../components/forms/questions/ScaleQuestion';
import { FrequencyQuestion } from '../components/forms/questions/FrequencyQuestion';

const PublicForm = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  console.log('PublicForm component loaded, token:', token);

  // Obtener datos del formulario
  const { data: formData, isLoading: formLoading, error: formError } = useFormByToken(token || '');

  console.log('Form data:', formData);
  console.log('Form loading:', formLoading);
  console.log('Form error:', formError);

  // Agrupar preguntas por categoría
  const questionsByCategory = formData?.questions?.reduce((acc: Record<string, FormQuestion[]>, question: FormQuestion) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {}) || {};

  const categories = Object.keys(questionsByCategory);
  const categoryTitles = {
    general_info: 'Información General',
    medical_history: 'Historia Médica',
    current_symptoms: 'Síntomas Actuales',
    lifestyle: 'Estilo de Vida',
    goals: 'Objetivos de Salud',
    files: 'Archivos Médicos',
    consent: 'Consentimiento'
  };

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
      // Subir archivos y obtener URLs
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
          
          // Actualizar la respuesta con la URL del archivo
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

      // Enviar datos del formulario
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

  const renderQuestion = (question: FormQuestion) => {
    const value = answers[question.id] || '';

    switch (question.question_type) {
      case 'radio':
        return (
          <RadioQuestion
            question={question}
            value={value}
            onChange={(val) => handleAnswerChange(question.id, val)}
          />
        );

      case 'checkbox_multiple':
        return (
          <CheckboxMultipleQuestion
            question={question}
            value={Array.isArray(value) ? value : []}
            onChange={(val) => handleAnswerChange(question.id, val)}
          />
        );

      case 'scale':
        return (
          <ScaleQuestion
            question={question}
            value={typeof value === 'number' ? value : 0}
            onChange={(val) => handleAnswerChange(question.id, val)}
          />
        );

      case 'frequency':
        return (
          <FrequencyQuestion
            question={question}
            value={value}
            onChange={(val) => handleAnswerChange(question.id, val)}
          />
        );

      case 'text':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <Input
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Escriba su respuesta..."
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
              placeholder="Ingrese un número..."
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <Textarea
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Escriba su respuesta detallada..."
              rows={4}
            />
          </div>
        );

      case 'select':
        const selectOptions = Array.isArray(question.options) ? question.options : [];
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <Select value={value} onValueChange={(val) => handleAnswerChange(question.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción..." />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={value === true}
                onCheckedChange={(checked) => handleAnswerChange(question.id, checked)}
              />
              <span>Sí</span>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleFileChange(question.id, file);
              }}
            />
            {files[question.id] && (
              <p className="text-sm text-healz-green">
                Archivo seleccionado: {files[question.id].name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-healz-brown">
              {question.question_text}
              {question.required && <span className="text-healz-red ml-1">*</span>}
            </label>
            <Input value={value} onChange={(e) => handleAnswerChange(question.id, e.target.value)} />
          </div>
        );
    }
  };

  if (formLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-healz-cream">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
          <p className="mt-2 text-healz-brown">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (formError) {
    console.error('Form error details:', formError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-healz-cream">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold text-healz-red mb-2">Error al cargar formulario</h2>
            <p className="text-healz-brown/70 mb-4">
              {formError.message || 'Ocurrió un error al cargar el formulario.'}
            </p>
            <p className="text-sm text-healz-brown/50">
              Token: {token}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData || !formData.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-healz-cream">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold text-healz-red mb-2">Formulario no encontrado</h2>
            <p className="text-healz-brown/70">
              El formulario que está buscando no existe o ha expirado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const form = formData.form;

  if (form.status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-healz-cream">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold text-healz-green mb-2">Formulario ya completado</h2>
            <p className="text-healz-brown/70">
              Este formulario ya ha sido completado anteriormente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (form.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-healz-cream">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold text-healz-red mb-2">Formulario expirado</h2>
            <p className="text-healz-brown/70">
              Este formulario ha expirado y ya no puede ser completado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si no hay preguntas, mostrar mensaje
  if (!formData.questions || formData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-healz-cream">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold text-healz-orange mb-2">Formulario en configuración</h2>
            <p className="text-healz-brown/70">
              Este formulario aún no tiene preguntas configuradas. Por favor, contacte con el administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCategory = categories[currentStep];
  const currentQuestions = questionsByCategory[currentCategory] || [];
  const progress = categories.length > 0 ? ((currentStep + 1) / categories.length) * 100 : 0;
  const isLastStep = currentStep === categories.length - 1;
  const canProceed = validateCurrentStep();

  return (
    <div className="min-h-screen bg-healz-cream py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Formulario de Salud - {form.patient.first_name} {form.patient.last_name}
            </CardTitle>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-healz-brown/70">
                Paso {currentStep + 1} de {categories.length}: {categoryTitles[currentCategory as keyof typeof categoryTitles]}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentQuestions.map((question) => (
              <div key={question.id}>
                {renderQuestion(question)}
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="bg-healz-green hover:bg-healz-green/90"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed}
                  className="bg-healz-teal hover:bg-healz-teal/90"
                >
                  Siguiente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicForm;
