
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Get assigned patients count
      const { data: assignedPatients, error: patientsError } = await supabase
        .from('patient_assignments')
        .select('patient_id')
        .eq('user_id', '00000000-0000-0000-0000-000000000000'); // Temporary UUID for development

      if (patientsError) throw patientsError;

      // Get total reports count for assigned patients
      const patientIds = assignedPatients?.map(p => p.patient_id) || [];
      
      let reportsCount = 0;
      let pendingFormsCount = 0;
      let alertsCount = 0;

      if (patientIds.length > 0) {
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('id')
          .in('patient_id', patientIds);

        if (reportsError) throw reportsError;
        reportsCount = reports?.length || 0;

        const { data: pendingForms, error: formsError } = await supabase
          .from('patient_forms')
          .select('id')
          .in('patient_id', patientIds)
          .eq('status', 'pending');

        if (formsError) throw formsError;
        pendingFormsCount = pendingForms?.length || 0;

        const { data: alerts, error: alertsError } = await supabase
          .from('alerts')
          .select('id')
          .in('patient_id', patientIds)
          .eq('is_read', false);

        if (alertsError) throw alertsError;
        alertsCount = alerts?.length || 0;
      }

      return {
        totalPatients: assignedPatients?.length || 0,
        totalReports: reportsCount,
        pendingForms: pendingFormsCount,
        unreadAlerts: alertsCount
      };
    },
  });
};
