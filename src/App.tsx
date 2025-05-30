
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import NewReport from './pages/NewReport';
import ReportDetail from './pages/ReportDetail';
import PatientForms from './pages/PatientForms';
import PublicForm from './pages/PublicForm';
import DatabaseCleanup from './pages/DatabaseCleanup';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/form/:token" element={<PublicForm />} />
          <Route path="/cleanup" element={<DatabaseCleanup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="patients" element={<Patients />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/new" element={<NewReport />} />
            <Route path="reports/:id" element={<ReportDetail />} />
            <Route path="patient-forms" element={<PatientForms />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
