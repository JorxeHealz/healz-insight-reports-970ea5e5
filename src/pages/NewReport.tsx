import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../lib/supabase';
import { PatientSelector } from '../components/reports/PatientSelector';
import { FormSelector } from '../components/reports/FormSelector';
import { DataReview } from '../components/reports/DataReview';
import { DiagnosisGenerationStatus } from '../components/reports/DiagnosisGenerationStatus';
import { Patient, Diagnosis } from '../types/supabase';
import { PatientForm } from '../types/forms';
import { pdf } from '@react-pdf/renderer';
import { ReportPDF } from '../components/reports/ReportPDF';

type Step = 'patient' | 'form' | 'data' | 'generation' | 'report';

const NewReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedForm, setSelectedForm] = useState<PatientForm | null | undefined>(undefined);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [analyticsId, setAnalyticsId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedForm(undefined); // Reset form selection
    setCurrentStep('form');
  };

  const handleFormSelect = (form: PatientForm | null) => {
    setSelectedForm(form);
  };

  const handleFormNext = () => {
    setCurrentStep('data');
  };

  const handleDataNext = (analyticsId: string) => {
    setAnalyticsId(analyticsId);
    setCurrentStep('generation');
  };

  const handleGenerationComplete = (reportId: string) => {
    // Navigate directly to the completed report
    navigate(`/reports/${reportId}`);
  };

  const generateAndUploadPdf = async () => {
    if (!selectedPatient || !diagnosis) return null;
    
    try {
      // Generar blob del PDF
      const pdfDoc = <ReportPDF 
        patient={selectedPatient} 
        diagnosis={diagnosis} 
        date={new Date()} 
      />;
      
      const pdfBlob = await pdf(pdfDoc).toBlob();
      
      // Crear nombre de archivo
      const fileName = `reports/${selectedPatient.id}/${Date.now()}-report.pdf`;
      
      // Verificar si existe el bucket de storage
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('reports');
      
      if (bucketError && bucketError.message.includes('not found')) {
        // Crear el bucket si no existe
        await supabase.storage.createBucket('reports', {
          public: false,
        });
      }
      
      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('reports')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (error) throw error;
      
      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      return null;
    }
  };

  const handleSaveReport = async () => {
    if (!selectedPatient || !diagnosis) return;
    
    setIsLoading(true);
    try {
      // Generar y subir el PDF
      const pdfUrl = await generateAndUploadPdf();
      
      // Guardar el informe en la base de datos con form_id si está seleccionado
      const reportData: any = {
        patient_id: selectedPatient.id,
        diagnosis: diagnosis,
        pdf_url: pdfUrl,
      };

      // Incluir form_id si se seleccionó un formulario
      if (selectedForm) {
        reportData.form_id = selectedForm.id;
      }
      
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;
      
      setPdfUrl(pdfUrl);
      
      toast({
        title: "Informe guardado",
        description: "El informe se ha guardado correctamente",
      });
      
      // Navegar a la página de detalle del informe
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
      case 'form':
        return selectedPatient ? (
          <FormSelector 
            patient={selectedPatient}
            selectedForm={selectedForm}
            onSelectForm={handleFormSelect}
            onBack={() => setCurrentStep('patient')}
            onNext={handleFormNext}
          />
        ) : null;
      case 'data':
        return selectedPatient ? (
          <DataReview 
            patient={selectedPatient} 
            selectedForm={selectedForm}
            onBack={() => setCurrentStep('form')} 
            onNext={handleDataNext} 
            isLoading={isLoading}
          />
        ) : null;
      case 'generation':
        return selectedPatient && analyticsId ? (
          <DiagnosisGenerationStatus
            patient={selectedPatient}
            selectedForm={selectedForm}
            analyticsId={analyticsId}
            onBack={() => setCurrentStep('data')}
            onComplete={handleGenerationComplete}
          />
        ) : null;
      case 'report':
        // This case is no longer used as we navigate directly to the report
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <ol className="flex items-center w-full">
          <li className={`flex w-full items-center ${currentStep === 'patient' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep === 'patient' ? 'after:border-healz-red' : 'after:border-healz-brown/30'} after:border-4 after:inline-block`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'patient' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
              1
            </span>
          </li>
          <li className={`flex w-full items-center ${currentStep === 'form' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep === 'form' ? 'after:border-healz-red' : 'after:border-healz-brown/30'} after:border-4 after:inline-block`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'form' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
              2
            </span>
          </li>
          <li className={`flex w-full items-center ${currentStep === 'data' ? 'text-healz-red' : 'text-healz-brown/70'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep === 'data' ? 'after:border-healz-red' : 'after:border-healz-brown/30'} after:border-4 after:inline-block`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'data' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
              3
            </span>
          </li>
          <li className={`flex items-center ${currentStep === 'generation' ? 'text-healz-red' : 'text-healz-brown/70'}`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${currentStep === 'generation' ? 'bg-healz-red text-white' : 'bg-healz-brown/20'}`}>
              4
            </span>
          </li>
        </ol>
        <div className="flex justify-between mt-2 px-2">
          <span className="text-sm font-medium">Paciente</span>
          <span className="text-sm font-medium">Formulario</span>
          <span className="text-sm font-medium">Datos</span>
          <span className="text-sm font-medium">Generando</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default NewReport;
