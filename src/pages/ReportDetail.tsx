
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { ReportHeader } from '../components/report/ReportHeader';
import { ReportTabs } from '../components/report/ReportTabs';
import { ReportSummary } from '../components/report/ReportSummary';
import { supabase } from '../lib/supabase';
import { mockReportData } from '../__mocks__/mockReport';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch report data - we'll use mock data for now
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['patient-report', id],
    queryFn: async () => {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll return mock data
      return mockReportData;
    },
    enabled: !!id
  });

  return (
    <Layout title="">
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-healz-red/10 text-healz-red p-4 rounded-md">
            Error al cargar el informe. Por favor, inténtalo de nuevo.
          </div>
        ) : report ? (
          <div className="space-y-6">
            <ReportHeader />
            <ReportTabs />
            <ReportSummary report={report} />
          </div>
        ) : (
          <div className="text-center py-8 text-healz-brown/70">
            Informe no encontrado.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportDetail;
