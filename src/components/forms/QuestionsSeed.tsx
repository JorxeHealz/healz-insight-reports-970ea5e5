
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { toast } from '../../hooks/use-toast';

const sampleQuestions = [
  // Síntomas
  {
    question_text: '¿Cómo calificaría su nivel de energía en los últimos 30 días?',
    question_type: 'select',
    required: true,
    order_number: 1,
    category: 'symptoms',
    options: ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto']
  },
  {
    question_text: '¿Ha experimentado cambios en su estado de ánimo recientemente?',
    question_type: 'boolean',
    required: true,
    order_number: 2,
    category: 'symptoms',
    options: null
  },
  {
    question_text: '¿Qué síntomas ha experimentado en el último mes? (Seleccione todos los que apliquen)',
    question_type: 'textarea',
    required: false,
    order_number: 3,
    category: 'symptoms',
    options: null
  },
  {
    question_text: '¿Cómo calificaría la calidad de su sueño?',
    question_type: 'select',
    required: true,
    order_number: 4,
    category: 'symptoms',
    options: ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente']
  },
  {
    question_text: '¿Cuántas horas duerme por noche en promedio?',
    question_type: 'number',
    required: true,
    order_number: 5,
    category: 'symptoms',
    options: null
  },

  // Estilo de vida
  {
    question_text: '¿Con qué frecuencia hace ejercicio por semana?',
    question_type: 'select',
    required: true,
    order_number: 6,
    category: 'lifestyle',
    options: ['Nunca', '1-2 veces', '3-4 veces', '5-6 veces', 'Diariamente']
  },
  {
    question_text: '¿Qué tipo de ejercicio prefiere?',
    question_type: 'textarea',
    required: false,
    order_number: 7,
    category: 'lifestyle',
    options: null
  },
  {
    question_text: '¿Cómo describiría su dieta actual?',
    question_type: 'select',
    required: true,
    order_number: 8,
    category: 'lifestyle',
    options: ['Muy mala', 'Necesita mejoras', 'Equilibrada', 'Saludable', 'Muy saludable']
  },
  {
    question_text: '¿Consume alcohol regularmente?',
    question_type: 'boolean',
    required: true,
    order_number: 9,
    category: 'lifestyle',
    options: null
  },
  {
    question_text: '¿Fuma o ha fumado en el pasado?',
    question_type: 'select',
    required: true,
    order_number: 10,
    category: 'lifestyle',
    options: ['Nunca', 'Ex-fumador', 'Ocasionalmente', 'Regularmente']
  },

  // Historia médica
  {
    question_text: '¿Tiene alguna condición médica diagnosticada?',
    question_type: 'textarea',
    required: false,
    order_number: 11,
    category: 'medical_history',
    options: null
  },
  {
    question_text: '¿Qué medicamentos toma actualmente?',
    question_type: 'textarea',
    required: false,
    order_number: 12,
    category: 'medical_history',
    options: null
  },
  {
    question_text: '¿Tiene alergias conocidas?',
    question_type: 'textarea',
    required: false,
    order_number: 13,
    category: 'medical_history',
    options: null
  },
  {
    question_text: '¿Ha sido hospitalizado en los últimos 5 años?',
    question_type: 'boolean',
    required: true,
    order_number: 14,
    category: 'medical_history',
    options: null
  },
  {
    question_text: '¿Hay antecedentes familiares de enfermedades importantes?',
    question_type: 'textarea',
    required: false,
    order_number: 15,
    category: 'medical_history',
    options: null
  },

  // Archivos
  {
    question_text: 'Suba sus análisis de sangre más recientes (opcional)',
    question_type: 'file',
    required: false,
    order_number: 16,
    category: 'files',
    options: null
  },
  {
    question_text: 'Suba cualquier otro documento médico relevante (opcional)',
    question_type: 'file',
    required: false,
    order_number: 17,
    category: 'files',
    options: null
  }
];

export const QuestionsSeed = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedQuestions = async () => {
    setIsSeeding(true);
    try {
      // Primero verificar si ya hay preguntas
      const { data: existingQuestions } = await supabase
        .from('form_questions')
        .select('id')
        .limit(1);

      if (existingQuestions && existingQuestions.length > 0) {
        toast({
          title: "Las preguntas ya existen",
          description: "Ya hay preguntas en la base de datos. No se insertarán duplicadas."
        });
        return;
      }

      // Insertar las preguntas de muestra
      const { error } = await supabase
        .from('form_questions')
        .insert(sampleQuestions);

      if (error) {
        console.error('Error seeding questions:', error);
        toast({
          title: "Error",
          description: "No se pudieron insertar las preguntas de muestra",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Preguntas insertadas",
        description: `Se han insertado ${sampleQuestions.length} preguntas de muestra en la base de datos`
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al insertar las preguntas",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-healz-cream/50">
      <h3 className="text-lg font-semibold text-healz-brown mb-2">
        Datos de Prueba - Preguntas del Formulario
      </h3>
      <p className="text-sm text-healz-brown/70 mb-4">
        Inserta preguntas de muestra para probar el formulario público. 
        Incluye preguntas para síntomas, estilo de vida, historia médica y archivos.
      </p>
      <Button 
        onClick={seedQuestions}
        disabled={isSeeding}
        className="bg-healz-teal hover:bg-healz-teal/90"
      >
        {isSeeding ? 'Insertando...' : 'Insertar Preguntas de Muestra'}
      </Button>
    </div>
  );
};
