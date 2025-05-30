
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, FileText, Calendar, User } from 'lucide-react';
import { PatientForm } from '../../types/forms';
import { FORM_SECTIONS } from '../../types/forms';

interface FormResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: PatientForm | null;
}

interface FormAnswer {
  id: string;
  question_id: string;
  answer: string;
  answer_type: string;
  file_url?: string;
  question: {
    question_text: string;
    question_type: string;
    category: string;
    options?: any;
  };
}

export const FormResultsModal = ({ open, onOpenChange, form }: FormResultsModalProps) => {
  const { data: answers, isLoading, error } = useQuery({
    queryKey: ['form-answers', form?.id],
    queryFn: async (): Promise<FormAnswer[]> => {
      if (!form?.id) return [];

      const { data, error } = await supabase
        .from('questionnaire_answers')
        .select(`
          id,
          question_id,
          answer,
          answer_type,
          file_url,
          form_questions!inner(
            question_text,
            question_type,
            category,
            options
          )
        `)
        .eq('form_id', form.id)
        .order('question_id');

      if (error) {
        console.error('Error fetching form answers:', error);
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        question_id: item.question_id,
        answer: item.answer,
        answer_type: item.answer_type,
        file_url: item.file_url,
        question: item.form_questions
      })) || [];
    },
    enabled: !!form?.id && open
  });

  const formatAnswer = (answer: FormAnswer) => {
    const { answer: value, answer_type, file_url, question } = answer;

    if (answer_type === 'file' && file_url) {
      return (
        <a 
          href={file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-healz-blue hover:underline flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          Ver archivo adjunto
        </a>
      );
    }

    if (question.question_type === 'boolean') {
      return value === 'true' ? 'Sí' : 'No';
    }

    if (question.question_type === 'scale') {
      const options = question.options as { min: number; max: number; label: string } | undefined;
      if (options) {
        return `${value} / ${options.max} (${options.label})`;
      }
    }

    if (question.question_type === 'frequency') {
      return value;
    }

    return value || 'Sin respuesta';
  };

  const answersByCategory = answers?.reduce((acc, answer) => {
    const category = answer.question.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(answer);
    return acc;
  }, {} as Record<string, FormAnswer[]>) || {};

  if (!form) return null;

  const formatPatientName = (patient: any) => {
    if (!patient) return 'Paciente sin datos';
    const firstName = patient.first_name || '';
    const lastName = patient.last_name || '';
    return [firstName, lastName].filter(Boolean).join(' ') || 'Sin nombre';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Resultados del Formulario - {formatPatientName(form.patient)}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-healz-brown/70">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Completado: {form.completed_at ? new Date(form.completed_at).toLocaleDateString('es-ES') : 'No completado'}
            </div>
            <Badge variant={form.status === 'completed' ? 'default' : 'secondary'}>
              {form.status === 'completed' ? 'Completado' : 'Pendiente'}
            </Badge>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Cargando respuestas...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Error al cargar las respuestas del formulario
          </div>
        ) : !answers || answers.length === 0 ? (
          <div className="text-center py-8 text-healz-brown/70">
            No hay respuestas disponibles para este formulario
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(answersByCategory).map(([category, categoryAnswers]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg text-healz-brown">
                    {FORM_SECTIONS[category as keyof typeof FORM_SECTIONS] || category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryAnswers.map((answer) => (
                      <div key={answer.id} className="border-b border-healz-cream pb-3 last:border-b-0">
                        <h4 className="font-medium text-healz-brown mb-2">
                          {answer.question.question_text}
                        </h4>
                        <div className="text-healz-brown/80 bg-healz-cream/30 p-3 rounded-md">
                          {formatAnswer(answer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
