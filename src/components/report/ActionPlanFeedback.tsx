
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { MessageSquare, Star } from 'lucide-react';
import { ActionPlanStats } from './ActionPlanStats';

export const ActionPlanFeedback: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          ¿Cómo lo estamos haciendo?
        </CardTitle>
        <p className="text-sm text-healz-brown/70">
          Tu feedback nos ayuda a mejorar tu plan de salud
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calificación con estrellas */}
        <div>
          <label className="text-sm font-medium text-healz-brown mb-2 block">
            Califica tu experiencia general:
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="p-1 hover:scale-110 transition-transform">
                <Star className="h-6 w-6 text-healz-yellow hover:text-healz-orange transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Campo de comentarios */}
        <div>
          <label className="text-sm font-medium text-healz-brown mb-2 block">
            Comparte tu experiencia (opcional):
          </label>
          <Textarea 
            placeholder="¿Cómo te sientes con las recomendaciones? ¿Hay algo que te gustaría cambiar o mejorar?"
            className="resize-none"
            rows={4}
          />
        </div>

        {/* Estado del plan actual */}
        <ActionPlanStats />

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Programar consulta
          </Button>
          <Button className="flex-1">
            Enviar feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
