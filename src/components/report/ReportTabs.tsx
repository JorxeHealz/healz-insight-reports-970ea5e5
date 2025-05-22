
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export const ReportTabs: React.FC = () => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="trends" disabled>Tendencias</TabsTrigger>
        <TabsTrigger value="comments" disabled>Comentarios</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
