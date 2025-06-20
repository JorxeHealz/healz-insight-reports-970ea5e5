
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useFormSymptoms = (formId: string | undefined) => {
  return useQuery({
    queryKey: ['form-symptoms', formId],
    queryFn: async (): Promise<string[]> => {
      if (!formId) {
        console.log('useFormSymptoms: No formId provided');
        return [];
      }

      console.log('useFormSymptoms: Fetching symptoms for form:', formId);

      // Obtener todas las respuestas del formulario
      const { data: answers, error } = await supabase
        .from('questionnaire_answers')
        .select('answer, question_id')
        .eq('form_id', formId);

      if (error) {
        console.error('useFormSymptoms: Error fetching form answers:', error);
        throw error;
      }

      if (!answers || answers.length === 0) {
        console.log('useFormSymptoms: No answers found for form');
        return [];
      }

      // Obtener las preguntas para entender el contexto
      const questionIds = answers.map(answer => answer.question_id);
      const { data: questions, error: questionsError } = await supabase
        .from('form_questions')
        .select('id, question_text, question_type, category')
        .in('id', questionIds);

      if (questionsError) {
        console.error('useFormSymptoms: Error fetching questions:', questionsError);
        throw questionsError;
      }

      // Filtrar respuestas que indican síntomas presentes
      const reportedSymptoms: string[] = [];

      answers.forEach(answer => {
        const question = questions?.find(q => q.id === answer.question_id);
        if (!question) return;

        // Buscar síntomas en la categoría de síntomas actuales
        if (question.category === 'current_symptoms') {
          // Para preguntas de tipo boolean (Sí/No)
          if (question.question_type === 'boolean' && answer.answer === 'true') {
            // Extraer el síntoma del texto de la pregunta
            const symptomMatch = extractSymptomFromQuestion(question.question_text);
            if (symptomMatch) {
              reportedSymptoms.push(symptomMatch);
            }
          }
          
          // Para preguntas de escala (consideramos valores altos como síntomas presentes)
          if (question.question_type === 'scale') {
            const scaleValue = parseInt(answer.answer);
            if (scaleValue >= 3) { // Umbral para considerar síntoma presente
              const symptomMatch = extractSymptomFromQuestion(question.question_text);
              if (symptomMatch) {
                reportedSymptoms.push(symptomMatch);
              }
            }
          }

          // Para preguntas de frecuencia
          if (question.question_type === 'frequency') {
            const frequency = answer.answer.toLowerCase();
            if (frequency === 'frecuentemente' || frequency === 'siempre') {
              const symptomMatch = extractSymptomFromQuestion(question.question_text);
              if (symptomMatch) {
                reportedSymptoms.push(symptomMatch);
              }
            }
          }
        }
      });

      console.log('useFormSymptoms: Found reported symptoms:', reportedSymptoms);
      return reportedSymptoms;
    },
    enabled: !!formId
  });
};

// Función para extraer síntomas del texto de la pregunta
function extractSymptomFromQuestion(questionText: string): string | null {
  const lowerText = questionText.toLowerCase();
  
  // Mapeo de palabras clave a síntomas
  const symptomKeywords: Record<string, string> = {
    'energía baja': 'Energía baja',
    'cansancio': 'Energía baja',
    'fatiga': 'Energía baja',
    'libido': 'Libido bajo',
    'deseo sexual': 'Libido bajo',
    'sueño': 'Sueño deficiente',
    'dormir': 'Sueño deficiente',
    'peso': 'Cambios de peso',
    'cabello': 'Pérdida de cabello',
    'concentra': 'Dificultad para concentrarse',
    'niebla mental': 'Niebla mental',
    'memoria': 'Pérdida de memoria',
    'humor': 'Cambios de humor',
    'ánimo': 'Cambios de humor',
    'sofocos': 'Sofocos',
    'calor': 'Intolerancia al calor o frío',
    'frío': 'Intolerancia al calor o frío',
    'antojos': 'Antojos de comida',
    'resistencia': 'Resistencia disminuida',
    'motivación': 'Falta de motivación',
    'enfermedad': 'Enfermedades frecuentes',
    'dolor pecho': 'Dolor en el pecho',
    'falta aire': 'Falta de aliento',
    'mareo': 'Mareos',
    'náusea': 'Náuseas',
    'sudor': 'Sudoración',
    'ejercicio': 'Poca tolerancia al ejercicio',
    'grasa corporal': 'Exceso de grasa corporal',
    'ronquidos': 'Ronquidos',
    'piel': 'Problemas de piel',
    'articular': 'Dolor articular',
    'espalda': 'Dolor de espalda',
    'autoestima': 'Baja autoestima',
    'presión arterial': 'Presión arterial alta',
    'glucosa': 'Disregulación de glucosa en sangre',
    'confusión': 'Confusión',
    'problemas': 'Dificultad para resolver problemas',
    'lenguaje': 'Problemas de lenguaje',
    'coordinación': 'Coordinación deficiente',
    'comportamiento': 'Cambios en el comportamiento',
    'disfunción eréctil': 'Disfunción eréctil',
    'sequedad vaginal': 'Sequedad vaginal',
    'dolor relaciones': 'Dolor durante las relaciones',
    'infertilidad': 'Infertilidad',
    'fragilidad': 'Fragilidad',
    'deterioro cognitivo': 'Deterioro cognitivo'
  };

  // Buscar coincidencias de palabras clave
  for (const [keyword, symptom] of Object.entries(symptomKeywords)) {
    if (lowerText.includes(keyword)) {
      return symptom;
    }
  }

  return null;
}
