
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Layout } from '../components/Layout';
import { supabase } from '../lib/supabase';
import { PatientSelector } from '../components/reports/PatientSelector';
import { DataReview } from '../components/reports/DataReview';
import { DiagnosisGeneration } from '../components/reports/DiagnosisGeneration';
import { ReportPreview } from '../components/reports/ReportPreview';
import { Patient, Diagnosis } from '../types/supabase';

type Step = 'patient' | 'data' | 'diagnosis' | 'report';

const NewReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentStep('data');
  };

  const handleGenerateDiagnosis = async () => {
    if (!selectedPatient) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_diagnosis', {
        patient_id: selectedPatient.id
      });

      if (error) throw error;
      
      setDiagnosis(data);
      setCurrentStep('diagnosis');
      toast({
        title: "Diagnóstico generado",
        description: "El diagnóstico se ha generado correctamente",
      });
    } catch (error) {
      console.error('Error generating diagnosis:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el diagnóstico",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!selectedPatient || !diagnosis) return;
    
    setIsLoading(true);
    try {
      // In a future version, we would generate and store the PDF
      // For now, we'll just store the report data
      const { data, error } = await supabase
        .from('reports')
        .insert({
          patient_id: selectedPatient.id,
          diagnosis: diagnosis,
          // doctor_id would come from auth context in future versions
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Informe guardado",
        description: "El informe se ha guardado correctamente",
      });
      
      // Navigate to the report detail page
      navigate(`/reports/${data.id}`);
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el informe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which component to render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'patient':
        return <PatientSelector onSelectPatient={handlePatientSelect} />;
      case 'data':
        return selectedPatient ? (
          <DataReview 
            patient={selectedPatient} 
            onBack={() => setCurrentStep('patient')} 
            onNext={handleGenerateDiagnosis} 
            isLoading={isLoading}
          />
        ) : null;
      case 'diagnosis':
        return selectedPatient && diagnosis ? (
          <DiagnosisGeneration
            patient={selectedPatient}
            diagnosis={diagnosis}
            onBack={() => setCurrentStep('data')}
            onNext={() => setCurrentStep('report')}
          />
        ) : null;
      case 'report':
        return selectedPatient && diagnosis ? (
          <ReportPreview
            patient={selectedPatient}
            diagnosis={diagnosis}
            pdfUrl={pdfUrl}
            onBack={() => setCurrentStep('diagnosis')}
            onSave={handleSaveReport}
            isLoading={isLoading}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout title="Crear Nuevo Informe">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="mb-8">
          <ol className="flex items-center w-full">
            <li className={`flex w-full items-center ${currentStep === 'patient' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep === 'patient' ? 'after:border-healz-red' : 'after:border-healz-brown/30'} after:border-4 after:inline-block`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'patient' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                1
              </span>
            </li>
            <li className={`flex w-full items-center ${currentStep === 'data' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep === 'data' ? 'after:border-healz-red' : 'after:border-healz-brown/30'} after:border-4 after:inline-block`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'data' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                2
              </span>
            </li>
            <li className={`flex w-full items-center ${currentStep === 'diagnosis' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep === 'diagnosis' ? 'after:border-healz-red' : 'after:border-healz-brown/30'} after:border-4 after:inline-block`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'diagnosis' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                3
              </span>
            </li>
            <li className={`flex items-center ${currentStep === 'report' ? 'text-healz-red' : 'text-healz-brown/70'}`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'report' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
                4
              </span>
            </li>
          </ol>
          <div className="flex justify-between mt-2 px-2">
            <span className="text-sm font-medium">Seleccionar Paciente</span>
            <span className="text-sm font-medium">Revisar Datos</span>
            <span className="text-sm font-medium">Generar Diagnóstico</span>
            <span className="text-sm font-medium">Vista Previa</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default NewReport;
