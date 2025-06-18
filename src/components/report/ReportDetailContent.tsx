
import React from 'react';
import { useReportData } from '../../hooks/useReportData';
import { ReportHeader } from './ReportHeader';
import { ReportTabs } from './ReportTabs';
import { VitalityScoreCard } from './VitalityScoreCard';
import { RiskBars } from './RiskBars';
import { BiologicalAgeCard } from './BiologicalAgeCard';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';

interface ReportDetailContentProps {
  reportId: string;
}

export const ReportDetailContent = ({ reportId }: ReportDetailContentProps) => {
  const { data: report, isLoading, error } = useReportData(reportId);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-healz-red mb-2">Error al cargar el informe</p>
          <p className="text-healz-brown/70 text-sm">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-healz-brown/70">No se encontró el informe</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header del reporte */}
      <ReportHeader report={report} />

      {/* Cards principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VitalityScoreCard 
          score={report.vitalityScore || 0} 
        />
        <RiskBars 
          risks={report.risks || {}} 
        />
        <BiologicalAgeCard 
          biologicalAge={report.biologicalAge || 35} 
          chronologicalAge={report.chronologicalAge || 32} 
        />
      </div>

      {/* Tabs con contenido detallado */}
      <ReportTabs report={report} />
    </div>
  );
};
