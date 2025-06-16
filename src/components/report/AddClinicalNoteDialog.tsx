
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { FileText, Brain } from 'lucide-react';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';
import { EvaluationTypeSelector } from './dialog/EvaluationTypeSelector';
import { TargetSelector } from './dialog/TargetSelector';
import { EvaluationScoreInput } from './dialog/EvaluationScoreInput';
import { FormFields } from './dialog/FormFields';
import { useTitleSuggestions } from './dialog/useTitleSuggestions';
import { AddClinicalNoteDialogProps, AddClinicalNoteFormData } from './dialog/types';

export const AddClinicalNoteDialog: React.FC<AddClinicalNoteDialogProps> = ({
  reportId,
  formId,
  open,
  onOpenChange,
  availablePanels = [],
  availableBiomarkers = []
}) => {
  const [formData, setFormData] = useState<AddClinicalNoteFormData>({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    entryType: 'evaluation',
    evaluationType: 'general',
    targetId: '',
    evaluationScore: 5,
    criticalityLevel: 'medium'
  });
  
  const { addClinicalNote } = useClinicalNotes(reportId);

  useTitleSuggestions(
    formData.evaluationType,
    formData.targetId,
    availableBiomarkers,
    formData.title,
    (title) => setFormData(prev => ({ ...prev, title }))
  );

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    if (formData.entryType === 'evaluation' && formData.evaluationType !== 'general' && !formData.targetId.trim()) {
      alert('Por favor selecciona un panel o biomarcador para la evaluación específica');
      return;
    }
    
    try {
      await addClinicalNote.mutateAsync({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        priority: formData.priority,
        formId,
        evaluationType: formData.entryType === 'evaluation' ? formData.evaluationType : undefined,
        targetId: formData.entryType === 'evaluation' && formData.evaluationType !== 'general' ? formData.targetId : undefined,
        evaluationScore: formData.entryType === 'evaluation' ? formData.evaluationScore : undefined,
        criticalityLevel: formData.entryType === 'evaluation' ? formData.criticalityLevel : 'medium'
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding clinical note:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      entryType: 'evaluation',
      evaluationType: 'general',
      targetId: '',
      evaluationScore: 5,
      criticalityLevel: 'medium'
    });
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const updateFormData = (updates: Partial<AddClinicalNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getEntryTypeIcon = () => {
    if (formData.entryType === 'note') return <FileText className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

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
          <EvaluationTypeSelector
            value={formData.evaluationType}
            onChange={(evaluationType) => updateFormData({ evaluationType })}
          />

          <TargetSelector
            evaluationType={formData.evaluationType}
            targetId={formData.targetId}
            onTargetChange={(targetId) => updateFormData({ targetId })}
            availablePanels={availablePanels}
            availableBiomarkers={availableBiomarkers}
          />

          <FormFields
            formData={formData}
            onFormDataChange={updateFormData}
          />

          {formData.entryType === 'evaluation' && (
            <EvaluationScoreInput
              score={formData.evaluationScore}
              onScoreChange={(evaluationScore) => updateFormData({ evaluationScore })}
            />
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={addClinicalNote.isPending || !formData.title.trim() || !formData.content.trim()}
          >
            {addClinicalNote.isPending ? 'Guardando...' : formData.entryType === 'note' ? 'Agregar' : 'Crear Evaluación'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
