
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Brain, Plus, FileText } from 'lucide-react';
import { EditableClinicalNote } from './EditableClinicalNote';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

interface Report {
  id: string;
  form_id?: string;
  clinical_notes?: any[];
  panels?: Record<string, any>;
  biomarkers?: any[];
}

interface ClinicalNotesStructuredProps {
  report: Report;
}

export const ClinicalNotesStructured: React.FC<ClinicalNotesStructuredProps> = ({ report }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { deleteClinicalNote } = useClinicalNotes(report.id);

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

  // Use clinical_notes instead of clinicalNotes to match the transformed data
  const notes = report.clinical_notes || [];
  const { general, panels, biomarkers } = categorizeNotes(notes);

  const availablePanels = report.panels ? Object.keys(report.panels) : [];
  const availableBiomarkers = report.biomarkers || [];

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteClinicalNote.mutateAsync(noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const renderNoteSection = (title: string, notes: any[], icon: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
          <Badge variant="outline" className="ml-auto">
            {notes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-healz-brown/60 text-center py-8">
            No hay evaluaciones en esta categoría
          </p>
        ) : (
          notes.map((note) => (
            <EditableClinicalNote
              key={note.id}
              note={note}
              reportId={report.id}
              onDelete={handleDeleteNote}
              isEvaluation={!!note.evaluation_type}
              availablePanels={availablePanels}
              availableBiomarkers={availableBiomarkers}
            />
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-healz-brown">Diagnóstico Clínico</h2>
          <p className="text-healz-brown/70 mt-1">
            Evaluaciones estructuradas por categorías
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      <div className="space-y-6">
        {renderNoteSection(
          'Evaluación General',
          general,
          <Brain className="h-5 w-5 text-healz-blue" />
        )}
        
        {renderNoteSection(
          'Evaluaciones por Panel',
          panels,
          <FileText className="h-5 w-5 text-healz-orange" />
        )}
        
        {renderNoteSection(
          'Evaluaciones por Biomarcador',
          biomarkers,
          <FileText className="h-5 w-5 text-healz-green" />
        )}
      </div>

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
