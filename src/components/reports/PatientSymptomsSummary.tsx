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
      { id: 'da8f4aec-3e48-4f26-b256-d9a1b2a21948', label: 'Fatiga constante' },
      { id: '0e8d3a04-db88-462e-9f9d-98278026c1c1', label: 'Cambios de peso inexplicables' },
      { id: '67a1a14f-002e-49af-95ee-13dfa8685434', label: 'Antojos de azúcar' },
      { id: 'd7804d5c-30b5-4da7-91f7-785635190e08', label: 'Niebla mental' },
      { id: '1f75a5b8-2359-4d8b-b7c9-b007666e1d7c', label: 'Problemas de sueño' },
      { id: 'cb6a7723-bfd9-4772-b381-5e1855d57e27', label: 'Dolor articular' }
    ];

    const processedSymptoms: ProcessedSymptom[] = [];

    symptomQuestions.forEach(symptomQ => {
      const answer = answers.find(a => a.question_id === symptomQ.id);
      if (answer && answer.answer && answer.answer !== 'Nunca' && answer.answer !== 'No') {
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

    const weight = parseFloat(getAnswer('72c56c04-dddc-4e9a-80c1-adcc204ba45a')) || 0;
    const height = parseFloat(getAnswer('d4e3b709-0e4c-4d35-8666-137d4633db19')) || 0;
    const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : 0;

    const context: PatientContext = {
      age,
      gender: patient.gender,
      weight: getAnswer('72c56c04-dddc-4e9a-80c1-adcc204ba45a'),
      height: getAnswer('d4e3b709-0e4c-4d35-8666-137d4633db19'),
      bmi: weight && height ? calculateBMI(weight, height) : 0,
      stress_level: getAnswer('038ed544-5a89-4725-88a1-c9dcdb39d3cd'),
      main_goal: getAnswer('3eb197cb-d503-4c88-9332-b87e48a8e89f'),
      commitment: getAnswer('083566ff-697b-42ef-9125-6f7e61354337'),
      diet: getAnswer('f68af0c0-2c3d-457f-a062-0cd0c0b8304c'),
      exercise: getAnswer('c5d08f0a-8251-4e17-a912-cab74726c394'),
      sleep_hours: getAnswer('sleep_hours'),
      sleep_quality: getAnswer('2e13c541-d53d-4fed-929c-e88e1e8cb35e')
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