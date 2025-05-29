
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { FormQuestion, FormSection, FORM_SECTIONS } from '../types/forms';

export const useFormQuestions = () => {
  return useQuery({
    queryKey: ['form-questions'],
    queryFn: async (): Promise<FormSection[]> => {
      console.log('Fetching form questions');
      
      const { data, error } = await supabase
        .from('form_questions')
        .select('*')
        .eq('is_active', true)
        .order('order_number', { ascending: true });

      if (error) {
        console.error('Error fetching form questions:', error);
        throw error;
      }

      // Agrupar preguntas por categoría/sección
      const questionsByCategory = (data || []).reduce((acc, question) => {
        if (!acc[question.category]) {
          acc[question.category] = [];
        }
        acc[question.category].push(question as FormQuestion);
        return acc;
      }, {} as Record<string, FormQuestion[]>);

      // Convertir a FormSection array manteniendo el orden deseado
      const sectionOrder = [
        'general_info',
        'medical_history', 
        'current_symptoms',
        'lifestyle',
        'goals',
        'files',
        'consent'
      ];

      const sections: FormSection[] = sectionOrder
        .filter(sectionId => questionsByCategory[sectionId]?.length > 0)
        .map(sectionId => ({
          id: sectionId,
          title: FORM_SECTIONS[sectionId as keyof typeof FORM_SECTIONS],
          questions: questionsByCategory[sectionId] || []
        }));

      return sections;
    }
  });
};
