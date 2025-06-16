
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, FileText, User, Plus, Package, Activity, Filter } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EditableClinicalNote } from './EditableClinicalNote';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type ClinicalNotesProps = {
  report: any;
};

type FilterType = 'all' | 'notes' | 'evaluations';

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({ report }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(report.clinicalNotes?.[0]?.id || '');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const { deleteClinicalNote } = useClinicalNotes(report.id);

  // Filter notes based on selected filter
  const filteredNotes = report.clinicalNotes?.filter((note: any) => {
    if (filter === 'all') return true;
    if (filter === 'notes') return !note.evaluation_type;
    if (filter === 'evaluations') return note.evaluation_type;
    return true;
  }) || [];

  const selectedNote = filteredNotes.find((note: any) => note.id === selectedNoteId) || filteredNotes[0];

  const getEntryIcon = (note: any) => {
    if (!note.evaluation_type) return <FileText className="h-4 w-4 text-healz-brown" />;
    switch (note.evaluation_type) {
      case 'general': return <FileText className="h-4 w-4 text-healz-blue" />;
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

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-healz-red/20 text-healz-red';
      case 'high': return 'bg-healz-orange/20 text-healz-orange';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange';
      case 'low': return 'bg-healz-green/20 text-healz-green';
      default: return 'bg-healz-cream/20 text-healz-brown';
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

  // Mock available panels and biomarkers - in real app these would come from report data
  const availablePanels = ['Cardiovascular', 'Metabólico', 'Hormonal', 'Inflamatorio', 'Nutricional'];
  const availableBiomarkers = [
    { id: '1', name: 'Colesterol Total' },
    { id: '2', name: 'Glucosa' },
    { id: '3', name: 'Cortisol' },
    { id: '4', name: 'TSH' },
    { id: '5', name: 'Vitamina D' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Sidebar con historial de notas */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Historial
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
                  <SelectItem value="notes">Solo Notas</SelectItem>
                  <SelectItem value="evaluations">Solo Evaluaciones</SelectItem>
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
                      {note.evaluation_type && (
                        <Badge className={`text-xs h-4 px-1 ${getCriticalityColor(note.criticality_level || 'medium')}`}>
                          {note.criticality_level === 'critical' ? 'Crítica' :
                           note.criticality_level === 'high' ? 'Alta' : 
                           note.criticality_level === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-healz-brown">{note.title}</p>
                  {note.evaluation_score && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-healz-brown/60">Puntuación:</span>
                      <span className="text-xs font-medium text-healz-orange">{note.evaluation_score}/10</span>
                    </div>
                  )}
                  {note.target_id && (
                    <p className="text-xs text-healz-brown/60 mt-1">🎯 {note.target_id}</p>
                  )}
                  <p className="text-xs text-healz-brown/60 mt-1">{note.author}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel principal con nota seleccionada */}
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
                      <Badge className={getCriticalityColor(selectedNote.criticality_level || 'medium')}>
                        {selectedNote.criticality_level === 'critical' ? 'Crítica' :
                         selectedNote.criticality_level === 'high' ? 'Alta' : 
                         selectedNote.criticality_level === 'medium' ? 'Media' : 'Baja'}
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
                    {selectedNote.target_id && (
                      <div className="flex items-center gap-1">
                        <span>🎯 {selectedNote.target_id}</span>
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
              <p className="text-healz-brown/60 mb-4">No hay entradas disponibles</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Entrada
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
