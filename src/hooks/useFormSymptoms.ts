
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
  
  // Mapeo directo y específico de preguntas del formulario a síntomas de paneles
  const directMappings: Record<string, string> = {
    'fatiga constante': 'Energía baja',
    'sensación de "niebla mental"': 'Niebla mental',
    'niebla mental': 'Niebla mental',
    'lentitud cognitiva': 'Niebla mental',
    'aumento o pérdida de peso inexplicable': 'Cambios de peso',
    'hambre constante o antojos de azúcar': 'Antojos de comida',
    'problemas para dormir': 'Sueño deficiente',
    'duermes al menos 7 horas': 'Sueño deficiente', // pregunta inversa
    'baja libido': 'Libido bajo',
    'disfunción sexual': 'Libido bajo',
    'pérdida de cabello': 'Pérdida de cabello',
    'caída del cabello': 'Pérdida de cabello',
    'intolerancia al frío': 'Intolerancia al calor o frío',
    'intolerancia al calor': 'Intolerancia al calor o frío',
    'cambios de humor': 'Cambios de humor',
    'falta de concentración': 'Dificultad para concentrarse',
    'dificultad para concentrarse': 'Dificultad para concentrarse',
    'problemas de memoria': 'Pérdida de memoria',
    'distensión abdominal': 'Hinchazón',
    'reflujo o acidez': 'Reflujo',
    'estreñimiento': 'Problemas digestivos',
    'diarrea frecuente': 'Problemas digestivos',
    'dolor articular': 'Dolor articular',
    'dolor en articulaciones': 'Dolor articular',
    'dolor muscular': 'Dolor muscular',
    'fatiga después de ejercicio': 'Poca tolerancia al ejercicio',
    'resistencia disminuida': 'Resistencia disminuida',
    'falta de motivación': 'Falta de motivación',
    'enfermedades frecuentes': 'Enfermedades frecuentes',
    'inmunidad disminuida': 'Enfermedades frecuentes',
    'ansiedad': 'Ansiedad'
  };

  // Mapeo de palabras clave flexibles
  const keywordMappings: Record<string, string> = {
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
    'niebla': 'Niebla mental',
    'memoria': 'Pérdida de memoria',
    'humor': 'Cambios de humor',
    'ánimo': 'Cambios de humor',
    'sofocos': 'Sofocos',
    'calor': 'Intolerancia al calor o frío',
    'frío': 'Intolerancia al calor o frío',
    'antojos': 'Antojos de comida',
    'azúcar': 'Antojos de comida',
    'hambre': 'Antojos de comida',
    'resistencia': 'Resistencia disminuida',
    'motivación': 'Falta de motivación',
    'enfermedad': 'Enfermedades frecuentes',
    'inmunidad': 'Enfermedades frecuentes',
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
    'deterioro cognitivo': 'Deterioro cognitivo',
    'distensión': 'Hinchazón',
    'reflujo': 'Reflujo',
    'acidez': 'Reflujo',
    'estreñimiento': 'Problemas digestivos',
    'diarrea': 'Problemas digestivos'
  };

  // Primero buscar coincidencias directas (más específicas)
  for (const [exactText, symptom] of Object.entries(directMappings)) {
    if (lowerText.includes(exactText)) {
      return symptom;
    }
  }

  // Luego buscar coincidencias por palabras clave (más flexibles)
  for (const [keyword, symptom] of Object.entries(keywordMappings)) {
    if (lowerText.includes(keyword)) {
      return symptom;
    }
  }

  return null;
}

