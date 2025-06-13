
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Edit2, Save, X, Trash2 } from 'lucide-react';
import { useActionPlans } from '../../hooks/useActionPlans';

type EditableActionItemProps = {
  item: any;
  reportId: string;
  onDelete: (id: string) => void;
};

export const EditableActionItem: React.FC<EditableActionItemProps> = ({ 
  item, 
  reportId, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: item.title,
    description: item.description,
    priority: item.priority,
    duration: item.duration || '',
    dosage: item.dosage || ''
  });

  const { updateActionPlan } = useActionPlans(reportId);

  const handleSave = async () => {
    try {
      await updateActionPlan.mutateAsync({
        id: item.id,
        ...editData
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving action plan:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: item.title,
      description: item.description,
      priority: item.priority,
      duration: item.duration || '',
      dosage: item.dosage || ''
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-healz-cream/30 p-3 rounded-lg border border-healz-brown/10">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="font-medium text-sm"
              placeholder="Título de la acción"
            />
            <Select 
              value={editData.priority} 
              onValueChange={(value) => setEditData({ ...editData, priority: value })}
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
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="text-xs resize-none"
            rows={2}
            placeholder="Descripción de la acción"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={editData.dosage}
              onChange={(e) => setEditData({ ...editData, dosage: e.target.value })}
              placeholder="Dosis (opcional)"
              className="text-xs"
            />
            <Input
              value={editData.duration}
              onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
              placeholder="Duración (opcional)"
              className="text-xs"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateActionPlan.isPending}
              className="flex-1"
            >
              <Save className="h-3 w-3 mr-1" />
              {updateActionPlan.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-healz-cream/30 p-3 rounded-lg border border-healz-brown/10">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-healz-brown">{item.title}</h4>
        <div className="flex items-center gap-1">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              item.priority === 'high' ? 'bg-healz-red/20 text-healz-red' :
              item.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange' :
              'bg-healz-green/20 text-healz-green'
            }`}
          >
            {item.priority === 'high' ? 'Alta' : 
             item.priority === 'medium' ? 'Media' : 'Baja'}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item.id)}
            className="h-6 w-6 p-0 text-healz-red hover:text-healz-red"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-healz-brown/70">{item.description}</p>
      {item.dosage && (
        <p className="text-xs text-healz-brown/60 mt-1">
          <strong>Dosis:</strong> {item.dosage}
        </p>
      )}
      {item.duration && (
        <p className="text-xs text-healz-brown/60">
          <strong>Duración:</strong> {item.duration}
        </p>
      )}
    </div>
  );
};
