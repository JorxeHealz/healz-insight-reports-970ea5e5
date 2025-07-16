import React from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus, Apple, Target, Check, X, Utensils, AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
interface FoodPlan {
  id: string;
  patient_id: string;
  form_id: string;
  priority: 'high' | 'medium' | 'low';
  dietary_pattern?: string;
  main_goals?: any[]; // JSON array
  foods_to_include?: any[]; // JSON array
  foods_to_avoid?: any[]; // JSON array
  meal_examples?: Record<string, string[]>; // JSON object
  special_considerations?: any[]; // JSON array
}
interface FoodActionPlanCardProps {
  foodPlans: FoodPlan[];
  onEdit?: (item: FoodPlan) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}
export const FoodActionPlanCard: React.FC<FoodActionPlanCardProps> = ({
  foodPlans,
  onEdit,
  onDelete,
  onAdd,
  isEditable = true
}) => {
  if (!foodPlans || foodPlans.length === 0) {
    return <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-green/20 flex items-center justify-center">
                <Apple className="w-4 h-4 text-healz-green" />
              </div>
              <div>
                <h3 className="font-medium text-healz-blue">Alimentación</h3>
                <p className="text-sm text-gray-500">Sin recomendaciones</p>
              </div>
            </div>
            {isEditable && onAdd && <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>}
          </div>
        </CardHeader>
      </Card>;
  }
  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-healz-orange text-white',
      medium: 'bg-healz-yellow text-healz-blue',
      low: 'bg-healz-green/20 text-healz-green'
    };
    const labels = {
      high: 'Alta Prioridad',
      medium: 'Media Prioridad',
      low: 'Baja Prioridad'
    };
    return {
      style: styles[priority as keyof typeof styles],
      label: labels[priority as keyof typeof labels]
    };
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-green/20 flex items-center justify-center">
            <Apple className="w-4 h-4 text-healz-green" />
          </div>
          <div>
            <h3 className="text-left text-base font-bold text-slate-900">Alimentación</h3>
            <p className="text-sm text-gray-500">{foodPlans.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>}
      </div>

      {foodPlans.map(plan => {
      const priorityBadge = getPriorityBadge(plan.priority);
      return <Card key={plan.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={priorityBadge.style}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-2 text-healz-brown">Plan Alimentario</h4>
                  {plan.dietary_pattern && <p className="text-sm text-gray-600 leading-relaxed">
                      {plan.dietary_pattern}
                    </p>}
                </div>
                {isEditable && <div className="flex items-center gap-1">
                    {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(plan)}>
                        <Pencil className="w-4 h-4" />
                      </Button>}
                    {onDelete && <Button variant="ghost" size="sm" onClick={() => onDelete(plan.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>}
                  </div>}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Accordion type="multiple" className="w-full">
                {/* Objetivos Principales */}
                {plan.main_goals && plan.main_goals.length > 0 && <AccordionItem value="main-goals">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-healz-green" />
                        Objetivos Principales
                        <Badge variant="secondary" className="ml-2">
                          {plan.main_goals.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {plan.main_goals.map((goal, index) => <div key={index} className="flex items-start gap-2 p-2 bg-healz-cream/30 rounded-lg">
                            <span className="text-healz-green font-medium">{index + 1}.</span>
                            <span className="text-sm text-gray-700">{goal}</span>
                          </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>}

                {/* Alimentos a Incluir */}
                {plan.foods_to_include && plan.foods_to_include.length > 0 && <AccordionItem value="foods-include">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-healz-green" />
                        Alimentos a Incluir
                        <Badge variant="secondary" className="ml-2">
                          {plan.foods_to_include.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.foods_to_include.map((food, index) => <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-green-600">+</span>
                            <span className="text-sm text-gray-700">{food}</span>
                          </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>}

                {/* Alimentos a Evitar */}
                {plan.foods_to_avoid && plan.foods_to_avoid.length > 0 && <AccordionItem value="foods-avoid">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500" />
                        Alimentos a Evitar
                        <Badge variant="secondary" className="ml-2">
                          {plan.foods_to_avoid.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.foods_to_avoid.map((food, index) => <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            <span className="text-red-500">−</span>
                            <span className="text-sm text-gray-700">{food}</span>
                          </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>}

                {/* Ejemplos de Comidas (España) */}
                {plan.meal_examples && Object.keys(plan.meal_examples).length > 0 && <AccordionItem value="meal-examples">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-healz-orange" />
                        Ejemplos de Comidas (España)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {Object.entries(plan.meal_examples).map(([mealType, examples]) => <div key={mealType} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-healz-blue mb-2 capitalize">
                              {mealType.replace('_', ' ')}
                            </h4>
                            <div className="space-y-1">
                              {Array.isArray(examples) ? examples.map((example, index) => <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-orange">•</span>
                                  {example}
                                </div>) : <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-orange">•</span>
                                  {examples}
                                </div>}
                            </div>
                          </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>}

                {/* Consideraciones Especiales */}
                {plan.special_considerations && plan.special_considerations.length > 0 && <AccordionItem value="special-considerations">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-healz-brown" />
                        Consideraciones Especiales
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {plan.special_considerations.map((consideration, index) => <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-gray-700">{consideration}</p>
                          </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>}
              </Accordion>
            </CardContent>
          </Card>;
    })}
    </div>;
};