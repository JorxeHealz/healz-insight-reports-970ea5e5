
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, FileText, User, Plus, Package, Activity, Filter, Brain } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EditableClinicalNote } from './EditableClinicalNote';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type ClinicalNotesProps = {
  report: any;
};

type FilterType = 'all' | 'notes' | 'evaluations' | 'general' | 'panel' | 'biomarker';

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({ report }) => {
  // Ordenar las notas clínicas para que la evaluación general aparezca primero
  const sortedClinicalNotes = React.useMemo(() => {
    if (!report.clinicalNotes) return [];
    
    return [...report.clinicalNotes].sort((a, b) => {
      // Evaluación general siempre primera
      if (a.evaluation_type === 'general' && b.evaluation_type !== 'general') return -1;
      if (b.evaluation_type === 'general' && a.evaluation_type !== 'general') return 1;
      
      // Luego por fecha (más reciente primero)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [report.clinicalNotes]);

  const [selectedNoteId, setSelectedNoteId] = useState<string>(sortedClinicalNotes[0]?.id || '');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const { deleteClinicalNote } = useClinicalNotes(report.id);

  // Filter notes based on selected filter
  const filteredNotes = sortedClinicalNotes.filter((note: any) => {
    if (filter === 'all') return true;
    if (filter === 'notes') return !note.evaluation_type;
    if (filter === 'evaluations') return note.evaluation_type;
    if (filter === 'general') return note.evaluation_type === 'general';
    if (filter === 'panel') return note.evaluation_type === 'panel';
    if (filter === 'biomarker') return note.evaluation_type === 'biomarker';
    return true;
  });

  const selectedNote = filteredNotes.find((note: any) => note.id === selectedNoteId) || filteredNotes[0];

  const getEntryIcon = (note: any) => {
    if (!note.evaluation_type) return <FileText className="h-4 w-4 text-healz-brown" />;
    switch (note.evaluation_type) {
      case 'general': return <Brain className="h-4 w-4 text-healz-blue" />;
      case 'panel': return <Package className="h-4 w-4 text-healz-orange" />;
      case 'biomarker': return <Activity className="h-4 w-4 text-healz-green" />;
      default: return <FileText className="h-4 w-4 text-healz-brown" />;
    }
  };

  const getEntryTypeLabel = (note: any) => {
    if (!note.evaluation_type) return 'Nota';
    switch (note.evaluation_type) {
      case 'general': return 'Eval. General';
      case 'panel': return 'Eval. Panel';
      case 'biomarker': return 'Eval. Biomarcador';
      default: return 'Nota';
    }
  };

  const getTargetDisplay = (note: any) => {
    if (!note.target_id) return null;
    if (note.evaluation_type === 'panel') return `Panel: ${note.target_id}`;
    if (note.evaluation_type === 'biomarker') return `Biomarcador: ${note.target_id}`;
    return note.target_id;
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-healz-red/20 text-healz-red border-healz-red/30';
      case 'high': return 'bg-healz-orange/20 text-healz-orange border-healz-orange/30';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange border-healz-yellow/30';
      case 'low': return 'bg-healz-green/20 text-healz-green border-healz-green/30';
      default: return 'bg-healz-cream/20 text-healz-brown border-healz-cream/30';
    }
  };

  const getCriticalityLabel = (level?: string) => {
    switch (level) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        await deleteClinicalNote.mutateAsync(id);
        if (selectedNoteId === id && filteredNotes.length > 1) {
          const remainingNotes = filteredNotes.filter((note: any) => note.id !== id);
          setSelectedNoteId(remainingNotes[0]?.id || '');
        }
      } catch (error) {
        console.error('Error deleting clinical note:', error);
      }
    }
  };

  // Mock available panels and biomarkers - en una app real estos vendrían de los datos del informe
  const availablePanels = ['Cardiovascular', 'Metabólico', 'Hormonal', 'Inflamatorio', 'Nutricional', 'Renal', 'Hepático'];
  const availableBiomarkers = [
    { id: 'cholesterol_total', name: 'Colesterol Total' },
    { id: 'glucose', name: 'Glucosa' },
    { id: 'cortisol', name: 'Cortisol' },
    { id: 'tsh', name: 'TSH' },
    { id: 'vitamin_d', name: 'Vitamina D' },
    { id: 'testosterone', name: 'Testosterona' },
    { id: 'crp', name: 'Proteína C Reactiva' },
    { id: 'ldl', name: 'LDL Colesterol' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Sidebar con historial de evaluaciones */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Evaluaciones Clínicas
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddDialog(true)}
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 text-healz-brown/60" />
              <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
                <SelectTrigger className="h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo</SelectItem>
                  <SelectItem value="evaluations">Evaluaciones</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="panel">Paneles</SelectItem>
                  <SelectItem value="biomarker">Biomarcadores</SelectItem>
                  <SelectItem value="notes">Solo Notas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredNotes.map((note: any) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full p-3 text-left border-b border-healz-brown/10 hover:bg-healz-cream/20 transition-colors ${
                    selectedNoteId === note.id ? 'bg-healz-cream/30 border-l-4 border-l-healz-orange' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      {getEntryIcon(note)}
                      <span className="text-xs text-healz-brown/70">{note.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs h-4 px-1">
                        {getEntryTypeLabel(note)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-healz-brown mb-1">{note.title}</p>
                  
                  {note.evaluation_type && (
                    <div className="space-y-1">
                      {note.evaluation_score && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-healz-brown/60">Puntuación:</span>
                          <span className="text-xs font-medium text-healz-orange">{note.evaluation_score}/10</span>
                        </div>
                      )}
                      <Badge className={`text-xs h-4 px-1 ${getCriticalityColor(note.criticality_level || 'medium')}`}>
                        {getCriticalityLabel(note.criticality_level)}
                      </Badge>
                    </div>
                  )}
                  
                  {getTargetDisplay(note) && (
                    <p className="text-xs text-healz-brown/60 mt-1">🎯 {getTargetDisplay(note)}</p>
                  )}
                  <p className="text-xs text-healz-brown/60 mt-1">{note.author}</p>
                </button>
              ))}
              
              {filteredNotes.length === 0 && (
                <div className="p-4 text-center text-healz-brown/60">
                  <p className="text-sm">No hay evaluaciones para este filtro</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel principal con evaluación seleccionada */}
      <div className="lg:col-span-3">
        {selectedNote ? (
          <Card className="h-full">
            <CardHeader className="border-b border-healz-brown/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getEntryIcon(selectedNote)}
                    <CardTitle className="text-lg">{selectedNote.title}</CardTitle>
                    <Badge variant="outline">
                      {getEntryTypeLabel(selectedNote)}
                    </Badge>
                    {selectedNote.evaluation_type && (
                      <Badge className={`${getCriticalityColor(selectedNote.criticality_level || 'medium')}`}>
                        {getCriticalityLabel(selectedNote.criticality_level)}
                      </Badge>
                    )}
                    {selectedNote.is_auto_generated && (
                      <Badge variant="outline" className="text-xs bg-healz-blue/10 text-healz-blue">
                        Auto-generado
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-healz-brown/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedNote.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedNote.author}
                    </div>
                    {selectedNote.evaluation_score && (
                      <div className="flex items-center gap-1">
                        <span>Puntuación: {selectedNote.evaluation_score}/10</span>
                      </div>
                    )}
                    {getTargetDisplay(selectedNote) && (
                      <div className="flex items-center gap-1">
                        <span>🎯 {getTargetDisplay(selectedNote)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto">
              <EditableClinicalNote
                note={selectedNote}
                reportId={report.id}
                onDelete={handleDeleteNote}
                isEvaluation={!!selectedNote.evaluation_type}
                availablePanels={availablePanels}
                availableBiomarkers={availableBiomarkers}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <Brain className="h-12 w-12 text-healz-brown/40 mx-auto mb-4" />
              <p className="text-healz-brown/60 mb-4">No hay evaluaciones disponibles</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Evaluación
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddClinicalNoteDialog
        reportId={report.id}
        formId={report.form_id}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        availablePanels={availablePanels}
        availableBiomarkers={availableBiomarkers}
      />
    </div>
  );
};
