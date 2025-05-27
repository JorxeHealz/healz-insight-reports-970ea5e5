
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Apple, Pill, Activity, Calendar, MessageSquare, Star } from 'lucide-react';

type ActionPlanProps = {
  report: any;
};

export const ActionPlan: React.FC<ActionPlanProps> = ({ report }) => {
  const actionCategories = [
    {
      id: 'foods',
      title: 'Alimentación',
      icon: Apple,
      items: report.actionPlan?.foods || [],
      color: 'bg-healz-green/20 text-healz-green'
    },
    {
      id: 'supplements',
      title: 'Suplementos',
      icon: Pill,
      items: report.actionPlan?.supplements || [],
      color: 'bg-healz-orange/20 text-healz-orange'
    },
    {
      id: 'lifestyle',
      title: 'Estilo de Vida',
      icon: Activity,
      items: report.actionPlan?.lifestyle || [],
      color: 'bg-healz-blue/20 text-healz-teal'
    },
    {
      id: 'followup',
      title: 'Seguimiento',
      icon: Calendar,
      items: report.actionPlan?.followup || [],
      color: 'bg-healz-yellow/20 text-healz-orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Plan de Acción Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tu Plan de Acción Personalizado</CardTitle>
          <p className="text-sm text-healz-brown/70">
            Basado en tus biomarcadores y perfil de salud actual
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-healz-brown">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {category.items.length > 0 ? (
                      category.items.map((item: any, index: number) => (
                        <div key={index} className="bg-healz-cream/30 p-3 rounded-lg border border-healz-brown/10">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm text-healz-brown">{item.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                item.priority === 'high' ? 'bg-healz-red/20 text-healz-red' :
                                item.priority === 'medium' ? 'bg-healz-yellow/20 text-healz-orange' :
                                'bg-healz-green/20 text-healz-green'
                              }`}
                            >
                              {item.priority === 'high' ? 'Alta' : 
                               item.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                          </div>
                          <p className="text-xs text-healz-brown/70">{item.description}</p>
                          {item.dosage && (
                            <p className="text-xs text-healz-brown/60 mt-1">
                              <strong>Dosis:</strong> {item.dosage}
                            </p>
                          )}
                          {item.duration && (
                            <p className="text-xs text-healz-brown/60">
                              <strong>Duración:</strong> {item.duration}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-healz-brown/60 italic">
                        No hay recomendaciones específicas en esta categoría
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sección de Feedback */}
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
    </div>
  );
};
