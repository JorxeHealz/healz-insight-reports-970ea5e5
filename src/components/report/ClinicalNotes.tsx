
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, FileText, User, Plus } from 'lucide-react';
import { EditableClinicalNote } from './EditableClinicalNote';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type ClinicalNotesProps = {
  report: any;
};

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({ report }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(report.clinicalNotes?.[0]?.id || '');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { deleteClinicalNote } = useClinicalNotes(report.id);

  const selectedNote = report.clinicalNotes?.find((note: any) => note.id === selectedNoteId) || report.clinicalNotes?.[0];

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota clínica?')) {
      try {
        await deleteClinicalNote.mutateAsync(id);
        // Si era la nota seleccionada, seleccionar la primera disponible
        if (selectedNoteId === id && report.clinicalNotes?.length > 1) {
          const remainingNotes = report.clinicalNotes.filter((note: any) => note.id !== id);
          setSelectedNoteId(remainingNotes[0]?.id || '');
        }
      } catch (error) {
        console.error('Error deleting clinical note:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Sidebar con historial de notas */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Historial de Notas
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
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {report.clinicalNotes?.map((note: any) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full p-3 text-left border-b border-healz-brown/10 hover:bg-healz-cream/20 transition-colors ${
                    selectedNoteId === note.id ? 'bg-healz-cream/30 border-l-4 border-l-healz-orange' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-healz-brown/70">{note.date}</span>
                    <span className={`text-xs px-1 rounded ${
                      note.priority === 'high' ? 'bg-healz-red/20 text-healz-red' :
                      note.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange' :
                      'bg-healz-green/20 text-healz-green'
                    }`}>
                      {note.priority === 'high' ? 'Alta' : 
                       note.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-healz-brown">{note.title}</p>
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
                  <CardTitle className="text-lg">{selectedNote.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-healz-brown/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedNote.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedNote.author}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto">
              <EditableClinicalNote
                note={selectedNote}
                reportId={report.id}
                onDelete={handleDeleteNote}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <p className="text-healz-brown/60 mb-4">No hay notas clínicas disponibles</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Nota
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
      />
    </div>
  );
};
