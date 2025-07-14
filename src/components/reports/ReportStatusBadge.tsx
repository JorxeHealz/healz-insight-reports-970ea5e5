import { Badge } from '@/components/ui/badge';

interface ReportStatusBadgeProps {
  status: 'processing' | 'completed' | 'failed';
}

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          label: 'Procesando',
          className: 'bg-healz-orange/20 text-healz-orange',
          icon: '⏳'
        };
      case 'completed':
        return {
          label: 'Completado',
          className: 'bg-healz-green/20 text-healz-green',
          icon: '✓'
        };
      case 'failed':
        return {
          label: 'Fallido',
          className: 'bg-healz-red/20 text-healz-red',
          icon: '✗'
        };
      default:
        return {
          label: 'Desconocido',
          className: 'bg-healz-brown/20 text-healz-brown',
          icon: '?'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </div>
  );
};