import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Star, FileText, Package, Activity, Brain } from 'lucide-react';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type AddClinicalNoteDialogProps = {
  reportId: string;
  formId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePanels?: string[];
  availableBiomarkers?: { id: string; name: string }[];
};

export const AddClinicalNoteDialog: React.FC<AddClinicalNoteDialogProps> = ({
  reportId,
  formId,
  open,
  onOpenChange,
  availablePanels = [],
  availableBiomarkers = []
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [entryType, setEntryType] = useState<'note' | 'evaluation'>('evaluation');
  const [evaluationType, setEvaluationType] = useState<'general' | 'panel' | 'biomarker'>('general');
  const [targetId, setTargetId] = useState('');
  const [evaluationScore, setEvaluationScore] = useState(5);
  const [criticalityLevel, setCriticalityLevel] = useState('medium');
  
  const { addClinicalNote } = useClinicalNotes(reportId);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    // Para evaluaciones específicas, validar que se haya seleccionado un target
    if (entryType === 'evaluation' && evaluationType !== 'general' && !targetId.trim()) {
      alert('Por favor selecciona un panel o biomarcador para la evaluación específica');
      return;
    }
    
    try {
      await addClinicalNote.mutateAsync({
        title,
        content,
        category,
        priority,
        formId,
        evaluationType: entryType === 'evaluation' ? evaluationType : undefined,
        targetId: entryType === 'evaluation' && evaluationType !== 'general' ? targetId : undefined,
        evaluationScore: entryType === 'evaluation' ? evaluationScore : undefined,
        criticalityLevel: entryType === 'evaluation' ? criticalityLevel : 'medium'
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding clinical note:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setPriority('medium');
    setEntryType('evaluation');
    setEvaluationType('panel');
    setTargetId('');
    setEvaluationScore(5);
    setCriticalityLevel('medium');
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const getEntryTypeIcon = () => {
    if (entryType === 'note') return <FileText className="h-4 w-4" />;
    switch (evaluationType) {
      case 'general': return <Brain className="h-4 w-4" />;
      case 'panel': return <Package className="h-4 w-4" />;
      case 'biomarker': return <Activity className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Sugerencias de títulos basadas en el tipo de evaluación
  const getTitleSuggestion = () => {
    if (entryType === 'note') return '';
    
    switch (evaluationType) {
      case 'general':
        return 'Evaluación General del Estado de Salud';
      case 'panel':
        return targetId ? `Evaluación Panel ${targetId}` : 'Evaluación de Panel Específico';
      case 'biomarker':
        const biomarker = availableBiomarkers.find(b => b.id === targetId);
        return biomarker ? `Evaluación ${biomarker.name}` : 'Evaluación de Biomarcador Específico';
      default:
        return '';
    }
  };

  React.useEffect(() => {
    const suggestion = getTitleSuggestion();
    if (suggestion && !title) {
      setTitle(suggestion);
    }
  }, [evaluationType, targetId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getEntryTypeIcon()}
            Nueva Evaluación Clínica
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-healz-brown">Tipo de Evaluación</Label>
            <Select value={evaluationType} onValueChange={(value: 'general' | 'panel' | 'biomarker') => setEvaluationType(value)}>
              <SelectTrigger>
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
                    Evaluación por Panel
                  </div>
                </SelectItem>
                <SelectItem value="biomarker">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Evaluación por Biomarcador
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {evaluationType === 'panel' && (
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

          {evaluationType === 'biomarker' && (
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
              placeholder={entryType === 'note' ? 'Título de la nota' : 'Título de la evaluación'}
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
                {entryType === 'note' ? 'Prioridad' : 'Nivel de Criticidad'}
              </Label>
              <Select 
                value={entryType === 'note' ? priority : criticalityLevel} 
                onValueChange={entryType === 'note' ? setPriority : setCriticalityLevel}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  {entryType === 'evaluation' && <SelectItem value="critical">Crítica</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          {entryType === 'evaluation' && (
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
                <span className="text-sm text-healz-brown/70">
                  {evaluationScore <= 3 ? 'Crítico' : 
                   evaluationScore <= 5 ? 'Requiere atención' :
                   evaluationScore <= 7 ? 'Aceptable' : 'Excelente'}
                </span>
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-sm font-medium text-healz-brown">Contenido</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder={
                entryType === 'note' 
                  ? 'Contenido de la nota clínica...' 
                  : evaluationType === 'general'
                    ? 'Evaluación general del estado de salud del paciente, considerando todos los parámetros analizados...'
                    : evaluationType === 'panel'
                      ? 'Análisis específico del panel seleccionado, evaluación de biomarcadores relacionados y recomendaciones...'
                      : 'Evaluación detallada del biomarcador específico, interpretación de valores y recomendaciones...'
              }
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={addClinicalNote.isPending || !title.trim() || !content.trim()}
          >
            {addClinicalNote.isPending ? 'Guardando...' : entryType === 'note' ? 'Agregar' : 'Crear Evaluación'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
