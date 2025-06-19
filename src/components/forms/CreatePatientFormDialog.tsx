
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { usePatients } from '../../hooks/usePatients';
import { useCreatePatientForm } from '../../hooks/usePatientForms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CreatePatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSuccess: () => void;
  onCreateError: (error: Error) => void;
  preselectedPatientId?: string;
}

export const CreatePatientFormDialog = ({ 
  open, 
  onOpenChange, 
  onCreateSuccess, 
  onCreateError,
  preselectedPatientId
}: CreatePatientFormDialogProps) => {
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatientId || '');
  const [notes, setNotes] = useState('');
  
  const { data: patients } = usePatients();
  const createForm = useCreatePatientForm();

  // Reset form when dialog opens/closes or preselectedPatientId changes
  React.useEffect(() => {
    if (open) {
      setSelectedPatientId(preselectedPatientId || '');
      setNotes('');
    }
  }, [open, preselectedPatientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatientId) {
      onCreateError(new Error('Debe seleccionar un paciente'));
      return;
    }

    try {
      await createForm.mutateAsync({
        patient_id: selectedPatientId,
        notes: notes || undefined
      });
      
      // Reset form
      setSelectedPatientId(preselectedPatientId || '');
      setNotes('');
      
      onCreateSuccess();
    } catch (error) {
      onCreateError(error as Error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Formulario</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select 
              value={selectedPatientId} 
              onValueChange={setSelectedPatientId}
              disabled={!!preselectedPatientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar paciente..." />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre este formulario..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createForm.isPending || !selectedPatientId}
              className="bg-healz-green hover:bg-healz-green/90"
            >
              {createForm.isPending ? 'Creando...' : 'Crear Formulario'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
