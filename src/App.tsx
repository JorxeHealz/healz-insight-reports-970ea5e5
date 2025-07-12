
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import PatientProfile from '@/pages/PatientProfile';
import PatientForms from '@/pages/PatientForms';
import PatientSpecificForms from '@/pages/PatientSpecificForms';
import PublicForm from '@/pages/PublicForm';
import Calendar from '@/pages/Calendar';
import Reports from '@/pages/Reports';
import NewReport from '@/pages/NewReport';
import ReportDetail from '@/pages/ReportDetail';
import { PatientAnalytics } from '@/pages/PatientAnalytics';
import DatabaseCleanup from '@/pages/DatabaseCleanup';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public form route - no layout */}
          <Route path="/formulario/:token" element={<PublicForm />} />
          
          {/* Main app routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pacientes" element={<Patients />} />
            <Route path="paciente/:patientSlug" element={<PatientProfile />} />
            <Route path="formularios" element={<PatientForms />} />
            <Route path="formularios/p/:patientSlug" element={<PatientSpecificForms />} />
            <Route path="analiticas" element={<PatientAnalytics />} />
            <Route path="calendario" element={<Calendar />} />
            <Route path="informes" element={<Reports />} />
            <Route path="informes/nuevo" element={<NewReport />} />
            <Route path="informes/:reportId" element={<ReportDetail />} />
            <Route path="limpieza" element={<DatabaseCleanup />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
