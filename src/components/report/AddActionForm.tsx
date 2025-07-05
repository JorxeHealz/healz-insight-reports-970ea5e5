
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, X } from 'lucide-react';
import { useActionPlans } from '../../hooks/useActionPlans';

type AddActionFormProps = {
  category: string;
  reportId: string;
  formId: string;
  supportsDosage?: boolean;
  onCancel: () => void;
};

export const AddActionForm: React.FC<AddActionFormProps> = ({ 
  category, 
  reportId, 
  formId,
  supportsDosage = true,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    duration: '',
    dosage: ''
  });

  const { createActionPlan } = useActionPlans(reportId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const actionPlanData = {
      report_id: reportId,
      form_id: formId,
      category,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      duration: formData.duration || undefined,
      dosage: formData.dosage || undefined
    };

    try {
      await createActionPlan.mutateAsync(actionPlanData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        duration: '',
        dosage: ''
      });
      onCancel();
    } catch (error) {
      console.error('Error creating action plan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-healz-cream/50 p-3 rounded-lg border border-healz-brown/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título de la nueva acción"
            className="font-medium text-sm"
            required
          />
          <Select 
            value={formData.priority} 
            onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción de la acción"
          className="text-xs resize-none"
          rows={2}
          required
        />
        
        {supportsDosage && (
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="Dosis (opcional)"
              className="text-xs"
            />
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="Duración (opcional)"
              className="text-xs"
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={createActionPlan.isPending || !formData.title.trim() || !formData.description.trim()}
            className="flex-1"
          >
            <Plus className="h-3 w-3 mr-1" />
            {createActionPlan.isPending ? 'Agregando...' : 'Agregar'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            <X className="h-3 w-3 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
};
