
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUploadAnalytics } from '../../hooks/usePatientAnalytics';
import { Patient } from '../../types/supabase';
import { useToast } from '../ui/use-toast';
import { Upload } from 'lucide-react';

interface UploadAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string | null;
  patients: Patient[];
  onSuccess: () => void;
}

export const UploadAnalyticsDialog = ({
  open,
  onOpenChange,
  patientId,
  patients,
  onSuccess
}: UploadAnalyticsDialogProps) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || '');
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const uploadMutation = useUploadAnalytics();

  React.useEffect(() => {
    if (patientId) {
      setSelectedPatientId(patientId);
    }
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatientId || !file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un paciente y un archivo",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        patientId: selectedPatientId,
        file,
        notes: notes.trim() || undefined
      });

      toast({
        title: "Éxito",
        description: "Analítica subida correctamente",
      });

      // Reset form
      setFile(null);
      setNotes('');
      setSelectedPatientId('');
      
      onSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al subir la analítica",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type (PDF, images, etc.)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos PDF o imágenes (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Error", 
          description: "El archivo no puede superar los 10MB",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Analítica
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Archivo de Analítica</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            {file && (
              <p className="text-sm text-gray-500">
                Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agregar notas sobre esta analítica..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploadMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={uploadMutation.isPending || !selectedPatientId || !file}
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Analítica
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
