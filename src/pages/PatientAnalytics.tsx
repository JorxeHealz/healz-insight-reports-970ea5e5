
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { usePatientAnalytics, useProcessAnalytics } from '@/hooks/usePatientAnalytics';
import { PatientAnalyticsTable } from '@/components/analytics/PatientAnalyticsTable';
import { UploadAnalyticsDialog } from '@/components/analytics/UploadAnalyticsDialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Plus, Upload, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const PatientAnalytics = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: analytics, isLoading: analyticsLoading, refetch } = usePatientAnalytics();
  const processMutation = useProcessAnalytics();

  const handleUploadSuccess = () => {
    refetch();
    setUploadDialogOpen(false);
  };

  const handleUploadClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setUploadDialogOpen(true);
  };

  const handleProcessClick = async (analyticsId: string) => {
    // Add to processing list
    setProcessingIds(prev => [...prev, analyticsId]);
    
    try {
      await processMutation.mutateAsync({
        analyticsId,
        webhookUrl: 'https://joinhealz.app.n8n.cloud/webhook/analitica'
      });

      toast({
        title: "Éxito",
        description: "Procesamiento iniciado correctamente",
      });

      refetch();
    } catch (error: any) {
      console.error('Process error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al iniciar el procesamiento",
        variant: "destructive",
      });
    } finally {
      // Remove from processing list
      setProcessingIds(prev => prev.filter(id => id !== analyticsId));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Analíticas de Pacientes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-healz-brown mt-2">Analíticas de Pacientes</h1>
          <p className="text-healz-brown/70 mt-1">
            Gestiona las analíticas subidas y procesa los biomarcadores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analíticas</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.filter(a => a.status === 'uploaded').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesadas</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.filter(a => a.status === 'processed').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <PatientAnalyticsTable 
        analytics={analytics || []}
        patients={patients || []}
        isLoading={analyticsLoading || patientsLoading}
        onUploadClick={handleUploadClick}
        onProcessClick={handleProcessClick}
        processingIds={processingIds}
      />

      <UploadAnalyticsDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        patientId={selectedPatientId}
        patients={patients || []}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};
