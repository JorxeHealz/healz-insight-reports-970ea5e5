import React from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface Activity {
  id: string;
  patient_id: string;
  form_id: string;
  activity_type?: string;
  frequency_per_week: string;
  priority: 'high' | 'medium' | 'low';
  session_duration?: string;
  intensity_level?: string;
  restrictions?: any[]; // JSON array
  specific_exercises?: string[];
  equipment_needed?: string[];
  progression_plan?: string;
  current_capacity?: string;
  monitoring_signals?: any[]; // JSON array
}

interface ActivityActionPlanCardProps {
  activities: Activity[];
  onEdit?: (item: Activity) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}

export const ActivityActionPlanCard: React.FC<ActivityActionPlanCardProps> = ({
  activities,
  onEdit,
  onDelete,
  onAdd,
  isEditable = true
}) => {
  if (!activities || activities.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-purple/20 flex items-center justify-center">
                🏃
              </div>
              <div>
                <h3 className="font-medium text-healz-blue">Actividad y Ejercicio</h3>
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
      high: 'bg-healz-orange text-white',
      medium: 'bg-healz-yellow text-healz-blue',
      low: 'bg-healz-green/20 text-healz-green'
    };
    const labels = {
      high: 'Alta Prioridad',
      medium: 'Media Prioridad',
      low: 'Baja Prioridad'
    };
    return { style: styles[priority as keyof typeof styles], label: labels[priority as keyof typeof labels] };
  };

  const getActivityIcon = (activityType?: string) => {
    const icons: Record<string, string> = {
      strength_training: '💪',
      cardio: '❤️',
      hiit: '⚡',
      walking: '🚶',
      yoga: '🧘',
      swimming: '🏊',
      cycling: '🚴',
      running: '🏃',
      default: '🏃'
    };
    return icons[activityType?.toLowerCase() || 'default'] || icons.default;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-purple/20 flex items-center justify-center">
            🏃
          </div>
          <div>
            <h3 className="font-medium text-healz-blue">Actividad y Ejercicio</h3>
            <p className="text-sm text-gray-500">{activities.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {activities.map((activity) => {
        const priorityBadge = getPriorityBadge(activity.priority);
        const activityIcon = getActivityIcon(activity.activity_type);
        
        return (
          <Card key={activity.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{activityIcon}</span>
                    <h4 className="font-medium text-healz-brown">
                      {activity.activity_type || 'Actividad Física'}
                    </h4>
                    <Badge className={priorityBadge.style}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Frecuencia:</span> {activity.frequency_per_week}
                    {activity.session_duration && (
                      <span> • <span className="font-semibold">Duración:</span> {activity.session_duration}</span>
                    )}
                  </p>
                </div>
                {isEditable && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(activity)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(activity.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Accordion type="multiple" className="w-full">
                {/* Programa Base */}
                <AccordionItem value="program-details">
                  <AccordionTrigger className="text-sm font-medium text-healz-blue">
                    <div className="flex items-center gap-2">
                      <span className="text-healz-purple">📋</span>
                      Programa Base
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm">
                          <span className="font-semibold text-healz-blue">Duración de Sesión:</span><br />
                          {activity.session_duration || 'No especificada'}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm">
                          <span className="font-semibold text-healz-blue">Nivel de Intensidad:</span><br />
                          {activity.intensity_level || 'No especificado'}
                        </p>
                      </div>
                      {activity.current_capacity && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 md:col-span-2">
                          <p className="text-sm">
                            <span className="font-semibold text-healz-blue">Capacidad Actual:</span><br />
                            {activity.current_capacity}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Ejercicios Específicos */}
                {activity.specific_exercises && activity.specific_exercises.length > 0 && (
                  <AccordionItem value="exercises">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-green">🎯</span>
                        Ejercicios Específicos
                        <Badge variant="secondary" className="ml-2">
                          {activity.specific_exercises.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activity.specific_exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-healz-green">✓</span>
                            <span className="text-sm text-gray-700">{exercise}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Progresión */}
                {activity.progression_plan && (
                  <AccordionItem value="progression">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-orange">📈</span>
                        Progresión
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {activity.progression_plan}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Restricciones */}
                {activity.restrictions && activity.restrictions.length > 0 && (
                  <AccordionItem value="restrictions">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        Restricciones
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {activity.restrictions.map((restriction, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-gray-700">{restriction}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Equipamiento Necesario */}
                {activity.equipment_needed && activity.equipment_needed.length > 0 && (
                  <AccordionItem value="equipment">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-brown">🛠️</span>
                        Equipamiento Necesario
                        <Badge variant="secondary" className="ml-2">
                          {activity.equipment_needed.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activity.equipment_needed.map((equipment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                            <span className="text-healz-brown">•</span>
                            <span className="text-sm text-gray-700">{equipment}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Monitoreo */}
                {activity.monitoring_signals && activity.monitoring_signals.length > 0 && (
                  <AccordionItem value="monitoring">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-teal">📊</span>
                        Monitoreo
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {activity.monitoring_signals.map((signal, index) => (
                          <div key={index} className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                            <p className="text-sm text-gray-700">{signal}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};