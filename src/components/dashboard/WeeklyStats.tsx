
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const WeeklyStats = () => {
  // Mock data - in real implementation, this would come from a hook
  const weeklyStats = [
    {
      metric: 'Consultas Realizadas',
      current: 24,
      previous: 18,
      trend: 'up' as const
    },
    {
      metric: 'Formularios Completados',
      current: 16,
      previous: 20,
      trend: 'down' as const
    },
    {
      metric: 'Informes Generados',
      current: 12,
      previous: 12,
      trend: 'stable' as const
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-healz-green" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-healz-red" />;
      default:
        return <Minus className="h-4 w-4 text-healz-brown/50" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-healz-green';
      case 'down':
        return 'text-healz-red';
      default:
        return 'text-healz-brown/50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estadísticas Semanales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyStats.map((stat) => (
            <div key={stat.metric} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-healz-brown">
                  {stat.metric}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-healz-brown">
                    {stat.current}
                  </span>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(stat.trend)}`}>
                    {getTrendIcon(stat.trend)}
                    <span>
                      {stat.trend === 'stable' ? '0%' : 
                       stat.trend === 'up' ? `+${Math.round(((stat.current - stat.previous) / stat.previous) * 100)}%` :
                       `${Math.round(((stat.current - stat.previous) / stat.previous) * 100)}%`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
