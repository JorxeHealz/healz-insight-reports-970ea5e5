
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PatientStatsProps {
  stats: {
    pendingForms: number;
    weeklyActivity: Array<{ week: string; count: number }>;
  };
}

export const PatientStats = ({ stats }: PatientStatsProps) => {
  return (
    <div className="space-y-4">
      {/* Formularios pendientes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-healz-brown text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Formularios Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-healz-brown">
              {stats.pendingForms}
            </span>
            <Badge variant="outline" className="text-healz-orange border-healz-orange">
              Requieren atención
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actividad semanal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-healz-brown text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Nuevos Pacientes (4 semanas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyActivity}>
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 11, fill: '#3A2E1C' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Bar 
                  dataKey="count" 
                  fill="#5E8F8F" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
