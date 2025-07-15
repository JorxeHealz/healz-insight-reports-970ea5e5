import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Apple, Target, Plus, Minus, Clock, Utensils, AlertCircle } from 'lucide-react';

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

        {/* Objetivos principales - siempre visibles */}
        {item.main_goals && Array.isArray(item.main_goals) && item.main_goals.length > 0 && (
          <div className="bg-healz-green/10 p-3 rounded-lg mb-3">
            <h5 className="text-xs font-semibold text-healz-green mb-2 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Objetivos Principales
            </h5>
            <div className="space-y-1">
              {item.main_goals.slice(0, 2).map((goal: string, index: number) => (
                <p key={index} className="text-xs text-healz-brown/80 flex items-start gap-1">
                  <span className="text-healz-green">•</span> {goal}
                </p>
              ))}
              {item.main_goals.length > 2 && (
                <p className="text-xs text-healz-green/70 italic">
                  +{item.main_goals.length - 2} objetivos más
                </p>
              )}
            </div>
          </div>
        )}

        {/* Resumen rápido */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {item.foods_to_include?.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Plus className="h-3 w-3 text-healz-green" />
              <span className="text-healz-brown/70">{item.foods_to_include.length} alimentos recomendados</span>
            </div>
          )}
          {item.foods_to_avoid?.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Minus className="h-3 w-3 text-healz-red" />
              <span className="text-healz-brown/70">{item.foods_to_avoid.length} a evitar</span>
            </div>
          )}
        </div>

        {/* Botón para expandir detalles */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs font-medium hover:bg-healz-brown/5"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Ocultar detalles
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Ver plan completo
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 space-y-3">
            {/* Alimentos recomendados */}
            {item.foods_to_include && Array.isArray(item.foods_to_include) && item.foods_to_include.length > 0 && (
              <div className="bg-healz-green/5 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-green mb-2 flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Alimentos a Incluir
                </h5>
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
              <div className="bg-healz-red/5 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-red mb-2 flex items-center gap-1">
                  <Minus className="h-3 w-3" />
                  Alimentos a Evitar
                </h5>
                <div className="flex flex-wrap gap-1">
                  {item.foods_to_avoid.map((food: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-red/10 text-healz-red">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Ejemplos de comidas españolas */}
            {item.meal_examples && Array.isArray(item.meal_examples) && item.meal_examples.length > 0 && (
              <div className="bg-healz-cream/50 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-brown mb-2 flex items-center gap-1">
                  <Utensils className="h-3 w-3" />
                  Ejemplos de Comidas (España)
                </h5>
                <div className="space-y-2">
                  {item.meal_examples.map((meal: any, index: number) => (
                    <div key={index} className="text-xs text-healz-brown/80">
                      {typeof meal === 'string' ? (
                        <p>• {meal}</p>
                      ) : (
                        <div>
                          <p className="font-medium text-healz-brown">{meal.type || `Comida ${index + 1}`}:</p>
                          <p className="ml-2">{meal.description || meal}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horarios y pautas */}
            {item.meal_timing && (
              <div className="bg-healz-orange/5 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-orange mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Horarios Recomendados
                </h5>
                <p className="text-xs text-healz-brown/80">{item.meal_timing}</p>
              </div>
            )}

            {/* Porciones */}
            {item.portion_guidelines && (
              <div>
                <h5 className="text-xs font-semibold text-healz-brown mb-1">Guía de Porciones:</h5>
                <p className="text-xs text-healz-brown/70">{item.portion_guidelines}</p>
              </div>
            )}

            {/* Consideraciones especiales */}
            {(item.special_considerations || item.additional_notes) && (
              <div className="bg-healz-blue/5 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-blue mb-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Consideraciones Especiales
                </h5>
                <p className="text-xs text-healz-brown/80">
                  {item.special_considerations || item.additional_notes}
                </p>
              </div>
            )}

            {/* Suplementación */}
            {item.supplementation_notes && (
              <div>
                <h5 className="text-xs font-semibold text-healz-purple mb-1">Suplementación:</h5>
                <p className="text-xs text-healz-brown/70">{item.supplementation_notes}</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};