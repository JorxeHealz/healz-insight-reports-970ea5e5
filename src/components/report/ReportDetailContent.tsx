
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import { ReportTabs } from './ReportTabs';
import { ClinicalNotesStructured } from './ClinicalNotesStructured';

interface Report {
  id: string;
  form_id?: string;
  clinical_notes?: any[];
  panels?: Record<string, any>;
  biomarkers?: any[];
  recentBiomarkers?: any[];
}

interface ReportDetailContentProps {
  report: Report | any;
  isLoading: boolean;
  error: any;
}

export const ReportDetailContent: React.FC<ReportDetailContentProps> = ({
  report,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar el informe: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!report) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No se encontró el informe solicitado.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ReportHeader report={report} />
      
      <ReportTabs 
        report={report}
        clinicalNotesComponent={<ClinicalNotesStructured report={report} />}
      />
    </div>
  );
};
