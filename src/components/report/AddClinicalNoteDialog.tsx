
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useClinicalNotes } from '../../hooks/useClinicalNotes';

type AddClinicalNoteDialogProps = {
  reportId: string;
  formId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddClinicalNoteDialog: React.FC<AddClinicalNoteDialogProps> = ({
  reportId,
  formId,
  open,
  onOpenChange
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  
  const { addClinicalNote } = useClinicalNotes(reportId);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      await addClinicalNote.mutateAsync({
        title,
        content,
        category,
        priority,
        formId
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setCategory('general');
      setPriority('medium');
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding clinical note:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setPriority('medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Nota Clínica</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-healz-brown">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la nota"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-healz-brown">Categoría</label>
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
              <label className="text-sm font-medium text-healz-brown">Prioridad</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-healz-brown">Contenido</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Contenido de la nota clínica..."
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
            {addClinicalNote.isPending ? 'Guardando...' : 'Agregar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
