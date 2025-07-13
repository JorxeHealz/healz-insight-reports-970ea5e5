import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  Heart, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Plus,
  Eye,
  EyeOff,
  Calendar,
  Target,
  User,
  Clock
} from 'lucide-react';
import { EditableClinicalNote } from './EditableClinicalNote';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';
import { useReportBiomarkers } from '../../hooks/useReportBiomarkers';

interface DiagnosisIntegratedProps {
  report: any;
}

export const DiagnosisIntegrated: React.FC<DiagnosisIntegratedProps> = ({ report }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTechnicalView, setShowTechnicalView] = useState(false);
  const { deleteClinicalNote } = useClinicalNotes(report.id);
  
  // Debug: Log the report data to see its structure
  console.log('DiagnosisIntegrated - Report data:', report);
  console.log('DiagnosisIntegrated - Clinical notes:', report.clinical_notes);
  
  // Fetch biomarkers for this report
  const { data: reportBiomarkers } = useReportBiomarkers(report.id);

  const categorizeNotes = (notes: any[]) => {
    const general = notes.filter(note => 
      !note.evaluation_type || note.evaluation_type === 'general'
    );
    const panels = notes.filter(note => 
      note.evaluation_type === 'panel'
    );
    const biomarkers = notes.filter(note => 
      note.evaluation_type === 'biomarker'
    );
    
    return { general, panels, biomarkers };
  };

  // Use clinical_notes from report (which should come from report_comments table)
  const notes = report.clinical_notes || [];
  const { general, panels, biomarkers } = categorizeNotes(notes);

  // Get available panels and biomarkers
  const availablePanels = [
    'Salud Cardiovascular',
    'Función Tiroidea', 
    'Metabolismo',
    'Hormonas del Estrés',
    'Estado Nutricional',
    'Hormonas Sexuales',
    'Función Hepática',
    'Función Renal',
    'Perfil Hematológico',
    'Inflamación'
  ];
  
  const availableBiomarkers = (reportBiomarkers || report.recentBiomarkers || []).map((biomarker: any) => ({
    id: biomarker.biomarkerData?.id || biomarker.name?.toLowerCase().replace(/\s+/g, '_'),
    name: biomarker.name
  }));

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteClinicalNote.mutateAsync(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Extract key information from the main diagnosis
  const mainDiagnosis = typeof report.diagnosis === 'string' ? report.diagnosis : 
                       typeof report.diagnosis?.summary === 'string' ? report.diagnosis.summary : '';
  
  const personalizedInsights = report.personalized_insights || {};
  const criticalBiomarkers = Array.isArray(report.critical_biomarkers) ? report.critical_biomarkers : [];
  const vitalityScore = report.vitality_score || 0;
  const riskScore = report.average_risk || 0;
  const diagnosisDate = report.diagnosis_date ? new Date(report.diagnosis_date).toLocaleDateString('es-ES') : 
                       new Date(report.created_at).toLocaleDateString('es-ES');

  // Extract structured insights for better display
  const systemsAffected = personalizedInsights.sistemas_afectados || personalizedInsights.systems_affected || [];
  const rootCauses = personalizedInsights.causas_raiz || personalizedInsights.root_causes || [];
  const interconnections = personalizedInsights.interconexiones || personalizedInsights.interconnections || '';

  const renderMainDiagnosis = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-healz-blue" />
            Diagnóstico Principal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {diagnosisDate}
            </Badge>
            {vitalityScore > 0 && (
              <Badge variant={vitalityScore >= 70 ? 'default' : vitalityScore >= 50 ? 'secondary' : 'destructive'}>
                Vitalidad: {vitalityScore}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainDiagnosis && (
          <div className="prose prose-sm max-w-none">
            <p className="text-healz-brown leading-relaxed whitespace-pre-wrap">
              {mainDiagnosis}
            </p>
          </div>
        )}

        {(systemsAffected.length > 0 || rootCauses.length > 0 || interconnections || Object.keys(personalizedInsights).length > 0) && (
          <div className="space-y-4">
            <h4 className="font-semibold text-healz-brown flex items-center gap-2">
              <Target className="h-4 w-4" />
              Insights Personalizados
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {systemsAffected.length > 0 && (
                <Card className="border-l-4 border-l-healz-blue">
                  <CardContent className="p-4">
                    <div className="font-semibold text-sm text-healz-brown mb-2">
                      Sistemas Afectados
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {systemsAffected.map((system: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {rootCauses.length > 0 && (
                <Card className="border-l-4 border-l-healz-orange">
                  <CardContent className="p-4">
                    <div className="font-semibold text-sm text-healz-brown mb-2">
                      Causas Raíz
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rootCauses.map((cause: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cause}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {interconnections && (
                <Card className="border-l-4 border-l-healz-teal">
                  <CardContent className="p-4">
                    <div className="font-semibold text-sm text-healz-brown mb-2">
                      Interconexiones
                    </div>
                    <div className="text-xs text-healz-brown/70">
                      {interconnections}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {Object.keys(personalizedInsights).length > 0 && !systemsAffected.length && !rootCauses.length && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(personalizedInsights).map(([system, insight]) => (
                  <Card key={system} className="border-l-4 border-l-healz-orange">
                    <CardContent className="p-3">
                      <div className="font-medium text-sm text-healz-brown capitalize">
                        {system.replace(/[_-]/g, ' ')}
                      </div>
                      <div className="text-xs text-healz-brown/70 mt-1">
                        {Array.isArray(insight) ? insight.join(', ') : 
                         typeof insight === 'object' && insight !== null ? 
                         JSON.stringify(insight) : 
                         String(insight)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}


        {(vitalityScore > 0 || riskScore > 0) && (
          <div className="bg-healz-cream/30 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-healz-brown mb-3 text-center">
              Puntuaciones Clave
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {vitalityScore > 0 && (
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    vitalityScore >= 70 ? 'text-healz-green' : 
                    vitalityScore >= 50 ? 'text-healz-yellow' : 'text-healz-orange'
                  }`}>
                    {vitalityScore}%
                  </div>
                  <div className="text-sm font-medium text-healz-brown">Vitalidad</div>
                  <div className="text-xs text-healz-brown/60 mt-1">
                    {vitalityScore >= 70 ? 'Excelente' : 
                     vitalityScore >= 50 ? 'Moderada' : 'Necesita atención'}
                  </div>
                </div>
              )}
              {riskScore > 0 && (
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    riskScore >= 70 ? 'text-healz-red' : 
                    riskScore >= 40 ? 'text-healz-orange' : 'text-healz-green'
                  }`}>
                    {riskScore}%
                  </div>
                  <div className="text-sm font-medium text-healz-brown">Riesgo Promedio</div>
                  <div className="text-xs text-healz-brown/60 mt-1">
                    {riskScore >= 70 ? 'Alto - requiere atención' : 
                     riskScore >= 40 ? 'Moderado' : 'Bajo'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderNoteSection = (title: string, notes: any[], icon: React.ReactNode) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-healz-brown">{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {notes.length}
        </Badge>
      </div>
      
      {notes.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-healz-brown/60 text-center">
              No hay evaluaciones en esta categoría
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="border-l-4 border-l-healz-blue/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-base">{note.title}</CardTitle>
                      {note.evaluation_type && (
                        <Badge variant="outline" className="text-xs">
                          {note.evaluation_type === 'general' ? 'General' : 
                           note.evaluation_type === 'panel' ? 'Panel' : 'Biomarcador'}
                        </Badge>
                      )}
                      {note.criticality_level && (
                        <Badge 
                          variant={note.criticality_level === 'critical' ? 'destructive' : 
                                  note.criticality_level === 'high' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {note.criticality_level === 'critical' ? 'Crítico' :
                           note.criticality_level === 'high' ? 'Alto' :
                           note.criticality_level === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                      )}
                      {note.is_auto_generated && (
                        <Badge variant="outline" className="text-xs bg-healz-blue/10 text-healz-blue">
                          Auto-generado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-healz-brown/70">
                      {note.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {note.author}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(note.date || note.created_at).toLocaleDateString('es-ES')}
                      </div>
                      {note.evaluation_score && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Puntuación: {note.evaluation_score}/10
                        </div>
                      )}
                      {note.target_id && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">🎯 {note.target_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-healz-brown whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  
                  {showTechnicalView && note.technical_details && (
                    <div className="bg-healz-cream/30 rounded-lg p-3">
                      <h5 className="font-medium text-healz-brown mb-2 text-sm">Detalles Técnicos:</h5>
                      <p className="text-sm text-healz-brown/80 whitespace-pre-wrap">
                        {note.technical_details}
                      </p>
                    </div>
                  )}
                  
                  {note.patient_friendly_content && (
                    <div className="bg-healz-green/10 rounded-lg p-3">
                      <h5 className="font-medium text-healz-brown mb-2 text-sm">Explicación para el Paciente:</h5>
                      <p className="text-sm text-healz-brown/80 whitespace-pre-wrap">
                        {note.patient_friendly_content}
                      </p>
                    </div>
                  )}
                  
                  {note.action_steps && (
                    <div className="bg-healz-orange/10 rounded-lg p-3">
                      <h5 className="font-medium text-healz-brown mb-2 text-sm">Pasos de Acción:</h5>
                      <p className="text-sm text-healz-brown/80 whitespace-pre-wrap">
                        {note.action_steps}
                      </p>
                    </div>
                  )}
                  
                  {note.warning_signs && (
                    <div className="bg-healz-red/10 rounded-lg p-3 border border-healz-red/20">
                      <h5 className="font-medium text-healz-red mb-2 text-sm flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Señales de Advertencia:
                      </h5>
                      <p className="text-sm text-healz-red/80 whitespace-pre-wrap">
                        {note.warning_signs}
                      </p>
                    </div>
                  )}
                  
                  {note.expected_timeline && (
                    <div className="bg-healz-blue/10 rounded-lg p-3">
                      <h5 className="font-medium text-healz-brown mb-2 text-sm">Cronograma Esperado:</h5>
                      <p className="text-sm text-healz-brown/80">
                        {note.expected_timeline}
                      </p>
                    </div>
                  )}
                  
                  {note.recommendations && Object.keys(note.recommendations).length > 0 && (
                    <div className="bg-healz-teal/10 rounded-lg p-3">
                      <h5 className="font-medium text-healz-brown mb-2 text-sm">Recomendaciones:</h5>
                      <div className="text-sm text-healz-brown/80">
                        {typeof note.recommendations === 'string' ? (
                          <p className="whitespace-pre-wrap">{note.recommendations}</p>
                        ) : (
                          <pre className="whitespace-pre-wrap font-sans">
                            {JSON.stringify(note.recommendations, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-healz-brown">Diagnóstico Integral</h2>
          <p className="text-healz-brown/70 mt-1">
            Diagnóstico principal y evaluaciones clínicas estructuradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTechnicalView(!showTechnicalView)}
            className="flex items-center gap-2"
          >
            {showTechnicalView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showTechnicalView ? 'Vista Simple' : 'Vista Técnica'}
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Evaluación
          </Button>
        </div>
      </div>

      {renderMainDiagnosis()}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Evaluación General ({general.length})
          </TabsTrigger>
          <TabsTrigger value="panels" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Por Paneles ({panels.length})
          </TabsTrigger>
          <TabsTrigger value="biomarkers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Por Biomarcadores ({biomarkers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {renderNoteSection(
            'Evaluaciones Generales',
            general,
            <Brain className="h-5 w-5 text-healz-blue" />
          )}
        </TabsContent>
        
        <TabsContent value="panels" className="space-y-6">
          {renderNoteSection(
            'Evaluaciones por Panel',
            panels,
            <Activity className="h-5 w-5 text-healz-orange" />
          )}
        </TabsContent>
        
        <TabsContent value="biomarkers" className="space-y-6">
          {renderNoteSection(
            'Evaluaciones por Biomarcador',
            biomarkers,
            <Heart className="h-5 w-5 text-healz-green" />
          )}
        </TabsContent>
      </Tabs>

      <AddClinicalNoteDialog
        reportId={report.id}
        formId={report.form_id || 'default'}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        availablePanels={availablePanels}
        availableBiomarkers={availableBiomarkers}
      />
    </div>
  );
};
