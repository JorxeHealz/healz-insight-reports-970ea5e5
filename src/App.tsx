
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import Index from "./pages/Index"
import Patients from "./pages/Patients"
import PatientProfile from "./pages/PatientProfile"
import PatientForms from "./pages/PatientForms"
import PublicForm from "./pages/PublicForm"
import Dashboard from "./pages/Dashboard"
import NewReport from "./pages/NewReport"
import ReportDetail from "./pages/ReportDetail"
import Reports from "./pages/Reports"
import NotFound from "./pages/NotFound"
import DatabaseCleanup from "./pages/DatabaseCleanup"
import Calendar from "./pages/Calendar"
import React, { Component, ReactNode } from "react"

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-healz-cream">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold text-healz-brown mb-4">Algo salió mal</h2>
            <p className="text-healz-brown/70 mb-4">Ha ocurrido un error inesperado:</p>
            <pre className="text-sm bg-red-50 p-4 rounded border text-left text-red-800 mb-4">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-healz-orange text-white px-4 py-2 rounded hover:bg-healz-red"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/form/:token" element={<PublicForm />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="patients/:slug" element={<PatientProfile />} />
                <Route path="paciente/:slug" element={<PatientProfile />} />
                <Route path="patients/:patientId/forms" element={<PatientForms />} />
                <Route path="reports" element={<Reports />} />
                <Route path="reports/new" element={<NewReport />} />
                <Route path="reports/:id" element={<ReportDetail />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="cleanup" element={<DatabaseCleanup />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App
