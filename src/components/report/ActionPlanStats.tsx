
import React from 'react';

export const ActionPlanStats: React.FC = () => {
  return (
    <div className="bg-healz-cream/30 p-4 rounded-lg border border-healz-brown/10">
      <h4 className="font-medium text-healz-brown mb-2">Estado de tu plan:</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="text-center">
          <p className="font-medium text-healz-green">85%</p>
          <p className="text-healz-brown/70">Adherencia</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-healz-orange">3</p>
          <p className="text-healz-brown/70">Semanas activo</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-healz-teal">12</p>
          <p className="text-healz-brown/70">Mejoras detectadas</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-healz-brown">2</p>
          <p className="text-healz-brown/70">Próximos análisis</p>
        </div>
      </div>
    </div>
  );
};
