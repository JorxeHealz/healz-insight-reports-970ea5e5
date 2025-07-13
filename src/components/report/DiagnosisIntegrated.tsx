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
  Target
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
  const riskScore = report.average_risk;
  const diagnosisDate = report.diagnosis_date ? new Date(report.diagnosis_date).toLocaleDateString('es-ES') : 
                       new Date(report.created_at).toLocaleDateString('es-ES');

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

        {Object.keys(personalizedInsights).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-healz-brown flex items-center gap-2">
              <Target className="h-4 w-4" />
              Análisis por Sistema
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(personalizedInsights).map(([system, insight]) => (
                <Card key={system} className="border-l-4 border-l-healz-orange">
                  <CardContent className="p-3">
                    <div className="font-medium text-sm text-healz-brown capitalize">
                      {system.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-healz-brown/70 mt-1">
                      {String(insight)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {criticalBiomarkers.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-healz-brown flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-healz-red" />
              Biomarcadores Críticos
            </h4>
            <div className="flex flex-wrap gap-2">
              {criticalBiomarkers.map((biomarker, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {typeof biomarker === 'string' ? biomarker : biomarker.name || 'Biomarcador'}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(vitalityScore > 0 || riskScore > 0) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {vitalityScore > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-healz-blue">{vitalityScore}%</div>
                <div className="text-sm text-healz-brown/70">Puntuación de Vitalidad</div>
              </div>
            )}
            {riskScore > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-healz-orange">{riskScore}%</div>
                <div className="text-sm text-healz-brown/70">Puntuación de Riesgo</div>
              </div>
            )}
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
            <EditableClinicalNote
              key={note.id}
              note={note}
              reportId={report.id}
              onDelete={handleDeleteNote}
              isEvaluation={!!note.evaluation_type}
              availablePanels={availablePanels}
              availableBiomarkers={availableBiomarkers}
              showTechnicalView={showTechnicalView}
            />
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
            Evaluación General
          </TabsTrigger>
          <TabsTrigger value="panels" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Por Paneles
          </TabsTrigger>
          <TabsTrigger value="biomarkers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Por Biomarcadores
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