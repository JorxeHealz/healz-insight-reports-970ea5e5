import React from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';
import { Heart, Moon, Brain, Clock, Home, Edit2, Trash2 } from 'lucide-react';

type LifestyleActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const LifestyleActionPlanCard: React.FC<LifestyleActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Prioridad Media';
      default: return 'Prioridad Baja';
    }
  };

  return (
    <Card className="border-healz-brown/10 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-healz-blue/10">
              <Heart className="h-4 w-4 text-healz-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-healz-brown text-lg">
                {item.habit_type || 'Plan de Estilo de Vida'}
              </h3>
              {(item.frequency || item.duration) && (
                <div className="flex items-center gap-2 mt-1">
                  {item.frequency && (
                    <span className="text-sm text-healz-brown/70 font-medium">{item.frequency}</span>
                  )}
                  {item.frequency && item.duration && (
                    <span className="text-healz-brown/40">•</span>
                  )}
                  {item.duration && (
                    <span className="text-sm text-healz-brown/70">{item.duration}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs border ${getPriorityStyle(item.priority)}`}>
              {getPriorityText(item.priority)}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8 p-0 hover:bg-healz-brown/5"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 text-healz-red hover:text-healz-red hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Meta de Sueño - Fija al inicio (solo si existe) */}
        {item.sleep_target_hours && (
          <div className="mt-4 p-4 rounded-lg bg-healz-blue/10 border border-healz-blue/20">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-5 w-5 text-healz-blue" />
              <h4 className="font-semibold text-healz-blue">Meta de Sueño</h4>
            </div>
            <p className="text-sm text-healz-brown leading-relaxed">{item.sleep_target_hours}</p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Accordion type="single" className="w-full" collapsible>
          
          {/* Manejo de Estrés */}
          <AccordionItem value="stress" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-orange text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-healz-orange" />
                Manejo de Estrés
                {item.stress_management_techniques?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-orange/10 text-healz-orange border-0">
                    {item.stress_management_techniques.length} técnicas
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.stress_management_techniques && Array.isArray(item.stress_management_techniques) && item.stress_management_techniques.length > 0 ? (
                  <div className="space-y-3">
                    {item.stress_management_techniques.map((technique: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-healz-orange/5 border border-healz-orange/10">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-healz-orange text-white text-xs font-semibold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-healz-brown leading-relaxed">{technique}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-healz-brown/60 italic mb-3">Técnicas recomendadas para el manejo del estrés:</p>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-healz-orange/5 border border-healz-orange/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Respiración profunda:</span> Técnica de respiración diafragmática 5-10 minutos diarios
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-orange/5 border border-healz-orange/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Mindfulness:</span> Práctica de atención plena durante actividades cotidianas
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-orange/5 border border-healz-orange/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Gestión del tiempo:</span> Planificación y priorización de tareas diarias
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Intervenciones de Sueño */}
          <AccordionItem value="sleep" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-blue text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-healz-blue" />
                Intervenciones de Sueño
                {item.sleep_interventions?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-blue/10 text-healz-blue border-0">
                    {item.sleep_interventions.length} intervenciones
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.sleep_interventions && Array.isArray(item.sleep_interventions) && item.sleep_interventions.length > 0 ? (
                  <div className="space-y-3">
                    {item.sleep_interventions.map((intervention: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                        <Moon className="h-4 w-4 text-healz-blue mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-healz-brown leading-relaxed">{intervention}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-healz-brown/60 italic mb-3">Intervenciones recomendadas para mejorar el sueño:</p>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Higiene del sueño:</span> Mantener horarios regulares de sueño y vigilia
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Ambiente óptimo:</span> Habitación oscura, silenciosa y temperatura fresca
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Rutina relajante:</span> Actividades calmantes 30-60 minutos antes de dormir
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rutina Diaria */}
          <AccordionItem value="routine" className="border-b-0">
            <AccordionTrigger className="hover:text-healz-green text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-healz-green" />
                Rutina Diaria
                {item.daily_routine_recommendations?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-green/10 text-healz-green border-0">
                    {item.daily_routine_recommendations.length} recomendaciones
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.daily_routine_recommendations && Array.isArray(item.daily_routine_recommendations) && item.daily_routine_recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {item.daily_routine_recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-healz-green/5 border border-healz-green/10">
                        <Clock className="h-4 w-4 text-healz-green mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-healz-brown leading-relaxed">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-healz-brown/60 italic mb-3">Recomendaciones para establecer una rutina diaria saludable:</p>
                    <div className="grid gap-3">
                      <div className="p-3 rounded-lg bg-healz-green/5 border border-healz-green/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Mañana:</span> Despertar a la misma hora, hidratación y actividad física ligera
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-green/5 border border-healz-green/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Mediodía:</span> Comida equilibrada y pausa activa de 10-15 minutos
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-green/5 border border-healz-green/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Tarde:</span> Evitar cafeína después de las 16h, ejercicio moderado
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-green/5 border border-healz-green/10">
                        <p className="text-sm text-healz-brown leading-relaxed">
                          <span className="font-medium">Noche:</span> Rutina relajante, desconexión digital 1h antes de dormir
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Información adicional de timing y seguimiento */}
                {(item.timing || item.tracking_method || item.specific_actions?.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-healz-brown/10 space-y-3">
                    {item.timing && (
                      <div className="p-3 rounded-lg bg-healz-purple/5 border border-healz-purple/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-healz-purple" />
                          <span className="font-medium text-healz-brown text-sm">Timing recomendado:</span>
                        </div>
                        <p className="text-sm text-healz-brown/80">{item.timing}</p>
                      </div>
                    )}
                    
                    {item.tracking_method && (
                      <div className="p-3 rounded-lg bg-healz-teal/5 border border-healz-teal/10">
                        <span className="font-medium text-healz-brown text-sm block mb-1">Método de seguimiento:</span>
                        <p className="text-sm text-healz-brown/80">{item.tracking_method}</p>
                      </div>
                    )}
                    
                    {item.specific_actions && Array.isArray(item.specific_actions) && item.specific_actions.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-healz-brown mb-2">Acciones específicas:</h5>
                        <div className="flex flex-wrap gap-2">
                          {item.specific_actions.map((action: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs bg-healz-teal/10 text-healz-teal border-healz-teal/20">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
};