
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Upload, Play, Eye, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { PatientAnalytics } from '../../hooks/usePatientAnalytics';
import { Patient } from '../../types/supabase';

interface PatientAnalyticsTableProps {
  analytics: PatientAnalytics[];
  patients: Patient[];
  isLoading: boolean;
  onUploadClick: (patientId: string) => void;
  onProcessClick: (analyticsId: string) => void;
  processingIds: string[];
}

export const PatientAnalyticsTable = ({
  analytics,
  patients,
  isLoading,
  onUploadClick,
  onProcessClick,
  processingIds
}: PatientAnalyticsTableProps) => {
  const getStatusBadge = (status: string, analytics?: PatientAnalytics) => {
    const statusConfig = {
      uploaded: { label: 'Subida', color: 'bg-blue-100 text-blue-800', icon: null },
      processing: { label: 'Procesando', color: 'bg-yellow-100 text-yellow-800', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
      processed: { label: 'Procesada', color: 'bg-green-100 text-green-800', icon: null },
      failed: { label: 'Error', color: 'bg-red-100 text-red-800', icon: null }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.uploaded;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
        {status === 'processing' && analytics && (
          <span className="text-xs ml-1">
            ({formatDistanceToNow(new Date(analytics.updated_at), { locale: es, addSuffix: false })})
          </span>
        )}
      </Badge>
    );
  };

  const getPatientName = (patientId: string) => {
    const analytics_patient = analytics.find(a => a.patient_id === patientId)?.patient;
    if (analytics_patient) {
      return `${analytics_patient.first_name} ${analytics_patient.last_name}`;
    }

    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente desconocido';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analíticas de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
            <p className="mt-2 text-healz-brown">Cargando analíticas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group patients by those who have analytics and those who don't
  const patientsWithAnalytics = new Set(analytics.map(a => a.patient_id));
  const patientsWithoutAnalytics = patients.filter(p => !patientsWithAnalytics.has(p.id));

  return (
    <div className="space-y-6">
      {/* Patients without analytics */}
      {patientsWithoutAnalytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pacientes sin Analíticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patientsWithoutAnalytics.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onUploadClick(patient.id)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Subir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics table */}
      <Card>
        <CardHeader>
          <CardTitle>Analíticas Subidas</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Subida</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.map((analytic) => {
                    // Button is available for all statuses except 'processed'
                    const canProcess = analytic.status !== 'processed';
                    const isCurrentlyProcessing = processingIds.includes(analytic.id);
                    
                    return (
                      <TableRow key={analytic.id}>
                        <TableCell className="font-medium">
                          {getPatientName(analytic.patient_id)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="truncate max-w-xs">{analytic.file_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(analytic.status, analytic)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(analytic.upload_date), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                          {analytic.notes || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canProcess && (
                              <Button
                                size="sm"
                                onClick={() => onProcessClick(analytic.id)}
                                disabled={isCurrentlyProcessing}
                              >
                                {isCurrentlyProcessing ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Procesando...
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-1" />
                                    {analytic.status === 'failed' ? 'Reintentar' : 
                                     analytic.status === 'processing' ? 'Reprocesar' : 'Procesar'}
                                  </>
                                )}
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(analytic.file_url, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline" 
                              size="sm"
                              onClick={() => onUploadClick(analytic.patient_id)}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay analíticas subidas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
