
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Star } from 'lucide-react';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type EditClinicalNoteDialogProps = {
  note: {
    id: string;
    title: string;
    content: string;
    category: string;
    priority: string;
    evaluation_type?: string;
    target_id?: string;
    evaluation_score?: number;
    criticality_level?: string;
  };
  reportId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEvaluation?: boolean;
  availablePanels?: string[];
  availableBiomarkers?: { id: string; name: string }[];
};

export const EditClinicalNoteDialog: React.FC<EditClinicalNoteDialogProps> = ({
  note,
  reportId,
  open,
  onOpenChange,
  isEvaluation = false,
  availablePanels = [],
  availableBiomarkers = []
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [priority, setPriority] = useState(note.priority);
  const [evaluationType, setEvaluationType] = useState(note.evaluation_type || 'general');
  const [targetId, setTargetId] = useState(note.target_id || '');
  const [evaluationScore, setEvaluationScore] = useState(note.evaluation_score || 5);
  const [criticalityLevel, setCriticalityLevel] = useState(note.criticality_level || 'medium');
  
  const { updateClinicalNote } = useClinicalNotes(reportId);

  const handleSave = async () => {
    try {
      await updateClinicalNote.mutateAsync({
        id: note.id,
        title,
        content,
        category,
        priority,
        evaluationType: isEvaluation ? (evaluationType as 'general' | 'panel' | 'biomarker') : undefined,
        targetId: isEvaluation && evaluationType !== 'general' ? targetId : undefined,
        evaluationScore: isEvaluation ? evaluationScore : undefined,
        criticalityLevel: isEvaluation ? criticalityLevel : undefined
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating clinical note:', error);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setPriority(note.priority);
    setEvaluationType(note.evaluation_type || 'general');
    setTargetId(note.target_id || '');
    setEvaluationScore(note.evaluation_score || 5);
    setCriticalityLevel(note.criticality_level || 'medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEvaluation ? 'Editar Evaluación Clínica' : 'Editar Nota Clínica'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isEvaluation && (
            <div>
              <Label className="text-sm font-medium text-healz-brown">Tipo de Evaluación</Label>
              <Select value={evaluationType} onValueChange={setEvaluationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Evaluación General</SelectItem>
                  <SelectItem value="panel">Evaluación por Panel</SelectItem>
                  <SelectItem value="biomarker">Evaluación por Biomarcador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {isEvaluation && evaluationType === 'panel' && (
            <div>
              <Label className="text-sm font-medium text-healz-brown">Panel</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar panel" />
                </SelectTrigger>
                <SelectContent>
                  {availablePanels.map((panel) => (
                    <SelectItem key={panel} value={panel}>
                      {panel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isEvaluation && evaluationType === 'biomarker' && (
            <div>
              <Label className="text-sm font-medium text-healz-brown">Biomarcador</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar biomarcador" />
                </SelectTrigger>
                <SelectContent>
                  {availableBiomarkers.map((biomarker) => (
                    <SelectItem key={biomarker.id} value={biomarker.id}>
                      {biomarker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-healz-brown">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-healz-brown">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="metabolic">Metabólico</SelectItem>
                  <SelectItem value="hormonal">Hormonal</SelectItem>
                  <SelectItem value="inflammatory">Inflamatorio</SelectItem>
                  <SelectItem value="nutritional">Nutricional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-healz-brown">
                {isEvaluation ? 'Nivel de Criticidad' : 'Prioridad'}
              </Label>
              <Select 
                value={isEvaluation ? criticalityLevel : priority} 
                onValueChange={isEvaluation ? setCriticalityLevel : setPriority}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  {isEvaluation && <SelectItem value="critical">Crítica</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEvaluation && (
            <div>
              <Label className="text-sm font-medium text-healz-brown">Puntuación (1-10)</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={evaluationScore}
                  onChange={(e) => setEvaluationScore(parseInt(e.target.value))}
                  className="w-20"
                />
                <div className="flex">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 cursor-pointer ${i < evaluationScore ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
                      onClick={() => setEvaluationScore(i + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-sm font-medium text-healz-brown">Contenido</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Contenido..."
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateClinicalNote.isPending}
          >
            {updateClinicalNote.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
