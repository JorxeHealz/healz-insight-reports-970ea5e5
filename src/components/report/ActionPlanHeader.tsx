
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const ActionPlanHeader: React.FC = () => {
  return (
    <CardHeader className="pb-6">
      <CardTitle className="text-2xl font-semibold text-healz-brown mb-2">
        Tu Plan de Acción Personalizado
      </CardTitle>
      <p className="text-base text-healz-brown/60">
        Basado en tus biomarcadores y perfil de salud actual
      </p>
    </CardHeader>
  );
};
