
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface VitalityScoreCardProps {
  score: number;
}

export const VitalityScoreCard: React.FC<VitalityScoreCardProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remainder', value: 100 - score }
  ];
  
  const COLORS = ['#86A676', '#F8F6F1'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-healz-brown">Vitality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-healz-green">{score}</span>
              <span className="text-xs text-healz-brown/70">de 100</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-center text-healz-brown/80 max-w-xs">
            Tu vitalidad está en un nivel {score >= 80 ? 'excelente' : score >= 60 ? 'bueno' : score >= 40 ? 'moderado' : 'bajo'}. 
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
