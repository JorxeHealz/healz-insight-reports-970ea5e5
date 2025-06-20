
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

      console.log('useFormSymptoms: Found answers:', answers);

      // Obtener las preguntas para entender el contexto
      const questionIds = answers.map(answer => answer.question_id);
      
      let questions = [];
      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('form_questions')
          .select('id, question_text, question_type, category')
          .in('id', questionIds);

        if (questionsError) {
          console.warn('useFormSymptoms: Error fetching questions (might be using text IDs):', questionsError);
          questions = [];
        } else {
          questions = questionsData || [];
        }
      } catch (err) {
        console.warn('useFormSymptoms: Failed to fetch questions, using fallback approach');
        questions = [];
      }

      // Filtrar respuestas que indican síntomas presentes
      const reportedSymptoms: string[] = [];

      answers.forEach(answer => {
        const question = questions?.find(q => q.id === answer.question_id);
        
        // Si encontramos la pregunta en la base de datos, usar el método original
        if (question && question.category === 'current_symptoms') {
          // Para preguntas de tipo boolean (Sí/No)
          if (question.question_type === 'boolean' && answer.answer === 'true') {
            const symptomMatch = extractSymptomFromQuestion(question.question_text);
            if (symptomMatch) {
              reportedSymptoms.push(symptomMatch);
            }
          }
          
          // Para preguntas de escala (consideramos valores altos como síntomas presentes)
          if (question.question_type === 'scale') {
            const scaleValue = parseInt(answer.answer);
            if (scaleValue >= 3) {
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
        } else {
          // Método alternativo: usar el question_id directamente para mapear síntomas
          const symptomFromId = extractSymptomFromQuestionId(answer.question_id, answer.answer);
          if (symptomFromId) {
            reportedSymptoms.push(symptomFromId);
          }
        }
      });

      // Remover duplicados
      const uniqueSymptoms = [...new Set(reportedSymptoms)];
      
      console.log('useFormSymptoms: Final reported symptoms:', uniqueSymptoms);
      return uniqueSymptoms;
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

// Nueva función para mapear síntomas basado en question_id
function extractSymptomFromQuestionId(questionId: string, answer: string): string | null {
  const lowerQuestionId = questionId.toLowerCase();
  const lowerAnswer = answer.toLowerCase();
  
  // Mapeo directo basado en question_id
  const questionIdToSymptom: Record<string, string> = {
    'fatiga_cronica': 'Fatiga crónica',
    'energia_baja': 'Energía baja',
    'libido_bajo': 'Libido bajo',
    'sueño_deficiente': 'Sueño deficiente',
    'cambios_peso': 'Cambios de peso',
    'perdida_cabello': 'Pérdida de cabello',
    'sofocos': 'Sofocos',
    'cambios_humor': 'Cambios de humor',
    'niebla_mental': 'Niebla mental',
    'dolor_pecho': 'Dolor en el pecho',
    'falta_aliento': 'Falta de aliento',
    'mareos': 'Mareos',
    'resistencia_disminuida': 'Resistencia disminuida',
    'motivacion_baja': 'Falta de motivación',
    'enfermedades_frecuentes': 'Enfermedades frecuentes',
    'dolor_articular': 'Dolor articular',
    'memoria_perdida': 'Pérdida de memoria',
    'concentracion_dificil': 'Dificultad para concentrarse',
    'intolerancia_temperatura': 'Intolerancia al calor o frío'
  };

  // Buscar coincidencia directa por question_id
  for (const [qId, symptom] of Object.entries(questionIdToSymptom)) {
    if (lowerQuestionId.includes(qId)) {
      // Verificar que la respuesta indique presencia del síntoma
      if (shouldReportSymptom(answer)) {
        return symptom;
      }
    }
  }

  // Búsqueda por palabras clave en question_id
  const keywordMappings: Record<string, string> = {
    'fatiga': 'Fatiga crónica',
    'energia': 'Energía baja',
    'libido': 'Libido bajo', 
    'sueño': 'Sueño deficiente',
    'peso': 'Cambios de peso',
    'cabello': 'Pérdida de cabello',
    'sofocos': 'Sofocos',
    'humor': 'Cambios de humor',
    'niebla': 'Niebla mental',
    'pecho': 'Dolor en el pecho',
    'aliento': 'Falta de aliento',
    'mareo': 'Mareos',
    'resistencia': 'Resistencia disminuida',
    'motivacion': 'Falta de motivación',
    'enfermedad': 'Enfermedades frecuentes',
    'articular': 'Dolor articular',
    'memoria': 'Pérdida de memoria',
    'concentra': 'Dificultad para concentrarse'
  };

  for (const [keyword, symptom] of Object.entries(keywordMappings)) {
    if (lowerQuestionId.includes(keyword)) {
      if (shouldReportSymptom(answer)) {
        return symptom;
      }
    }
  }

  return null;
}

// Función auxiliar para determinar si una respuesta indica presencia de síntoma
function shouldReportSymptom(answer: string): boolean {
  const lowerAnswer = answer.toLowerCase().trim();
  
  // Respuestas que indican presencia del síntoma
  const positiveAnswers = [
    'sí', 'si', 'yes', 'true', 
    'frecuentemente', 'siempre', 'always', 'frequently',
    'moderadamente', 'severamente', 'mucho', 'bastante'
  ];
  
  // Respuestas que indican ausencia del síntoma
  const negativeAnswers = [
    'no', 'never', 'nunca', 'false',
    'información no disponible', 'n/a', 'na',
    'rara vez', 'rarely', 'poco', 'nada'
  ];
  
  // Verificar respuestas positivas
  if (positiveAnswers.some(pos => lowerAnswer.includes(pos))) {
    return true;
  }
  
  // Verificar respuestas negativas
  if (negativeAnswers.some(neg => lowerAnswer.includes(neg))) {
    return false;
  }
  
  // Para respuestas numéricas (escalas), considerar >= 3 como positivo
  const numericValue = parseInt(lowerAnswer);
  if (!isNaN(numericValue)) {
    return numericValue >= 3;
  }
  
  // Para respuestas no categorizadas, considerar como positiva si no está vacía
  return lowerAnswer.length > 0 && lowerAnswer !== '0';
}
