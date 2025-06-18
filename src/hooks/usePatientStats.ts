
import { useMemo } from 'react';
import { useAssignedPatients } from './useAssignedPatients';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const usePatientStats = () => {
  const { data: patients = [] } = useAssignedPatients();

  // Obtener estadísticas de formularios pendientes
  const { data: pendingForms = 0 } = useQuery({
    queryKey: ['pendingForms'],
    queryFn: async () => {
      const patientIds = patients.map(p => p.id);
      if (patientIds.length === 0) return 0;

      const { count, error } = await supabase
        .from('patient_forms')
        .select('id', { count: 'exact' })
        .in('patient_id', patientIds)
        .eq('status', 'pending');

      if (error) throw error;
      return count || 0;
    },
    enabled: patients.length > 0,
  });

  // Obtener actividad reciente (nuevos pacientes en las últimas 4 semanas)
  const { data: weeklyActivity = [] } = useQuery({
    queryKey: ['weeklyActivity'],
    queryFn: async () => {
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const patientIds = patients.map(p => p.id);
      if (patientIds.length === 0) return [];

      const { data, error } = await supabase
        .from('patients')
        .select('created_at')
        .in('id', patientIds)
        .gte('created_at', fourWeeksAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Agrupar por semanas
      const weeks = Array.from({ length: 4 }, (_, i) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
        return {
          week: `Sem ${i + 1}`,
          count: 0,
        };
      });

      data?.forEach(patient => {
        const patientDate = new Date(patient.created_at);
        const weekIndex = Math.floor((Date.now() - patientDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weekIndex >= 0 && weekIndex < 4) {
          weeks[3 - weekIndex].count++;
        }
      });

      return weeks;
    },
    enabled: patients.length > 0,
  });

  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const activeMonth = patients.filter(patient => {
      if (!patient.last_visit) return false;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(patient.last_visit) >= oneMonthAgo;
    }).length;

    const noConsultation = patients.filter(patient => !patient.next_visit).length;

    return {
      totalPatients,
      activeMonth,
      noConsultation,
      pendingForms,
      weeklyActivity,
    };
  }, [patients, pendingForms, weeklyActivity]);

  return stats;
};
