import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBiomarkerCRUD } from '@/hooks/useBiomarkerCRUD';

interface BiomarkerData {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
}

interface EditBiomarkerDialogProps {
  biomarker: BiomarkerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditBiomarkerDialog: React.FC<EditBiomarkerDialogProps> = ({
  biomarker,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { updateBiomarker } = useBiomarkerCRUD();

  useEffect(() => {
    if (biomarker && open) {
      setValue(biomarker.value.toString());
    }
  }, [biomarker, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!biomarker || !value) return;

    setLoading(true);
    
    try {
      await updateBiomarker.mutateAsync({
        id: biomarker.id,
        value: parseFloat(value)
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating biomarker:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!biomarker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Biomarcador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Biomarcador</Label>
            <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
              {biomarker.name}
            </div>
          </div>

          <div>
            <Label htmlFor="value">
              Valor ({biomarker.unit})
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ingrese el nuevo valor"
              required
            />
          </div>

          <div>
            <Label>Fecha</Label>
            <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
              {new Date(biomarker.date).toLocaleDateString('es-ES')}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!value || loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};