import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBiomarkerCRUD } from '@/hooks/useBiomarkerCRUD';

interface AddBiomarkerDialogProps {
  patientId: string;
  analyticsId: string;
  analyticsDate: string;
  onSuccess: () => void;
}

interface Biomarker {
  id: string;
  name: string;
  unit: string;
}

export const AddBiomarkerDialog: React.FC<AddBiomarkerDialogProps> = ({
  patientId,
  analyticsId,
  analyticsDate,
  onSuccess
}) => {
  const [open, setOpen] = useState(false);
  const [selectedBiomarkerId, setSelectedBiomarkerId] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [availableBiomarkers, setAvailableBiomarkers] = useState<Biomarker[]>([]);
  const [loading, setLoading] = useState(false);

  const { createBiomarker } = useBiomarkerCRUD();

  useEffect(() => {
    const fetchAvailableBiomarkers = async () => {
      try {
        // Get all biomarkers
        const { data: allBiomarkers, error } = await supabase
          .from('biomarkers')
          .select('id, name, unit')
          .order('name');

        if (error) throw error;

        // Get existing biomarkers for this analytics_id
        const { data: existingBiomarkers, error: existingError } = await supabase
          .from('patient_biomarkers')
          .select('biomarker_id')
          .eq('patient_id', patientId)
          .eq('analytics_id', analyticsId);

        if (existingError) throw existingError;

        const existingIds = new Set(existingBiomarkers?.map(b => b.biomarker_id) || []);
        
        // Filter out biomarkers that already exist
        const available = allBiomarkers?.filter(b => !existingIds.has(b.id)) || [];
        setAvailableBiomarkers(available);
      } catch (error) {
        console.error('Error fetching biomarkers:', error);
      }
    };

    if (open) {
      fetchAvailableBiomarkers();
    }
  }, [open, patientId, analyticsId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBiomarkerId || !value) return;

    setLoading(true);
    
    try {
      await createBiomarker.mutateAsync({
        patient_id: patientId,
        biomarker_id: selectedBiomarkerId,
        value: parseFloat(value),
        analytics_id: analyticsId,
        date: analyticsDate
      });

      setOpen(false);
      setSelectedBiomarkerId('');
      setValue('');
      onSuccess();
    } catch (error) {
      console.error('Error creating biomarker:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedBiomarker = availableBiomarkers.find(b => b.id === selectedBiomarkerId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Biomarcador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Biomarcador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="biomarker">Biomarcador</Label>
            <Select value={selectedBiomarkerId} onValueChange={setSelectedBiomarkerId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar biomarcador..." />
              </SelectTrigger>
              <SelectContent>
                {availableBiomarkers.map((biomarker) => (
                  <SelectItem key={biomarker.id} value={biomarker.id}>
                    {biomarker.name} ({biomarker.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">
              Valor {selectedBiomarker && `(${selectedBiomarker.unit})`}
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ingrese el valor"
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <Label>Fecha:</Label>
            <div>{new Date(analyticsDate).toLocaleDateString('es-ES')}</div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedBiomarkerId || !value || loading}
            >
              {loading ? 'Agregando...' : 'Agregar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};