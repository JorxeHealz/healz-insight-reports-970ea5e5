import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Dumbbell, Clock, Zap, Target, AlertTriangle } from 'lucide-react';

type ActivityActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const ActivityActionPlanCard: React.FC<ActivityActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
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
            <Dumbbell className="h-4 w-4 text-healz-teal" />
            <h4 className="font-semibold text-sm text-healz-brown">
              {item.activity_type || 'Plan de Actividad'}
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

        {/* Current Capacity Assessment */}
        {item.current_capacity && (
          <div className="bg-healz-blue/10 p-3 rounded-lg mb-3 border border-healz-teal/20">
            <h5 className="text-xs font-semibold text-healz-teal mb-1 flex items-center gap-1">
              📊 Evaluación Actual
            </h5>
            <p className="text-xs text-healz-brown/80">{item.current_capacity}</p>
          </div>
        )}

        {/* Phase 1 Program */}
        {item.phase1_focus && (
          <div className="bg-healz-green/10 p-3 rounded-lg mb-3 border-l-4 border-healz-green">
            <h5 className="text-xs font-semibold text-healz-green mb-1 flex items-center gap-1">
              🎯 Fase 1 - {item.phase1_duration || 'Inicial'}
            </h5>
            <p className="text-xs text-healz-brown/80">{item.phase1_focus}</p>
          </div>
        )}

        {/* Essential Program Info */}
        <div className="bg-healz-cream/50 p-3 rounded-lg mb-3">
          <h5 className="text-xs font-semibold text-healz-brown mb-2">Programa Base</h5>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="font-medium text-healz-brown/70 text-xs">Frecuencia:</span>
              <span className="text-healz-brown font-semibold text-sm">{item.frequency_per_week}/semana</span>
            </div>
            {item.session_duration && (
              <div className="flex flex-col">
                <span className="font-medium text-healz-brown/70 text-xs">Duración:</span>
                <span className="text-healz-brown text-sm">{item.session_duration}</span>
              </div>
            )}
          </div>
          
          {item.intensity_level && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-healz-cream">
              <Zap className="h-3 w-3 text-healz-orange" />
              <span className="text-xs text-healz-brown/80"><strong>Intensidad:</strong> {item.intensity_level}</span>
            </div>
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
            {/* Ejercicios específicos */}
            {item.specific_exercises && Array.isArray(item.specific_exercises) && item.specific_exercises.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-teal mb-1 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Ejercicios específicos:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {item.specific_exercises.map((exercise: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-teal/10 text-healz-teal">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Equipamiento necesario */}
            {item.equipment_needed && Array.isArray(item.equipment_needed) && item.equipment_needed.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Equipamiento necesario:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.equipment_needed.map((equipment: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-brown/10 text-healz-brown">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Fase 1 */}
            {(item.phase1_duration || item.phase1_focus) && (
              <div>
                <h5 className="text-xs font-medium text-healz-green mb-1">Fase inicial:</h5>
                {item.phase1_duration && (
                  <p className="text-xs text-healz-brown/70">
                    <strong>Duración:</strong> {item.phase1_duration}
                  </p>
                )}
                {item.phase1_focus && (
                  <p className="text-xs text-healz-brown/70">
                    <strong>Enfoque:</strong> {item.phase1_focus}
                  </p>
                )}
              </div>
            )}

            {/* Plan de progresión */}
            {item.progression_plan && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1">Plan de progresión:</h5>
                <p className="text-xs text-healz-brown/70">{item.progression_plan}</p>
              </div>
            )}

            {/* Períodos de descanso */}
            {item.rest_periods && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Períodos de descanso:</h5>
                <p className="text-xs text-healz-brown/70">{item.rest_periods}</p>
              </div>
            )}

            {/* Señales de monitoreo */}
            {item.monitoring_signals && Array.isArray(item.monitoring_signals) && item.monitoring_signals.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1">Señales de monitoreo:</h5>
                <ul className="space-y-1">
                  {item.monitoring_signals.map((signal: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {signal}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Restricciones */}
            {item.restrictions && Array.isArray(item.restrictions) && item.restrictions.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-red mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Restricciones:
                </h5>
                <ul className="space-y-1">
                  {item.restrictions.map((restriction: string, index: number) => (
                    <li key={index} className="text-xs text-healz-red/80">• {restriction}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};