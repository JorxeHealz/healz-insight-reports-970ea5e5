
import React, { useState, useMemo } from 'react';
import { usePatientForms, useCreatePatientForm, useProcessFormWithN8N } from '../hooks/usePatientForms';
import { Plus, Copy, Search, Filter, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { toast } from '../hooks/use-toast';
import { CreatePatientFormDialog } from '../components/forms/CreatePatientFormDialog';
import { ProcessingStatus } from '../components/forms/ProcessingStatus';
import { QuestionsSeed } from '../components/forms/QuestionsSeed';
import { PatientForm } from '../types/forms';

const PatientForms = () => {
  const { data: forms, isLoading, error } = usePatientForms();
  const createPatientForm = useCreatePatientForm();
  const processForm = useProcessFormWithN8N();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatPatientName = (patient: any) => {
    if (!patient) return 'Paciente sin datos';
    
    const firstName = patient.first_name || '';
    const lastName = patient.last_name || '';
    
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    return fullName || 'Sin nombre';
  };

  const handleProcessForm = async (formId: string) => {
    try {
      await processForm.mutateAsync({ form_id: formId });
      toast({
        title: "Formulario enviado a n8n",
        description: "El formulario ha sido enviado para su procesamiento."
      });
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario para su procesamiento.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = (token: string, patientName: string) => {
    const url = `${window.location.origin}/form/${token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: `La URL del formulario para ${patientName} se ha copiado al portapapeles`
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completado', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      processed: { label: 'Procesado', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      expired: { label: 'Expirado', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: 'Expirado', urgent: true };
    if (days === 0) return { text: 'Expira hoy', urgent: true };
    if (days === 1) return { text: 'Expira mañana', urgent: true };
    if (days <= 3) return { text: `${days} días`, urgent: true };
    
    return { text: `${days} días`, urgent: false };
  };

  const filteredForms = useMemo(() => {
    if (!forms) return [];
    
    return forms.filter(form => {
      const patientName = formatPatientName(form.patient);
      const matchesSearch = searchTerm === '' || 
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.patient?.email && form.patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [forms, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-healz-brown">Gestión de Formularios</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-healz-green hover:bg-healz-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Formulario
        </Button>
      </div>

      <QuestionsSeed />
      <ProcessingStatus />

      <Card>
        <CardHeader>
          <CardTitle>Formularios Activos</CardTitle>
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="processed">Procesado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-healz-brown border-r-transparent"></div>
              <p className="mt-2 text-healz-brown">Cargando formularios...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error al cargar formularios: {error.message}
            </div>
          ) : filteredForms && filteredForms.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => {
                    const timeToExpiry = getTimeUntilExpiry(form.expires_at);
                    const patientName = formatPatientName(form.patient);
                    
                    return (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">
                          {patientName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {form.patient?.email || 'Sin email'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(form.status)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(form.created_at).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  {timeToExpiry.urgent && (
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  )}
                                  <span className={`text-sm ${timeToExpiry.urgent ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                                    {timeToExpiry.text}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Expira: {new Date(form.expires_at).toLocaleDateString('es-ES')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {form.status === 'pending' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCopyLink(form.form_token, patientName)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copiar enlace del formulario</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {form.status === 'completed' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleProcessForm(form.id)}
                                      disabled={processForm.isPending}
                                    >
                                      {processForm.isPending ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                                      ) : (
                                        <Clock className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Procesar con n8n</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
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
              {forms && forms.length > 0 ? 
                'No se encontraron formularios que coincidan con los filtros aplicados' :
                'No hay formularios creados'
              }
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePatientFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSuccess={() => {
          setIsCreateDialogOpen(false);
          toast({
            title: "Formulario creado",
            description: "El formulario ha sido creado correctamente."
          });
        }}
        onCreateError={(error: Error) => {
          toast({
            title: "Error",
            description: `No se pudo crear el formulario: ${error.message}`,
            variant: "destructive"
          });
        }}
      />
    </div>
  );
};

export default PatientForms;
