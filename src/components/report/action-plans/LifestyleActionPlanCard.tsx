import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Heart, Moon, Brain, Clock, Home } from 'lucide-react';

type LifestyleActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const LifestyleActionPlanCard: React.FC<LifestyleActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-healz-red/20 text-healz-red border-healz-red/30';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange border-healz-orange/30';
      default: return 'bg-healz-green/20 text-healz-green border-healz-green/30';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      default: return 'Baja';
    }
  };

  return (
    <Card className="bg-healz-cream/30 border-healz-brown/10">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-healz-blue" />
            <h4 className="font-semibold text-sm text-healz-brown">
              {item.habit_type || 'Cambio de Estilo de Vida'}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`text-xs ${getPriorityStyle(item.priority)}`}>
              {getPriorityText(item.priority)}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-6 w-6 p-0 text-healz-red hover:text-healz-red"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Información básica siempre visible */}
        <div className="space-y-2 mb-3">
          {item.frequency && (
            <p className="text-xs text-healz-brown/80">
              <strong>Frecuencia:</strong> {item.frequency}
            </p>
          )}
          
          {item.timing && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-healz-brown/60" />
              <p className="text-xs text-healz-brown/80">{item.timing}</p>
            </div>
          )}

          {item.sleep_target_hours && (
            <div className="flex items-center gap-1">
              <Moon className="h-3 w-3 text-healz-blue" />
              <p className="text-xs text-healz-brown/80">
                <strong>Meta de sueño:</strong> {item.sleep_target_hours}
              </p>
            </div>
          )}

          {item.duration && (
            <p className="text-xs text-healz-brown/70">
              <strong>Duración:</strong> {item.duration}
            </p>
          )}
        </div>

        {/* Contenido expandible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-8">
              <span className="text-xs">Ver detalles completos</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-3">
            {/* Acciones específicas */}
            {item.specific_actions && Array.isArray(item.specific_actions) && item.specific_actions.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-green mb-1">Acciones específicas:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.specific_actions.map((action: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-green/10 text-healz-green">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Intervenciones de sueño */}
            {item.sleep_interventions && Array.isArray(item.sleep_interventions) && item.sleep_interventions.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1 flex items-center gap-1">
                  <Moon className="h-3 w-3" />
                  Intervenciones de sueño:
                </h5>
                <ul className="space-y-1">
                  {item.sleep_interventions.map((intervention: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {intervention}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Técnicas de manejo del estrés */}
            {item.stress_management_techniques && Array.isArray(item.stress_management_techniques) && item.stress_management_techniques.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-orange mb-1 flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  Manejo del estrés:
                </h5>
                <ul className="space-y-1">
                  {item.stress_management_techniques.map((technique: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {technique}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendaciones de rutina diaria */}
            {item.daily_routine_recommendations && Array.isArray(item.daily_routine_recommendations) && item.daily_routine_recommendations.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1 flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Rutina diaria:
                </h5>
                <ul className="space-y-1">
                  {item.daily_routine_recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {recommendation}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Factores ambientales */}
            {item.environmental_factors && Array.isArray(item.environmental_factors) && item.environmental_factors.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-teal mb-1">Factores ambientales:</h5>
                <ul className="space-y-1">
                  {item.environmental_factors.map((factor: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disparadores */}
            {item.triggers && Array.isArray(item.triggers) && item.triggers.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-red mb-1">Disparadores a evitar:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.triggers.map((trigger: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-red/10 text-healz-red">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Método de seguimiento */}
            {item.tracking_method && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1">Método de seguimiento:</h5>
                <p className="text-xs text-healz-brown/70">{item.tracking_method}</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};