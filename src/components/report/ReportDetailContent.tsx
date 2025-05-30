
import React from 'react';
import { ReportHeader } from './ReportHeader';
import { ReportTabs } from './ReportTabs';

interface ReportDetailContentProps {
  report: any;
  isLoading: boolean;
  error: Error | null;
}

export const ReportDetailContent: React.FC<ReportDetailContentProps> = ({
  report,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-healz-red/10 text-healz-red p-4 rounded-md">
        Error al cargar el informe: {error.message}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8 text-healz-brown/70">
        Informe no encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportHeader />
      <ReportTabs report={report} patientId={report.patient?.id} />
    </div>
  );
};
