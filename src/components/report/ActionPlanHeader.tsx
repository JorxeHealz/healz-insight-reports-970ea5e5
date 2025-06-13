
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const ActionPlanHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="text-lg">Tu Plan de Acción Personalizado</CardTitle>
      <p className="text-sm text-healz-brown/70">
        Basado en tus biomarcadores y perfil de salud actual
      </p>
    </CardHeader>
  );
};
