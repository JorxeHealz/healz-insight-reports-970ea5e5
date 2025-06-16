
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Brain, Package, Activity, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EditableClinicalNote } from './EditableClinicalNote';
import { AddClinicalNoteDialog } from './AddClinicalNoteDialog';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type ClinicalNotesStructuredProps = {
  report: any;
};

export const ClinicalNotesStructured: React.FC<ClinicalNotesStructuredProps> = ({ report }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'panel' | 'biomarker'>('general');
  const { deleteClinicalNote } = useClinicalNotes(report.id);

  // Organizar evaluaciones por tipo
  const evaluationsByType = React.useMemo(() => {
    if (!report.clinicalNotes) return { general: [], panel: [], biomarker: [] };
    
    return report.clinicalNotes.reduce((acc: any, note: any) => {
      if (note.evaluation_type === 'general') {
        acc.general.push(note);
      } else if (note.evaluation_type === 'panel') {
        acc.panel.push(note);
      } else if (note.evaluation_type === 'biomarker') {
        acc.biomarker.push(note);
      } else {
        // Migrar notas sin tipo a general
        acc.general.push({ ...note, evaluation_type: 'general' });
      }
      return acc;
    }, { general: [], panel: [], biomarker: [] });
  }, [report.clinicalNotes]);

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      try {
        await deleteClinicalNote.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting clinical note:', error);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Brain className="h-5 w-5" />;
      case 'panel': return <Package className="h-5 w-5" />;
      case 'biomarker': return <Activity className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'general': return 'Evaluación General';
      case 'panel': return 'Evaluaciones por Paneles';
      case 'biomarker': return 'Evaluaciones por Biomarcadores';
      default: return 'Evaluación General';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'general': return 'Análisis integral del estado de salud del paciente';
      case 'panel': return 'Evaluaciones específicas por grupos de biomarcadores';
      case 'biomarker': return 'Análisis detallado de biomarcadores individuales';
      default: return '';
    }
  };

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

  const currentEvaluations = evaluationsByType[selectedCategory] || [];

  return (
    <div className="space-y-6">
      {/* Header con selector de categoría */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-healz-brown mb-2">Diagnóstico Clínico</h2>
          <p className="text-healz-brown/70">Evaluaciones estructuradas por categoría</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Selector de categoría */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-healz-brown/60" />
        <Select value={selectedCategory} onValueChange={(value: 'general' | 'panel' | 'biomarker') => setSelectedCategory(value)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Evaluación General
              </div>
            </SelectItem>
            <SelectItem value="panel">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Por Paneles
              </div>
            </SelectItem>
            <SelectItem value="biomarker">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Por Biomarcadores
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resumen de la categoría actual */}
      <Card className="border-healz-orange/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {getCategoryIcon(selectedCategory)}
            <div>
              <CardTitle className="text-lg text-healz-brown">{getCategoryTitle(selectedCategory)}</CardTitle>
              <p className="text-sm text-healz-brown/70 mt-1">{getCategoryDescription(selectedCategory)}</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {currentEvaluations.length} evaluaciones
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de evaluaciones */}
      <div className="space-y-4">
        {currentEvaluations.length > 0 ? (
          currentEvaluations.map((note: any) => (
            <EditableClinicalNote
              key={note.id}
              note={note}
              reportId={report.id}
              onDelete={handleDeleteNote}
              isEvaluation={true}
              availablePanels={availablePanels}
              availableBiomarkers={availableBiomarkers}
            />
          ))
        ) : (
          <Card className="border-dashed border-healz-brown/20">
            <CardContent className="text-center py-12">
              <div className="text-healz-brown/40 mb-4">
                {getCategoryIcon(selectedCategory)}
              </div>
              <h3 className="text-lg font-medium text-healz-brown mb-2">
                No hay evaluaciones en esta categoría
              </h3>
              <p className="text-healz-brown/60 mb-4">
                {selectedCategory === 'general' && 'Comienza con una evaluación general del estado de salud del paciente'}
                {selectedCategory === 'panel' && 'Agrega evaluaciones específicas por grupos de biomarcadores'}
                {selectedCategory === 'biomarker' && 'Analiza biomarcadores individuales de forma detallada'}
              </p>
              <Button onClick={() => setShowAddDialog(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Evaluación
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
