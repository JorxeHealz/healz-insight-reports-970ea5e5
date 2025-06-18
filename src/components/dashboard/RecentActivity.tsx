
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileText, User, AlertTriangle, CheckCircle } from 'lucide-react';

export const RecentActivity = () => {
  // Mock data - in real implementation, this would come from a hook
  const activities = [
    {
      id: 1,
      type: 'report_generated',
      title: 'Informe generado',
      description: 'María García - Análisis de biomarcadores',
      time: '2 horas',
      icon: FileText,
      color: 'text-healz-blue'
    },
    {
      id: 2,
      type: 'form_completed',
      title: 'Formulario completado',
      description: 'Juan Pérez - Evaluación inicial',
      time: '4 horas',
      icon: CheckCircle,
      color: 'text-healz-green'
    },
    {
      id: 3,
      type: 'alert_created',
      title: 'Nueva alerta',
      description: 'Ana López - Biomarcador fuera de rango',
      time: '6 horas',
      icon: AlertTriangle,
      color: 'text-healz-red'
    },
    {
      id: 4,
      type: 'patient_assigned',
      title: 'Paciente asignado',
      description: 'Carlos Ruiz - Nuevo paciente',
      time: '1 día',
      icon: User,
      color: 'text-healz-orange'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-healz-cream/30 transition-colors">
                <div className="p-2 bg-healz-cream rounded-full">
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-healz-brown">
                    {activity.title}
                  </p>
                  <p className="text-sm text-healz-brown/70 truncate">
                    {activity.description}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    hace {activity.time}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
