
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePatients } from '../../hooks/usePatients';
import { useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '../../hooks/useAppointments';
import { toast } from 'sonner';
import moment from 'moment';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    appointment: any;
    patient: any;
  };
}

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  isCreating: boolean;
}

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  isOpen,
  onClose,
  event,
  isCreating,
}) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    appointment_type: 'presencial' as 'presencial' | 'videollamada' | 'telefonica',
    location: '',
    meeting_url: '',
    notes: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'rescheduled',
  });

  const { data: patients = [] } = usePatients();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  useEffect(() => {
    if (event) {
      const appointment = event.resource.appointment;
      const patient = event.resource.patient;

      setFormData({
        patient_id: appointment?.patient_id || '',
        title: appointment?.title || `Consulta ${patient ? `- ${patient.first_name} ${patient.last_name}` : ''}`,
        description: appointment?.description || '',
        start_time: moment(event.start).format('YYYY-MM-DDTHH:mm'),
        end_time: moment(event.end).format('YYYY-MM-DDTHH:mm'),
        appointment_type: appointment?.appointment_type || 'presencial',
        location: appointment?.location || '',
        meeting_url: appointment?.meeting_url || '',
        notes: appointment?.notes || '',
        status: appointment?.status || 'scheduled',
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patient_id) {
      toast.error('Por favor selecciona un paciente');
      return;
    }

    try {
      const appointmentData = {
        patient_id: formData.patient_id,
        professional_id: 'temp-professional-id', // TODO: reemplazar con auth.uid()
        title: formData.title,
        description: formData.description || null,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        appointment_type: formData.appointment_type,
        location: formData.location || null,
        meeting_url: formData.meeting_url || null,
        notes: formData.notes || null,
        status: formData.status,
        created_by: null, // TODO: reemplazar con auth.uid() cuando tengamos auth
      };

      if (isCreating) {
        await createMutation.mutateAsync(appointmentData);
        toast.success('Cita creada exitosamente');
      } else {
        await updateMutation.mutateAsync({
          id: event!.id,
          ...appointmentData,
        });
        toast.success('Cita actualizada exitosamente');
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      toast.error('Error al guardar la cita');
    }
  };

  const handleDelete = async () => {
    if (!event?.id || isCreating) return;

    try {
      await deleteMutation.mutateAsync(event.id);
      toast.success('Cita eliminada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      toast.error('Error al eliminar la cita');
    }
  };

  const getSelectedPatient = () => {
    return patients.find(p => p.id === formData.patient_id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#3A2E1C]">
            {isCreating ? 'Nueva Cita' : 'Editar Cita'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selección de paciente */}
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select 
              value={formData.patient_id} 
              onValueChange={(value) => {
                const selectedPatient = patients.find(p => p.id === value);
                setFormData(prev => ({
                  ...prev,
                  patient_id: value,
                  title: selectedPatient 
                    ? `Consulta - ${selectedPatient.first_name} ${selectedPatient.last_name}`
                    : prev.title
                }));
              }}
            >
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

          {/* Información del paciente seleccionado */}
          {getSelectedPatient() && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                <p><strong>Email:</strong> {getSelectedPatient()?.email}</p>
                <p><strong>Teléfono:</strong> {getSelectedPatient()?.phone || 'No disponible'}</p>
              </div>
            </div>
          )}

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Fechas y horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Inicio</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Fin</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Tipo de cita */}
          <div className="space-y-2">
            <Label>Tipo de Cita</Label>
            <Select 
              value={formData.appointment_type} 
              onValueChange={(value: 'presencial' | 'videollamada' | 'telefonica') => 
                setFormData(prev => ({ ...prev, appointment_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="videollamada">Videollamada</SelectItem>
                <SelectItem value="telefonica">Telefónica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ubicación (solo para presencial) */}
          {formData.appointment_type === 'presencial' && (
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Dirección de la consulta"
              />
            </div>
          )}

          {/* URL de reunión (solo para videollamada) */}
          {formData.appointment_type === 'videollamada' && (
            <div className="space-y-2">
              <Label htmlFor="meeting_url">URL de Reunión</Label>
              <Input
                id="meeting_url"
                type="url"
                value={formData.meeting_url}
                onChange={(e) => setFormData(prev => ({ ...prev, meeting_url: e.target.value }))}
                placeholder="https://meet.google.com/..."
              />
            </div>
          )}

          {/* Estado (solo para edición) */}
          {!isCreating && (
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="rescheduled">Reagendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Motivo de la consulta..."
              rows={3}
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas adicionales..."
              rows={2}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-4">
            <div>
              {!isCreating && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#E48D58] hover:bg-[#CD4631]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Guardando...'
                  : isCreating
                  ? 'Crear Cita'
                  : 'Actualizar Cita'
                }
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
