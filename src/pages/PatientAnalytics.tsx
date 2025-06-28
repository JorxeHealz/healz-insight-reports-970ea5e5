
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePatients } from '@/hooks/usePatients';
import { usePatientAnalytics } from '@/hooks/usePatientAnalytics';
import { PatientAnalyticsTable } from '@/components/analytics/PatientAnalyticsTable';
import { UploadAnalyticsDialog } from '@/components/analytics/UploadAnalyticsDialog';
import { ProcessAnalyticsDialog } from '@/components/analytics/ProcessAnalyticsDialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Plus, Upload, Users } from 'lucide-react';

export const PatientAnalytics = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedAnalyticsId, setSelectedAnalyticsId] = useState<string | null>(null);

  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: analytics, isLoading: analyticsLoading, refetch } = usePatientAnalytics();

  const handleUploadSuccess = () => {
    refetch();
    setUploadDialogOpen(false);
  };

  const handleProcessSuccess = () => {
    refetch();
    setProcessDialogOpen(false);
  };

  const handleUploadClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setUploadDialogOpen(true);
  };

  const handleProcessClick = (analyticsId: string) => {
    setSelectedAnalyticsId(analyticsId);
    setProcessDialogOpen(true);
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
      />

      <UploadAnalyticsDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        patientId={selectedPatientId}
        patients={patients || []}
        onSuccess={handleUploadSuccess}
      />

      <ProcessAnalyticsDialog
        open={processDialogOpen}
        onOpenChange={setProcessDialogOpen}
        analyticsId={selectedAnalyticsId}
        analytics={analytics || []}
        onSuccess={handleProcessSuccess}
      />
    </div>
  );
};
