import React, { useState } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { toast } from '../../hooks/use-toast';
export const QuestionsSeed = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const seedQuestions = async () => {
    setIsSeeding(true);
    try {
      // Verificar si ya hay preguntas activas
      const {
        data: existingQuestions
      } = await supabase.from('form_questions').select('id').eq('is_active', true).limit(1);
      if (existingQuestions && existingQuestions.length > 0) {
        toast({
          title: "Las preguntas ya existen",
          description: "Ya hay preguntas activas en la base de datos."
        });
        return;
      }
      toast({
        title: "Preguntas ya insertadas",
        description: "El formulario completo de diagnóstico inicial Healz ya está disponible con 47 preguntas organizadas en 6 secciones: Información General, Historial Médico, Síntomas Actuales, Estilo de Vida, Objetivos de Salud y Consentimiento."
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al verificar las preguntas",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };
  return;
};