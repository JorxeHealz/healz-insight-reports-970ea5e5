
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { ReportSummary } from './ReportSummary';
import { ReportPanels } from './ReportPanels';
import { ActionPlan } from './ActionPlan';
import { FileText, Activity, Target, Brain } from 'lucide-react';

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
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Resumen
        </TabsTrigger>
        <TabsTrigger value="panels" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Paneles
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

      <TabsContent value="diagnosis" className="space-y-6">
        {clinicalNotesComponent || (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-12 w-12 text-healz-brown/40 mx-auto mb-4" />
              <p className="text-healz-brown/60">No hay diagnósticos disponibles</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="action-plan" className="space-y-6">
        <ActionPlan report={report} />
      </TabsContent>
    </Tabs>
  );
};
