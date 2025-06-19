
import React from 'react';
import { Copy, Eye, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { PatientForm } from '../../types/forms';

interface PatientFormsTableProps {
  forms: PatientForm[];
  patientName: string;
  onCopyLink: (token: string, patientName: string) => void;
  onViewResults: (form: PatientForm) => void;
  onProcessForm: (formId: string) => void;
  isProcessing: boolean;
}

export const PatientFormsTable = ({ 
  forms, 
  patientName, 
  onCopyLink, 
  onViewResults, 
  onProcessForm, 
  isProcessing 
}: PatientFormsTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
      processed: { label: 'Procesado', color: 'bg-blue-100 text-blue-800' },
      expired: { label: 'Expirado', color: 'bg-red-100 text-red-800' }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formularios Activos</CardTitle>
      </CardHeader>
      <CardContent>
        {forms && forms.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => {
                  const timeToExpiry = getTimeUntilExpiry(form.expires_at);
                  
                  return (
                    <TableRow 
                      key={form.id}
                      className="cursor-pointer hover:bg-healz-cream/20"
                      onClick={() => form.status === 'completed' && onViewResults(form)}
                    >
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
                          {form.status === 'completed' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewResults(form);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ver resultados del formulario</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          {form.status === 'pending' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCopyLink(form.form_token, patientName);
                                    }}
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onProcessForm(form.id);
                                    }}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
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
            No hay formularios creados para este paciente
          </div>
        )}
      </CardContent>
    </Card>
  );
};
