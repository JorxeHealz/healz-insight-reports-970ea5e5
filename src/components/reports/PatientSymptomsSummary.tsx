import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Patient } from '../../types/supabase';
import { PatientForm } from '../../types/forms';

interface PatientSymptomsSummaryProps {
  patient: Patient;
  selectedForm: PatientForm | null | undefined;
}

interface FormAnswer {
  id: string;
  question_id: string;
  answer: string;
  answer_type: string;
}

interface ProcessedSymptom {
  symptom: string;
  intensity: string;
  badge_variant: 'default' | 'secondary' | 'destructive';
}

interface PatientContext {
  age: number;
  gender: string;
  weight: string;
  height: string;
  bmi: number;
  stress_level: string;
  main_goal: string;
  commitment: string;
  diet: string;
  exercise: string;
  sleep_hours: string;
  sleep_quality: string;
}

const getIntensityBadge = (intensity: string): 'default' | 'secondary' | 'destructive' => {
  switch (intensity.toLowerCase()) {
    case 'siempre':
    case 'frecuentemente':
      return 'destructive';
    case 'a veces':
      return 'secondary';
    case 'rara vez':
    case 'nunca':
      return 'default';
    default:
      return 'default';
  }
};

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const PatientSymptomsSummary = ({ patient, selectedForm }: PatientSymptomsSummaryProps) => {
  const [formAnswers, setFormAnswers] = useState<FormAnswer[]>([]);
  const [symptoms, setSymptoms] = useState<ProcessedSymptom[]>([]);
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!selectedForm?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: answers, error } = await supabase
          .from('questionnaire_answers')
          .select('id, question_id, answer, answer_type')
          .eq('form_id', selectedForm.id)
          .eq('patient_id', patient.id);

        if (error) throw error;

        setFormAnswers(answers || []);
        processSymptoms(answers || []);
        processPatientContext(answers || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [selectedForm?.id, patient.id]);

  const processSymptoms = (answers: FormAnswer[]) => {
    const symptomQuestions = [
      { id: 'fatigue', label: 'Fatiga constante' },
      { id: 'weight_changes', label: 'Cambios de peso inexplicables' },
      { id: 'sugar_cravings', label: 'Antojos de azúcar' },
      { id: 'brain_fog', label: 'Niebla mental' },
      { id: 'mood_swings', label: 'Cambios de humor' },
      { id: 'sleep_issues', label: 'Problemas de sueño' },
      { id: 'digestive_issues', label: 'Problemas digestivos' },
      { id: 'joint_pain', label: 'Dolor articular' },
      { id: 'headaches', label: 'Dolores de cabeza' },
      { id: 'low_libido', label: 'Libido bajo' }
    ];

    const processedSymptoms: ProcessedSymptom[] = [];

    symptomQuestions.forEach(symptomQ => {
      const answer = answers.find(a => a.question_id === symptomQ.id);
      if (answer && answer.answer && answer.answer !== 'Nunca') {
        processedSymptoms.push({
          symptom: symptomQ.label,
          intensity: answer.answer,
          badge_variant: getIntensityBadge(answer.answer)
        });
      }
    });

    setSymptoms(processedSymptoms);
  };

  const processPatientContext = (answers: FormAnswer[]) => {
    const getAnswer = (questionId: string) => 
      answers.find(a => a.question_id === questionId)?.answer || '';

    const weight = parseFloat(getAnswer('weight')) || 0;
    const height = parseFloat(getAnswer('height')) || 0;
    const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : 0;

    const context: PatientContext = {
      age,
      gender: patient.gender,
      weight: getAnswer('weight'),
      height: getAnswer('height'),
      bmi: weight && height ? calculateBMI(weight, height) : 0,
      stress_level: getAnswer('stress_level'),
      main_goal: getAnswer('main_goal'),
      commitment: getAnswer('commitment_level'),
      diet: getAnswer('diet_type'),
      exercise: getAnswer('exercise_frequency'),
      sleep_hours: getAnswer('sleep_hours'),
      sleep_quality: getAnswer('sleep_quality')
    };

    setPatientContext(context);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-healz-brown/70">
            Cargando contexto del paciente...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedForm) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-healz-brown/70">
            No hay formulario seleccionado para mostrar el contexto del paciente
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Síntomas reportados */}
      {symptoms.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md text-healz-brown">Síntomas reportados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-healz-brown">{symptom.symptom}:</span>
                  <Badge variant={symptom.badge_variant} className="text-xs">
                    {symptom.intensity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contexto del paciente */}
      {patientContext && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md text-healz-brown">Información del paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-healz-brown/70">Edad:</span>
                <div className="text-healz-brown">{patientContext.age} años</div>
              </div>
              <div>
                <span className="font-medium text-healz-brown/70">Género:</span>
                <div className="text-healz-brown">{patientContext.gender}</div>
              </div>
              {patientContext.bmi > 0 && (
                <div>
                  <span className="font-medium text-healz-brown/70">IMC:</span>
                  <div className="text-healz-brown">{patientContext.bmi}</div>
                </div>
              )}
              {patientContext.stress_level && (
                <div>
                  <span className="font-medium text-healz-brown/70">Nivel de estrés:</span>
                  <div className="text-healz-brown">{patientContext.stress_level}/10</div>
                </div>
              )}
              {patientContext.main_goal && (
                <div>
                  <span className="font-medium text-healz-brown/70">Objetivo principal:</span>
                  <div className="text-healz-brown">{patientContext.main_goal}</div>
                </div>
              )}
              {patientContext.commitment && (
                <div>
                  <span className="font-medium text-healz-brown/70">Compromiso:</span>
                  <div className="text-healz-brown">{patientContext.commitment}/10</div>
                </div>
              )}
              {patientContext.sleep_quality && (
                <div>
                  <span className="font-medium text-healz-brown/70">Calidad del sueño:</span>
                  <div className="text-healz-brown">{patientContext.sleep_quality}/10</div>
                </div>
              )}
              {patientContext.exercise && (
                <div>
                  <span className="font-medium text-healz-brown/70">Ejercicio:</span>
                  <div className="text-healz-brown">{patientContext.exercise}</div>
                </div>
              )}
              {patientContext.diet && (
                <div>
                  <span className="font-medium text-healz-brown/70">Tipo de dieta:</span>
                  <div className="text-healz-brown">{patientContext.diet}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};