// Nueva función para mapear síntomas basado en question_id
function extractSymptomFromQuestionId(questionId: string, answer: string): string | null {
  const lowerQuestionId = questionId.toLowerCase();
  
  // Mapeo directo basado en question_id específicos encontrados en la base de datos
  const questionIdToSymptom: Record<string, string> = {
    // IDs específicos encontrados en la base de datos
    '1011009a-80c7-4c74-ad7b-5b79fcf5e0fb': 'Ansiedad',
    'cb6a7723-bfd9-4772-b381-5e1855d57e27': 'Dolor articular',
    'e8541354-877e-4d3d-82a0-caa6e02a5781': 'Pérdida de cabello',
    '57ea4c0f-25b2-4848-a9b9-d6f70fb078ce': 'Sueño deficiente',
    
    // Mapeos genéricos por palabras clave en ID
    'fatiga_cronica': 'Energía baja',
    'fatiga_constante': 'Energía baja',
    'energia_baja': 'Energía baja',
    'libido_bajo': 'Libido bajo',
    'disfuncion_sexual': 'Libido bajo',
    'sueño_deficiente': 'Sueño deficiente',
    'problemas_dormir': 'Sueño deficiente',
    'cambios_peso': 'Cambios de peso',
    'peso_inexplicable': 'Cambios de peso',
    'perdida_cabello': 'Pérdida de cabello',
    'caida_cabello': 'Pérdida de cabello',
    'sofocos': 'Sofocos',
    'cambios_humor': 'Cambios de humor',
    'humor_variable': 'Cambios de humor',
    'niebla_mental': 'Niebla mental',
    'lentitud_cognitiva': 'Niebla mental',
    'dolor_pecho': 'Dolor en el pecho',
    'falta_aliento': 'Falta de aliento',
    'mareos': 'Mareos',
    'resistencia_disminuida': 'Resistencia disminuida',
    'motivacion_baja': 'Falta de motivación',
    'enfermedades_frecuentes': 'Enfermedades frecuentes',
    'inmunidad_baja': 'Enfermedades frecuentes',
    'dolor_articular': 'Dolor articular',
    'dolor_muscular': 'Dolor muscular',
    'memoria_perdida': 'Pérdida de memoria',
    'problemas_memoria': 'Pérdida de memoria',
    'concentracion_dificil': 'Dificultad para concentrarse',
    'falta_concentracion': 'Dificultad para concentrarse',
    'intolerancia_temperatura': 'Intolerancia al calor o frío',
    'intolerancia_frio': 'Intolerancia al calor o frío',
    'intolerancia_calor': 'Intolerancia al calor o frío',
    'antojos_azucar': 'Antojos de comida',
    'hambre_constante': 'Antojos de comida',
    'distension_abdominal': 'Hinchazón',
    'reflujo_acidez': 'Reflujo',
    'estreñimiento': 'Problemas digestivos',
    'diarrea_frecuente': 'Problemas digestivos',
    'ansiedad': 'Ansiedad'
  };

  // Buscar coincidencia directa por question_id
  for (const [qId, symptom] of Object.entries(questionIdToSymptom)) {
    if (lowerQuestionId.includes(qId)) {
      if (shouldReportSymptom(answer)) {
        return symptom;
      }
    }
  }

  // Búsqueda por palabras clave flexibles en question_id
  const flexibleKeywords: Record<string, string> = {
    'fatiga': 'Energía baja',
    'cansancio': 'Energía baja',
    'energia': 'Energía baja',
    'libido': 'Libido bajo',
    'sexual': 'Libido bajo',
    'sueño': 'Sueño deficiente',
    'dormir': 'Sueño deficiente',
    'peso': 'Cambios de peso',
    'cabello': 'Pérdida de cabello',
    'sofocos': 'Sofocos',
    'humor': 'Cambios de humor',
    'animo': 'Cambios de humor',
    'niebla': 'Niebla mental',
    'mental': 'Niebla mental',
    'cognitiva': 'Niebla mental',
    'pecho': 'Dolor en el pecho',
    'aliento': 'Falta de aliento',
    'respiracion': 'Falta de aliento',
    'mareo': 'Mareos',
    'resistencia': 'Resistencia disminuida',
    'motivacion': 'Falta de motivación',
    'enfermedad': 'Enfermedades frecuentes',
    'inmunidad': 'Enfermedades frecuentes',
    'articular': 'Dolor articular',
    'articulaciones': 'Dolor articular',
    'muscular': 'Dolor muscular',
    'memoria': 'Pérdida de memoria',
    'concentra': 'Dificultad para concentrarse',
    'atencion': 'Dificultad para concentrarse',
    'frio': 'Intolerancia al calor o frío',
    'calor': 'Intolerancia al calor o frío',
    'temperatura': 'Intolerancia al calor o frío',
    'antojos': 'Antojos de comida',
    'azucar': 'Antojos de comida',
    'hambre': 'Antojos de comida',
    'distension': 'Hinchazón',
    'reflujo': 'Reflujo',
    'acidez': 'Reflujo',
    'estreñimiento': 'Problemas digestivos',
    'diarrea': 'Problemas digestivos',
    'ansiedad': 'Ansiedad',
    'ansioso': 'Ansiedad',
    'nervioso': 'Ansiedad'
  };

  for (const [keyword, symptom] of Object.entries(flexibleKeywords)) {
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
    'frecuentemente', 'frequently', 'siempre', 'always',
    'moderadamente', 'severamente', 'mucho', 'bastante',
    'a menudo', 'regularmente', 'muy frecuentemente',
    'constantemente', 'a veces', 'sometimes', 'ocasionalmente',
    'most of the time', 'la mayoría del tiempo', 'casi siempre'
  ];
  
  // Respuestas que indican ausencia del síntoma
  const negativeAnswers = [
    'no', 'never', 'nunca', 'false',
    'información no disponible', 'n/a', 'na',
    'rara vez', 'rarely', 'poco', 'nada',
    'casi nunca', 'ninguna vez', 'jamás'
  ];
  
  // Verificar respuestas positivas primero
  if (positiveAnswers.some(pos => lowerAnswer.includes(pos))) {
    return true;
  }
  
  // Verificar respuestas negativas
  if (negativeAnswers.some(neg => lowerAnswer.includes(neg))) {
    return false;
  }
  
  // Para respuestas numéricas (escalas), considerar >= 2 como positivo (más sensible)
  const numericValue = parseInt(lowerAnswer);
  if (!isNaN(numericValue)) {
    return numericValue >= 2;
  }
  
  // Para rangos de escalas como "2-3", tomar el primer número
  const rangeMatch = lowerAnswer.match(/(\d+)-\d+/);
  if (rangeMatch) {
    const firstValue = parseInt(rangeMatch[1]);
    return firstValue >= 2;
  }
  
  // Para respuestas no categorizadas que no estén vacías, considerar como positiva
  // siempre que no contengan palabras claramente negativas
  if (lowerAnswer.length > 0 && lowerAnswer !== '0') {
    // Excluir respuestas que claramente indican ausencia
    const clearlyNegative = ['ninguno', 'ninguna', 'nada', 'no aplica', 'no aplicable'];
    const isClearlyNegative = clearlyNegative.some(neg => lowerAnswer.includes(neg));
    return !isClearlyNegative;
  }
  
  return false;
}
