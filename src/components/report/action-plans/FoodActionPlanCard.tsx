import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Clock, Apple, Droplets } from 'lucide-react';

type FoodActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const FoodActionPlanCard: React.FC<FoodActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
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
            <Apple className="h-4 w-4 text-healz-green" />
            <h4 className="font-semibold text-sm text-healz-brown">
              {item.diet_type || 'Plan Alimentario'}
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
          {item.dietary_pattern && (
            <p className="text-xs text-healz-brown/80">
              <strong>Patrón:</strong> {item.dietary_pattern}
            </p>
          )}
          {item.meal_timing && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-healz-brown/60" />
              <p className="text-xs text-healz-brown/80">{item.meal_timing}</p>
            </div>
          )}
          {item.hydration_recommendation && (
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-healz-blue" />
              <p className="text-xs text-healz-brown/80">{item.hydration_recommendation}</p>
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
            {/* Alimentos a incluir */}
            {item.foods_to_include && Array.isArray(item.foods_to_include) && item.foods_to_include.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-green mb-1">Incluir:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.foods_to_include.map((food: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-green/10 text-healz-green">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Alimentos a evitar */}
            {item.foods_to_avoid && Array.isArray(item.foods_to_avoid) && item.foods_to_avoid.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-red mb-1">Evitar:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.foods_to_avoid.map((food: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-red/10 text-healz-red">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Porciones */}
            {item.portion_guidelines && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Porciones:</h5>
                <p className="text-xs text-healz-brown/70">{item.portion_guidelines}</p>
              </div>
            )}

            {/* Ejemplos de comidas */}
            {item.meal_examples && typeof item.meal_examples === 'object' && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Ejemplos de comidas:</h5>
                <div className="space-y-1">
                  {Object.entries(item.meal_examples).map(([meal, example]) => (
                    <p key={meal} className="text-xs text-healz-brown/70">
                      <strong>{meal}:</strong> {example as string}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Consideraciones especiales */}
            {item.special_considerations && Array.isArray(item.special_considerations) && item.special_considerations.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-orange mb-1">Consideraciones especiales:</h5>
                <ul className="space-y-1">
                  {item.special_considerations.map((consideration: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {consideration}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notas de preparación */}
            {item.preparation_notes && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Notas de preparación:</h5>
                <p className="text-xs text-healz-brown/70">{item.preparation_notes}</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};