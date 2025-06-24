
import React from 'react';
import { Copy, Clock, AlertTriangle, Eye } from 'lucide-react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { PatientForm } from '../../types/forms';

interface PatientFormsTableRowProps {
  form: PatientForm;
  onCopyLink: (token: string, patientName: string) => void;
  onProcessForm: (formId: string) => void;
  onViewResults: (form: PatientForm) => void;
  isProcessing: boolean;
}

export const PatientFormsTableRow = ({ 
  form, 
  onCopyLink, 
  onProcessForm, 
  onViewResults, 
  isProcessing 
}: PatientFormsTableRowProps) => {
  const formatPatientName = (patient: any) => {
    if (!patient) return 'Paciente sin datos';
    
    const firstName = patient.first_name || '';
    const lastName = patient.last_name || '';
    
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    return fullName || 'Sin nombre';
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

  const timeToExpiry = getTimeUntilExpiry(form.expires_at);
  const patientName = formatPatientName(form.patient);

  return (
    <TableRow 
      className="cursor-pointer hover:bg-healz-cream/20"
      onClick={() => form.status === 'completed' && onViewResults(form)}
    >
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
};
