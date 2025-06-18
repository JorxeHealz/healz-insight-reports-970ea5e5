
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

const queryClient = new QueryClient()

function App() {
  return (
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
  )
}

export default App
