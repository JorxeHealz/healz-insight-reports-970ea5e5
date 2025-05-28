
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Patient } from '../../types/supabase';
import { useCreatePatient, useUpdatePatient } from '../../hooks/usePatients';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from '../../hooks/use-toast';

const patientSchema = z.object({
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  status: z.enum(['active', 'inactive', 'pending']),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PatientForm = ({ patient, onSuccess, onCancel }: PatientFormProps) => {
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: patient?.first_name || '',
      last_name: patient?.last_name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      date_of_birth: patient?.date_of_birth || '',
      gender: patient?.gender || 'other',
      status: patient?.status || 'active',
      notes: patient?.notes || '',
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (patient) {
        await updatePatient.mutateAsync({
          id: patient.id,
          ...data,
          phone: data.phone || null,
          date_of_birth: data.date_of_birth || null,
          notes: data.notes || null,
        });
        toast({
          title: "Paciente actualizado",
          description: `${data.first_name} ${data.last_name} ha sido actualizado correctamente`
        });
      } else {
        await createPatient.mutateAsync({
          ...data,
          phone: data.phone || null,
          date_of_birth: data.date_of_birth || null,
          notes: data.notes || null,
        });
        toast({
          title: "Paciente creado",
          description: `${data.first_name} ${data.last_name} ha sido creado correctamente`
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el paciente",
        variant: "destructive"
      });
    }
  };

  const isLoading = createPatient.isPending || updatePatient.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos *</FormLabel>
                <FormControl>
                  <Input placeholder="Apellidos del paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+34 123 456 789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notas adicionales sobre el paciente..."
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-healz-green hover:bg-healz-green/90">
            {isLoading ? 'Guardando...' : (patient ? 'Actualizar' : 'Crear')} Paciente
          </Button>
        </div>
      </form>
    </Form>
  );
};
