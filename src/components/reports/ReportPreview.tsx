
import { Patient, Diagnosis } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { PDFDownloadButton } from './ReportPDF';

interface ReportPreviewProps {
  patient: Patient;
  diagnosis: Diagnosis;
  pdfUrl: string | null;
  onBack: () => void;
  onSave: () => void;
  isLoading: boolean;
}

export const ReportPreview = ({ 
  patient, 
  diagnosis, 
  pdfUrl, 
  onBack, 
  onSave, 
  isLoading 
}: ReportPreviewProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Vista previa del informe</h3>

      <div className="bg-white border border-healz-brown/20 rounded-lg overflow-hidden">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Report Header */}
          <header className="text-center mb-8">
            <h1 className="text-2xl font-bold text-healz-brown mb-1">Informe Clínico</h1>
            <p className="text-sm text-healz-brown/70">
              Generado el {new Date().toLocaleDateString()}
            </p>
          </header>

          {/* Patient Information */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-healz-brown border-b border-healz-brown/20 pb-1 mb-3">
              Información del Paciente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Nombre:</span> {patient.first_name} {patient.last_name}</p>
                <p><span className="font-medium">Email:</span> {patient.email}</p>
              </div>
              <div>
                <p><span className="font-medium">Edad:</span> {patient.age} años</p>
                <p><span className="font-medium">Género:</span> {patient.gender}</p>
              </div>
            </div>
          </section>

          {/* Vitality & Risk Scores */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-healz-brown border-b border-healz-brown/20 pb-1 mb-3">
              Indicadores de Salud
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium mb-2">Vitality Score: {diagnosis.vitalityScore}%</p>
                <div className="h-3 bg-healz-green/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-healz-green"
                    style={{ width: `${diagnosis.vitalityScore}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Risk Score: {diagnosis.riskScore}%</p>
                <div className="h-3 bg-healz-red/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-healz-red"
                    style={{ width: `${diagnosis.riskScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Profile */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-healz-brown border-b border-healz-brown/20 pb-1 mb-3">
              Perfil de Riesgo
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-healz-cream/10 rounded shadow-sm">
                <p className="font-medium">Cardiovascular</p>
                <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                  ${diagnosis.riskProfile.cardio === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                  diagnosis.riskProfile.cardio === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                  'bg-healz-red/20 text-healz-red'}`}>
                  {diagnosis.riskProfile.cardio.toUpperCase()}
                </div>
              </div>
              <div className="p-3 bg-healz-cream/10 rounded shadow-sm">
                <p className="font-medium">Mental</p>
                <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                  ${diagnosis.riskProfile.mental === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                  diagnosis.riskProfile.mental === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                  'bg-healz-red/20 text-healz-red'}`}>
                  {diagnosis.riskProfile.mental.toUpperCase()}
                </div>
              </div>
              <div className="p-3 bg-healz-cream/10 rounded shadow-sm">
                <p className="font-medium">Adrenal</p>
                <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                  ${diagnosis.riskProfile.adrenal === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                  diagnosis.riskProfile.adrenal === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                  'bg-healz-red/20 text-healz-red'}`}>
                  {diagnosis.riskProfile.adrenal.toUpperCase()}
                </div>
              </div>
              <div className="p-3 bg-healz-cream/10 rounded shadow-sm">
                <p className="font-medium">Metabólico</p>
                <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                  ${diagnosis.riskProfile.metabolic === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                  diagnosis.riskProfile.metabolic === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                  'bg-healz-red/20 text-healz-red'}`}>
                  {diagnosis.riskProfile.metabolic.toUpperCase()}
                </div>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-healz-brown border-b border-healz-brown/20 pb-1 mb-3">
              Resumen y Recomendaciones
            </h2>
            <div className="text-healz-brown space-y-2">
              {diagnosis.summary.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Atrás
        </Button>
        
        <div className="flex space-x-3">
          <PDFDownloadButton 
            patient={patient}
            diagnosis={diagnosis}
          />
        
          <Button
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Informe'}
          </Button>
        </div>
      </div>
    </div>
  );
};
