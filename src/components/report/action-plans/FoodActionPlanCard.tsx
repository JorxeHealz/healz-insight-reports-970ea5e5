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
import { Apple, Target, Plus, Minus, Utensils, AlertCircle, Edit2, Trash2, Clock } from 'lucide-react';

type FoodActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const FoodActionPlanCard: React.FC<FoodActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  
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
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-healz-green/10">
              <Apple className="h-4 w-4 text-healz-green" />
            </div>
            <div>
              <h3 className="font-semibold text-healz-brown text-lg">
                {item.diet_type || 'Plan Alimentario'}
              </h3>
              {item.dietary_pattern && (
                <p className="text-sm text-healz-brown/60 mt-1">{item.dietary_pattern}</p>
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
      </CardHeader>

      <CardContent>
        <Accordion type="single" className="w-full" collapsible>
          
          {/* Objetivos Principales - Siempre destacado */}
          <AccordionItem value="objectives" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-green text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-healz-green" />
                Objetivos Principales
                {item.main_goals?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-green/10 text-healz-green border-0">
                    {item.main_goals.length} objetivos
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.main_goals && Array.isArray(item.main_goals) && item.main_goals.length > 0 ? (
                  <ol className="flex flex-col gap-3">
                    {item.main_goals.map((goal: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-healz-green text-white text-xs font-semibold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm text-healz-brown leading-relaxed">{goal}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-healz-brown/60 italic">No se han definido objetivos específicos</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Alimentos Recomendados */}
          <AccordionItem value="recommended" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-green text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-healz-green" />
                Alimentos a Incluir
                {item.foods_to_include?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-green/10 text-healz-green border-0">
                    {item.foods_to_include.length} alimentos
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.foods_to_include && Array.isArray(item.foods_to_include) && item.foods_to_include.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {item.foods_to_include.map((food: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-healz-green/5 border border-healz-green/10">
                        <div className="w-2 h-2 rounded-full bg-healz-green flex-shrink-0"></div>
                        <span className="text-sm text-healz-brown">{food}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-healz-brown/60 italic">No se han especificado alimentos recomendados</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Alimentos a Evitar */}
          <AccordionItem value="avoid" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-red text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-healz-red" />
                Alimentos a Evitar
                {item.foods_to_avoid?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-red/10 text-healz-red border-0">
                    {item.foods_to_avoid.length} alimentos
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.foods_to_avoid && Array.isArray(item.foods_to_avoid) && item.foods_to_avoid.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {item.foods_to_avoid.map((food: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-healz-red/5 border border-healz-red/10">
                        <div className="w-2 h-2 rounded-full bg-healz-red flex-shrink-0"></div>
                        <span className="text-sm text-healz-brown">{food}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-healz-brown/60 italic">No se han especificado restricciones alimentarias</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ejemplos de Comidas Españolas */}
          <AccordionItem value="meals" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-orange text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-healz-orange" />
                Ejemplos de Comidas (España)
                {item.meal_examples?.length && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-orange/10 text-healz-orange border-0">
                    {item.meal_examples.length} ejemplos
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.meal_examples && Array.isArray(item.meal_examples) && item.meal_examples.length > 0 ? (
                  <div className="space-y-4">
                    {item.meal_examples.map((meal: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg bg-healz-cream/30 border border-healz-brown/10">
                        {typeof meal === 'string' ? (
                          <p className="text-sm text-healz-brown">{meal}</p>
                        ) : (
                          <div>
                            <p className="font-medium text-healz-brown text-sm mb-1">
                              {meal.type || `Comida ${index + 1}`}:
                            </p>
                            <p className="text-sm text-healz-brown/80 leading-relaxed">
                              {meal.description || meal}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-healz-brown/60 italic mb-3">Ejemplos adaptados al contexto español:</p>
                    <div className="grid gap-3">
                      <div className="p-3 rounded-lg bg-healz-cream/20 border border-healz-brown/5">
                        <p className="font-medium text-healz-brown text-sm">Desayuno:</p>
                        <p className="text-sm text-healz-brown/70">Tostada integral con aguacate y tomate</p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-cream/20 border border-healz-brown/5">
                        <p className="font-medium text-healz-brown text-sm">Almuerzo:</p>
                        <p className="text-sm text-healz-brown/70">Ensalada mediterránea con pescado</p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-cream/20 border border-healz-brown/5">
                        <p className="font-medium text-healz-brown text-sm">Merienda:</p>
                        <p className="text-sm text-healz-brown/70">Frutos secos y fruta fresca</p>
                      </div>
                      <div className="p-3 rounded-lg bg-healz-cream/20 border border-healz-brown/5">
                        <p className="font-medium text-healz-brown text-sm">Cena:</p>
                        <p className="text-sm text-healz-brown/70">Verduras al vapor con proteína magra</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Consideraciones Especiales */}
          {(item.special_considerations || item.additional_notes || item.meal_timing || item.portion_guidelines) && (
            <AccordionItem value="considerations" className="border-b-0">
              <AccordionTrigger className="hover:text-healz-blue text-healz-brown font-medium py-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-healz-blue" />
                  Consideraciones Especiales
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4 space-y-4">
                  {item.meal_timing && (
                    <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-healz-blue" />
                        <span className="font-medium text-healz-brown text-sm">Horarios Recomendados</span>
                      </div>
                      <p className="text-sm text-healz-brown/80 leading-relaxed">{item.meal_timing}</p>
                    </div>
                  )}
                  
                  {item.portion_guidelines && (
                    <div className="p-3 rounded-lg bg-healz-purple/5 border border-healz-purple/10">
                      <span className="font-medium text-healz-brown text-sm block mb-2">Guía de Porciones:</span>
                      <p className="text-sm text-healz-brown/80 leading-relaxed">{item.portion_guidelines}</p>
                    </div>
                  )}
                  
                  {(item.special_considerations || item.additional_notes) && (
                    <div className="p-3 rounded-lg bg-healz-yellow/5 border border-healz-yellow/10">
                      <span className="font-medium text-healz-brown text-sm block mb-2">Notas Importantes:</span>
                      <p className="text-sm text-healz-brown/80 leading-relaxed">
                        {item.special_considerations || item.additional_notes}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

        </Accordion>
      </CardContent>
    </Card>
  );
};