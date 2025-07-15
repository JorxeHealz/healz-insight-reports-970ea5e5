import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus, Heart, ChevronDown, ChevronUp, Brain, Moon, Calendar } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface LifestylePlan {
  id: string;
  patient_id: string;
  form_id: string;
  priority: 'high' | 'medium' | 'low';
  stress_management_techniques?: any[]; // JSON array
  sleep_target_hours?: string;
  sleep_interventions?: any[]; // JSON array
  daily_routine_recommendations?: any[]; // JSON array
}

interface LifestyleActionPlanCardProps {
  lifestylePlans: LifestylePlan[];
  onEdit?: (item: LifestylePlan) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}

export const LifestyleActionPlanCard: React.FC<LifestyleActionPlanCardProps> = ({
  lifestylePlans,
  onEdit,
  onDelete,
  onAdd,
  isEditable = true
}) => {
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  if (!lifestylePlans || lifestylePlans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-blue/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-healz-blue" />
              </div>
              <div>
                <h3 className="font-medium text-healz-blue">Estilo de Vida</h3>
                <p className="text-sm text-gray-500">Sin recomendaciones</p>
              </div>
            </div>
            {isEditable && onAdd && (
              <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-healz-red text-white',
      medium: 'bg-healz-orange text-white',
      low: 'bg-healz-green text-white'
    };
    const labels = {
      high: 'Alta Prioridad',
      medium: 'Media Prioridad',
      low: 'Baja Prioridad'
    };
    return { style: styles[priority as keyof typeof styles], label: labels[priority as keyof typeof labels] };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-blue/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-healz-blue" />
          </div>
          <div>
            <h3 className="font-medium text-healz-blue">Estilo de Vida</h3>
            <p className="text-sm text-gray-500">{lifestylePlans.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {lifestylePlans.map((plan) => {
        const priorityBadge = getPriorityBadge(plan.priority);
        const isExpanded = showDetails[plan.id] || false;
        
        const getPriorityCardClass = (priority: string) => {
          const classes = {
            high: 'bg-healz-red/5 border-l-4 border-healz-red',
            medium: 'bg-healz-orange/5 border-l-4 border-healz-orange', 
            low: 'bg-healz-green/5 border-l-4 border-healz-green'
          };
          return classes[priority as keyof typeof classes] || classes.low;
        };
        
        return (
          <Card key={plan.id} className={`w-full border border-healz-brown/10 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${getPriorityCardClass(plan.priority)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-healz-blue" />
                    <h4 className="font-medium text-healz-blue">Plan de Estilo de Vida</h4>
                    <Badge className={priorityBadge.style}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  
                  {/* Objetivo de sueño fijo si existe */}
                  {plan.sleep_target_hours && (
                    <div className="p-3 bg-healz-blue/10 rounded-lg border border-healz-blue/20 mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-healz-blue" />
                        <span className="font-semibold text-healz-blue">Objetivo de Sueño:</span>
                        <span className="text-healz-blue">{plan.sleep_target_hours}</span>
                      </div>
                    </div>
                  )}
                </div>
                {isEditable && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(plan)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(plan.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex justify-center mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(prev => ({ ...prev, [plan.id]: !prev[plan.id] }))}
                  className="text-healz-blue hover:text-healz-blue/80"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Ver más
                    </>
                  )}
                </Button>
              </div>

              {isExpanded && (
                <Accordion type="multiple" className="w-full">
                  {/* Manejo de Estrés */}
                  <AccordionItem value="stress-management">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-healz-orange" />
                        Manejo de Estrés
                        {plan.stress_management_techniques && plan.stress_management_techniques.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {plan.stress_management_techniques.length}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {plan.stress_management_techniques && plan.stress_management_techniques.length > 0 ? (
                          plan.stress_management_techniques.map((technique, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <span className="text-healz-orange font-medium mt-0.5">{index + 1}.</span>
                              <span className="text-sm text-gray-700">{technique}</span>
                            </div>
                          ))
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <span className="text-healz-orange font-medium mt-0.5">1.</span>
                              <span className="text-sm text-gray-700">Técnicas de respiración profunda (5-10 minutos diarios)</span>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <span className="text-healz-orange font-medium mt-0.5">2.</span>
                              <span className="text-sm text-gray-700">Meditación mindfulness (10-15 minutos)</span>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <span className="text-healz-orange font-medium mt-0.5">3.</span>
                              <span className="text-sm text-gray-700">Paseos en naturaleza (20-30 minutos)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Calidad del Sueño */}
                  <AccordionItem value="sleep-interventions">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-healz-purple" />
                        Calidad del Sueño
                        {plan.sleep_interventions && plan.sleep_interventions.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {plan.sleep_interventions.length}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {plan.sleep_interventions && plan.sleep_interventions.length > 0 ? (
                          plan.sleep_interventions.map((intervention, index) => (
                            <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm text-gray-700">{intervention}</p>
                            </div>
                          ))
                        ) : (
                          <div className="space-y-2">
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm text-gray-700">Establecer horario fijo de sueño y despertar</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm text-gray-700">Evitar pantallas 1 hora antes de dormir</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm text-gray-700">Crear rutina de relajación antes de acostarse</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Tareas Diarias */}
                  <AccordionItem value="daily-routine">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-healz-green" />
                        Tareas Diarias
                        {plan.daily_routine_recommendations && plan.daily_routine_recommendations.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {plan.daily_routine_recommendations.length}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {plan.daily_routine_recommendations && plan.daily_routine_recommendations.length > 0 ? (
                          <div className="space-y-3">
                            {plan.daily_routine_recommendations.map((routine, index) => (
                              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-gray-700">{routine}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {/* Rutina por períodos del día */}
                            <div className="border border-gray-200 rounded-lg p-3">
                              <h4 className="font-medium text-healz-blue mb-2">🌅 Mañana (7:00 - 12:00)</h4>
                              <div className="space-y-1">
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Hidratación al despertar (1-2 vasos de agua)
                                </div>
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  5-10 minutos de estiramientos
                                </div>
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Exposición a luz natural (10-15 minutos)
                                </div>
                              </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3">
                              <h4 className="font-medium text-healz-blue mb-2">☀️ Mediodía (12:00 - 17:00)</h4>
                              <div className="space-y-1">
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Descanso activo (5-10 minutos cada 2 horas)
                                </div>
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Hidratación regular
                                </div>
                              </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3">
                              <h4 className="font-medium text-healz-blue mb-2">🌇 Tarde (17:00 - 21:00)</h4>
                              <div className="space-y-1">
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Actividad física moderada (20-30 minutos)
                                </div>
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Tiempo de desconexión digital
                                </div>
                              </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-3">
                              <h4 className="font-medium text-healz-blue mb-2">🌃 Noche (21:00 - 23:00)</h4>
                              <div className="space-y-1">
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Rutina de relajación (lectura, música suave)
                                </div>
                                <div className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-healz-green">•</span>
                                  Preparación para el descanso
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};