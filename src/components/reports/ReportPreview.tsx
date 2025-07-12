import { Patient, Diagnosis } from '../../types/supabase';
import { Button } from '@/components/ui/button';
import { PDFDownloadButton } from './ReportPDF';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { calculateAge } from '../../utils/dateUtils';

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
  const patientAge = calculateAge(patient.date_of_birth);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Vista previa del informe</h3>

      <div className="bg-white border border-healz-brown/20 rounded-lg overflow-hidden">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Report Header */}
          <header className="flex justify-between items-center mb-8 border-b border-healz-brown/20 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-healz-brown">Informe Clínico</h1>
              <p className="text-sm text-healz-brown/70">
                Generado el {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-healz-cream/30">
                Healz Reports
              </Badge>
            </div>
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
                <p><span className="font-medium">Edad:</span> {patientAge} años</p>
                <p><span className="font-medium">Género:</span> {patient.gender}</p>
              </div>
            </div>
          </section>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="riskProfile">Perfil de Riesgo</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Vitality & Risk Scores */}
              <div>
                <h3 className="font-semibold text-healz-brown mb-3">Indicadores de Salud</h3>
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
              </div>

              {/* Biomarker Categories */}
              <div className="mt-6">
                <h3 className="font-semibold text-healz-brown mb-3">Categorías de Biomarcadores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Metabolic", "Heart", "Thyroid", "Stress & Aging", "Nutrients", "Immune"].map((category) => (
                    <Card key={category} className="bg-healz-cream/10 border-healz-brown/10">
                      <CardContent className="p-3">
                        <p className="font-medium text-sm">{category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="riskProfile" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Riesgo Cardíaco</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.riesgo_cardiaco === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.riesgo_cardiaco === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.riesgo_cardiaco?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.riesgo_cardiaco === 'low' 
                      ? 'Riesgo cardiovascular bajo. Mantener hábitos saludables.'
                      : diagnosis.riskProfile.riesgo_cardiaco === 'medium'
                      ? 'Riesgo moderado. Considerar optimización de lípidos.'
                      : 'Riesgo elevado. Requiere intervención.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Salud Cerebral</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.salud_cerebral === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.salud_cerebral === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.salud_cerebral?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.salud_cerebral === 'low' 
                      ? 'Función cognitiva excelente. Continuar técnicas de bienestar.'
                      : diagnosis.riskProfile.salud_cerebral === 'medium'
                      ? 'Signos moderados de estrés mental. Implementar estrategias de gestión.'
                      : 'Problemas cognitivos importantes. Evaluación especializada recomendada.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Hormonas</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.hormonas === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.hormonas === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.hormonas?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.hormonas === 'low' 
                      ? 'Balance hormonal óptimo. Mantener rutinas.'
                      : diagnosis.riskProfile.hormonas === 'medium'
                      ? 'Signos de desequilibrio hormonal. Optimizar descanso.'
                      : 'Desregulación hormonal significativa. Plan de equilibrio necesario.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Pérdida de Peso</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.perdida_peso === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.perdida_peso === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.perdida_peso?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.perdida_peso === 'low' 
                      ? 'Peso saludable. Mantener equilibrio nutricional actual.'
                      : diagnosis.riskProfile.perdida_peso === 'medium'
                      ? 'Necesidad moderada de cambios. Ajustes dietéticos sugeridos.'
                      : 'Requiere intervención. Plan de pérdida de peso prioritario.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Vitalidad</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.vitalidad === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.vitalidad === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.vitalidad?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.vitalidad === 'low' 
                      ? 'Vitalidad excelente. Mantener estilo de vida actual.'
                      : diagnosis.riskProfile.vitalidad === 'medium'
                      ? 'Vitalidad moderada. Optimizar nutrición y descanso.'
                      : 'Baja vitalidad general. Plan integral de recuperación necesario.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Fuerza</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.fuerza === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.fuerza === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.fuerza?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.fuerza === 'low' 
                      ? 'Fuerza y resistencia óptimas. Continuar rutina de ejercicio.'
                      : diagnosis.riskProfile.fuerza === 'medium'
                      ? 'Capacidad física moderada. Incrementar entrenamiento de fuerza.'
                      : 'Debilidad muscular significativa. Programa de fortalecimiento necesario.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Salud Sexual</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.salud_sexual === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.salud_sexual === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.salud_sexual?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.salud_sexual === 'low' 
                      ? 'Salud sexual óptima. Mantener equilibrio hormonal.'
                      : diagnosis.riskProfile.salud_sexual === 'medium'
                      ? 'Cambios moderados. Evaluación hormonal recomendada.'
                      : 'Disfunción significativa. Consulta especializada necesaria.'}
                  </p>
                </div>
                <div className="p-4 bg-healz-cream/10 rounded shadow-sm">
                  <p className="font-medium">Longevidad</p>
                  <div className={`mt-1 text-xs px-2 py-1 rounded inline-block
                    ${diagnosis.riskProfile.longevidad === 'low' ? 'bg-healz-green/20 text-healz-green' : 
                    diagnosis.riskProfile.longevidad === 'medium' ? 'bg-healz-yellow/20 text-healz-yellow' : 
                    'bg-healz-red/20 text-healz-red'}`}>
                    {diagnosis.riskProfile.longevidad?.toUpperCase() || 'N/A'}
                  </div>
                  <p className="mt-2 text-sm text-healz-brown/70">
                    {diagnosis.riskProfile.longevidad === 'low' 
                      ? 'Excelente potencial de longevidad. Continuar hábitos preventivos.'
                      : diagnosis.riskProfile.longevidad === 'medium'
                      ? 'Factores de riesgo moderados. Optimización preventiva recomendada.'
                      : 'Múltiples factores de riesgo. Plan integral de longevidad necesario.'}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-healz-cream/30 p-4 rounded-md border border-healz-brown/10">
                  <h3 className="font-semibold text-healz-brown mb-2">Resumen General</h3>
                  <div className="text-healz-brown space-y-2">
                    {diagnosis.summary.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-healz-brown mb-2">Recomendaciones Específicas</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Análisis de seguimiento en 3-6 meses para biomarcadores principales</li>
                    <li>Evaluación de respuesta a intervenciones nutricionales</li>
                    <li>Monitoreo de patrones de estrés y calidad de sueño</li>
                    <li>Optimización de niveles hormonales según hallazgos actuales</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
