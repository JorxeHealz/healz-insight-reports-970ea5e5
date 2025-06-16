
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { Plus, Star } from 'lucide-react';
import { EvaluationType, CriticalityLevel, PanelInfo } from './types';

type CreateEvaluationDialogProps = {
  reportId: string;
  onCreateEvaluation: (data: {
    evaluation_type: EvaluationType;
    target_id?: string;
    title: string;
    content: string;
    evaluation_score?: number;
    criticality_level: CriticalityLevel;
  }) => void;
  availablePanels?: PanelInfo[];
  availableBiomarkers?: { id: string; name: string }[];
  disabled?: boolean;
};

export const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({
  onCreateEvaluation,
  availablePanels = [],
  availableBiomarkers = [],
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [evaluationType, setEvaluationType] = useState<EvaluationType>('general');
  const [targetId, setTargetId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [score, setScore] = useState(5);
  const [criticality, setCriticality] = useState<CriticalityLevel>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreateEvaluation({
      evaluation_type: evaluationType,
      target_id: evaluationType === 'general' ? undefined : targetId,
      title,
      content,
      evaluation_score: score,
      criticality_level: criticality
    });

    // Reset form
    setEvaluationType('general');
    setTargetId('');
    setTitle('');
    setContent('');
    setScore(5);
    setCriticality('medium');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Evaluación</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="evaluation-type">Tipo de Evaluación</Label>
              <Select value={evaluationType} onValueChange={(value: EvaluationType) => setEvaluationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Evaluación General</SelectItem>
                  <SelectItem value="panel">Por Panel</SelectItem>
                  <SelectItem value="biomarker">Por Biomarcador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {evaluationType === 'panel' && (
              <div>
                <Label htmlFor="target-panel">Panel</Label>
                <Select value={targetId} onValueChange={setTargetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar panel" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePanels.map((panel) => (
                      <SelectItem key={panel.name} value={panel.name}>
                        {panel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {evaluationType === 'biomarker' && (
              <div>
                <Label htmlFor="target-biomarker">Biomarcador</Label>
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
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la evaluación"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Contenido de la Evaluación</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Describe la evaluación, hallazgos y análisis..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="score">Puntuación (1-10)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value))}
                />
                <div className="flex">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 cursor-pointer ${i < score ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
                      onClick={() => setScore(i + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="criticality">Nivel de Criticidad</Label>
              <Select value={criticality} onValueChange={(value: CriticalityLevel) => setCriticality(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Evaluación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
