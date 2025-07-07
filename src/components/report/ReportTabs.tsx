
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ReportSummary } from './ReportSummary';
import { ReportPanels } from './ReportPanels';
import { KeyFindings } from './KeyFindings';
import { ActionPlan } from './ActionPlan';
import { ClinicalNotesStructured } from './ClinicalNotesStructured';
import { FileText, Activity, Target, Brain, Search } from 'lucide-react';

interface ReportTabsProps {
  report: any;
  clinicalNotesComponent?: React.ReactNode;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ 
  report, 
  clinicalNotesComponent 
}) => {
  return (
    <Tabs defaultValue="summary" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Resumen
        </TabsTrigger>
        <TabsTrigger value="panels" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Paneles
        </TabsTrigger>
        <TabsTrigger value="key-findings" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Hallazgos Clave
        </TabsTrigger>
        <TabsTrigger value="diagnosis" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Diagnóstico
        </TabsTrigger>
        <TabsTrigger value="action-plan" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Plan de Acción
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-6">
        <ReportSummary report={report} />
      </TabsContent>

      <TabsContent value="panels" className="space-y-6">
        <ReportPanels report={report} />
      </TabsContent>

      <TabsContent value="key-findings" className="space-y-6">
        <KeyFindings report={report} />
      </TabsContent>

      <TabsContent value="diagnosis" className="space-y-6">
        {clinicalNotesComponent || <ClinicalNotesStructured report={report} />}
      </TabsContent>

      <TabsContent value="action-plan" className="space-y-6">
        <ActionPlan report={report} />
      </TabsContent>
    </Tabs>
  );
};
