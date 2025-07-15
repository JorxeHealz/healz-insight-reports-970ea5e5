
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { 
  Brain, 
  Activity, 
  Heart, 
  Plus,
  ChevronDown,
  ChevronRight,
  User,
  Clock,
  Target,
  AlertTriangle
} from 'lucide-react';
import { AddClinicalNoteDialog } from '../AddClinicalNoteDialog';
import { useClinicalNotes } from '../../../hooks/useClinicalNotes';

interface ClinicalEvaluationsSectionProps {
  clinicalNotes: any[];
  reportId: string;
  formId: string;
  availablePanels: string[];
  availableBiomarkers: any[];
  onDeleteNote: (noteId: string) => Promise<void>;
}

export const ClinicalEvaluationsSection: React.FC<ClinicalEvaluationsSectionProps> = ({
  clinicalNotes,
  reportId,
  formId,
  availablePanels,
  availableBiomarkers,
  onDeleteNote
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

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

  const { general, panels, biomarkers } = categorizeNotes(clinicalNotes);

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const renderEvaluationCard = (note: any) => {
    const isExpanded = expandedCards[note.id] || false;
    
    return (
      <Card key={note.id} className="border-l-4 border-l-healz-blue/40 hover:shadow-md transition-shadow">
        <Collapsible open={isExpanded} onOpenChange={() => toggleCardExpansion(note.id)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-healz-cream/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-healz-brown/70" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-healz-brown/70" />
                      )}
                      <CardTitle className="text-base font-semibold">{note.title}</CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-2">
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
                      {note.evaluation_score && (
                        <Badge 
                          variant={note.evaluation_score >= 8 ? 'destructive' : 
                                  note.evaluation_score >= 6 ? 'secondary' : 'default'}
                          className="text-xs font-semibold"
                        >
                          Riesgo: {note.evaluation_score}/10
                        </Badge>
                      )}
                    </div>
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
                    {note.target_id && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {note.target_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {/* Contenido Principal */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-healz-brown whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
                
                {/* Detalles Técnicos */}
                {note.technical_details && (
                  <div className="bg-healz-cream/40 rounded-lg p-4 border border-healz-brown/10">
                    <h5 className="font-semibold text-healz-brown mb-2 text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Detalles Técnicos
                    </h5>
                    <p className="text-sm text-healz-brown/80 whitespace-pre-wrap">
                      {note.technical_details}
                    </p>
                  </div>
                )}
                
                {note.patient_friendly_content && (
                  <div className="bg-healz-green/10 rounded-lg p-4 border border-healz-green/20">
                    <h5 className="font-semibold text-healz-brown mb-2 text-sm">
                      Explicación para el Paciente
                    </h5>
                    <p className="text-sm text-healz-brown/80 whitespace-pre-wrap">
                      {note.patient_friendly_content}
                    </p>
                  </div>
                )}
                
                {note.action_steps && (
                  <div className="bg-healz-orange/10 rounded-lg p-4 border border-healz-orange/20">
                    <h5 className="font-semibold text-healz-brown mb-2 text-sm">
                      Pasos a Seguir
                    </h5>
                    <p className="text-sm text-healz-brown/80 whitespace-pre-wrap">
                      {note.action_steps}
                    </p>
                  </div>
                )}
                
                {note.warning_signs && (
                  <div className="bg-healz-red/10 rounded-lg p-4 border border-healz-red/30">
                    <h5 className="font-semibold text-healz-red mb-2 text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Señales de Alerta
                    </h5>
                    <p className="text-sm text-healz-red/80 whitespace-pre-wrap">
                      {note.warning_signs}
                    </p>
                  </div>
                )}
                
                {note.expected_timeline && (
                  <div className="bg-healz-blue/10 rounded-lg p-4 border border-healz-blue/20">
                    <h5 className="font-semibold text-healz-brown mb-2 text-sm">
                      Cronograma Esperado
                    </h5>
                    <p className="text-sm text-healz-brown/80">
                      {note.expected_timeline}
                    </p>
                  </div>
                )}
                
                {note.recommendations && Object.keys(note.recommendations).length > 0 && (
                  <div className="bg-healz-teal/10 rounded-lg p-4 border border-healz-teal/20">
                    <h5 className="font-semibold text-healz-brown mb-2 text-sm">
                      Recomendaciones Específicas
                    </h5>
                    <div className="text-sm text-healz-brown/80">
                      {typeof note.recommendations === 'string' ? (
                        <p className="whitespace-pre-wrap">{note.recommendations}</p>
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-xs">
                          {JSON.stringify(note.recommendations, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  const renderNoteSection = (title: string, notes: any[], icon: React.ReactNode, emptyMessage: string) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-healz-brown">{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {notes.length}
        </Badge>
      </div>
      
      {notes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-healz-brown/60">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map(renderEvaluationCard)}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-healz-brown">Evaluaciones Clínicas Detalladas</CardTitle>
            <p className="text-healz-brown/70 mt-1">
              Análisis específicos por categorías y biomarcadores
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Evaluación
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              General ({general.length})
            </TabsTrigger>
            <TabsTrigger value="panels" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Paneles ({panels.length})
            </TabsTrigger>
            <TabsTrigger value="biomarkers" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Biomarcadores ({biomarkers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {renderNoteSection(
              'Evaluaciones Generales',
              general,
              <Brain className="h-5 w-5 text-healz-blue" />,
              'No hay evaluaciones generales registradas'
            )}
          </TabsContent>
          
          <TabsContent value="panels" className="space-y-6">
            {renderNoteSection(
              'Evaluaciones por Panel de Salud',
              panels,
              <Activity className="h-5 w-5 text-healz-orange" />,
              'No hay evaluaciones por paneles específicos'
            )}
          </TabsContent>
          
          <TabsContent value="biomarkers" className="space-y-6">
            {renderNoteSection(
              'Evaluaciones por Biomarcador',
              biomarkers,
              <Heart className="h-5 w-5 text-healz-green" />,
              'No hay evaluaciones por biomarcadores individuales'
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <AddClinicalNoteDialog
        reportId={reportId}
        formId={formId}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        availablePanels={availablePanels}
        availableBiomarkers={availableBiomarkers}
      />
    </Card>
  );
};
