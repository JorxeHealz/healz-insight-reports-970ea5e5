
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { ReportSummary } from './ReportSummary';
import { ReportPanels } from './ReportPanels';
import { ReportCategories } from './ReportCategories';
import { ClinicalNotes } from './ClinicalNotes';
import { ActionPlan } from './ActionPlan';

type ReportTabsProps = {
  report: any; // Idealmente crear un tipo adecuado
};

export const ReportTabs: React.FC<ReportTabsProps> = ({ report }) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="panels">Paneles</TabsTrigger>
        <TabsTrigger value="categories">Categorías</TabsTrigger>
        <TabsTrigger value="notes">Comentarios</TabsTrigger>
        <TabsTrigger value="action">Plan de Acción</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <ReportSummary report={report} />
      </TabsContent>

      <TabsContent value="panels">
        <ReportPanels report={report} />
      </TabsContent>

      <TabsContent value="categories">
        <ReportCategories report={report} />
      </TabsContent>

      <TabsContent value="notes">
        <ClinicalNotes report={report} />
      </TabsContent>

      <TabsContent value="action">
        <ActionPlan report={report} />
      </TabsContent>
    </Tabs>
  );
};
