
import { Patient, Diagnosis } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DiagnosisGenerationProps {
  patient: Patient;
  diagnosis: Diagnosis;
  onBack: () => void;
  onNext: () => void;
}

export const DiagnosisGeneration = ({ patient, diagnosis, onBack, onNext }: DiagnosisGenerationProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Diagnóstico generado</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vitality Score */}
        <div>
          <h4 className="font-medium mb-3 text-healz-brown">Vitality Score</h4>
          <div className="relative pt-1">
            <div className="overflow-hidden h-6 text-xs flex rounded-full bg-healz-green/20">
              <div 
                style={{ width: `${diagnosis.vitalityScore}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-healz-green transition-all duration-500"
              >
                {diagnosis.vitalityScore}%
              </div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-healz-brown/70">
              <span>Bajo</span>
              <span>Medio</span>
              <span>Óptimo</span>
            </div>
          </div>
        </div>
        
        {/* Risk Score */}
        <div>
          <h4 className="font-medium mb-3 text-healz-brown">Risk Score</h4>
          <div className="relative pt-1">
            <div className="overflow-hidden h-6 text-xs flex rounded-full bg-healz-red/20">
              <div 
                style={{ width: `${diagnosis.riskScore}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-healz-red transition-all duration-500"
              >
                {diagnosis.riskScore}%
              </div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-healz-brown/70">
              <span>Bajo</span>
              <span>Medio</span>
              <span>Alto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Profile */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Perfil de riesgo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Riesgo Cardíaco</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.riesgo_cardiaco === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.riesgo_cardiaco === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.riesgo_cardiaco.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Salud Cerebral</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.salud_cerebral === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.salud_cerebral === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.salud_cerebral.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Hormonas</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.hormonas === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.hormonas === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.hormonas.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Pérdida de Peso</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.perdida_peso === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.perdida_peso === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.perdida_peso.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Vitalidad</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.vitalidad === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.vitalidad === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.vitalidad.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Fuerza</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.fuerza === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.fuerza === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.fuerza.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Salud Sexual</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.salud_sexual === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.salud_sexual === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.salud_sexual.toUpperCase()}
              </div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm border border-healz-brown/10">
              <div className="font-medium">Longevidad</div>
              <div className={`mt-1 text-xs px-1.5 py-0.5 rounded inline-block
                ${diagnosis.riskProfile.longevidad === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                diagnosis.riskProfile.longevidad === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                'bg-healz-red/20 text-healz-red'}`}>
                {diagnosis.riskProfile.longevidad.toUpperCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-healz-brown">
            {diagnosis.summary.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          onClick={onNext}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
