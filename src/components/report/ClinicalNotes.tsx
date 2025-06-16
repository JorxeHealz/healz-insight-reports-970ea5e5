
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { ClinicalNotesHeader } from './clinical-notes/ClinicalNotesHeader';
import { ClinicalNotesList } from './clinical-notes/ClinicalNotesList';
import { ClinicalNotesPanel } from './clinical-notes/ClinicalNotesPanel';
import { FilterType, ClinicalNote } from './clinical-notes/types';

type ClinicalNotesProps = {
  report: any;
};

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
            <ClinicalNotesHeader
              filter={filter}
              onFilterChange={setFilter}
              onAddClick={() => setShowAddDialog(true)}
            />
          </CardHeader>
          <CardContent className="p-0">
            <ClinicalNotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              onNoteSelect={setSelectedNoteId}
            />
          </CardContent>
        </Card>
      </div>

      {/* Panel principal con evaluación seleccionada */}
      <div className="lg:col-span-3">
        <ClinicalNotesPanel
          selectedNote={selectedNote}
          reportId={report.id}
          onDelete={handleDeleteNote}
          onAddClick={() => setShowAddDialog(true)}
          availablePanels={availablePanels}
          availableBiomarkers={availableBiomarkers}
        />
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
