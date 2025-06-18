
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Users, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export const DashboardHeader = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    {
      title: 'Pacientes Asignados',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'text-healz-blue',
      bgColor: 'bg-healz-blue/10'
    },
    {
      title: 'Informes Generados',
      value: stats?.totalReports || 0,
      icon: FileText,
      color: 'text-healz-green',
      bgColor: 'bg-healz-green/10'
    },
    {
      title: 'Formularios Pendientes',
      value: stats?.pendingForms || 0,
      icon: Clock,
      color: 'text-healz-orange',
      bgColor: 'bg-healz-orange/10'
    },
    {
      title: 'Alertas Activas',
      value: stats?.unreadAlerts || 0,
      icon: AlertTriangle,
      color: 'text-healz-red',
      bgColor: 'bg-healz-red/10'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-healz-cream/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-healz-brown/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healz-brown/70">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-healz-brown">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
