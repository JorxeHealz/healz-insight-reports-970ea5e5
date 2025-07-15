import React from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface Followup {
  id: string;
  patient_id: string;
  form_id: string;
  followup_type: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  specific_tests?: string[];
  success_metrics?: string[];
  provider_type?: string;
  preparation_required?: string[];
  escalation_criteria?: string[];
}

interface FollowupActionPlanCardProps {
  followupPlans: Followup[];
  onEdit?: (item: Followup) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}

export const FollowupActionPlanCard: React.FC<FollowupActionPlanCardProps> = ({
  followupPlans,
  onEdit,
  onDelete,
  onAdd,
  isEditable = true
}) => {
  if (!followupPlans || followupPlans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-teal/20 flex items-center justify-center">
                📅
              </div>
              <div>
                <h3 className="font-medium text-healz-blue">Seguimiento</h3>
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

  const getFollowupIcon = (followupType: string) => {
    const icons: Record<string, string> = {
      lab_retest: '🧪',
      appointment: '👨‍⚕️',
      progress_check: '📊',
      imaging: '📷',
      consultation: '🩺',
      default: '📅'
    };
    return icons[followupType?.toLowerCase().replace(' ', '_')] || icons.default;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-teal/20 flex items-center justify-center">
            📅
          </div>
          <div>
            <h3 className="font-medium text-healz-blue">Seguimiento</h3>
            <p className="text-sm text-gray-500">{followupPlans.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {followupPlans.map((followup) => {
        const priorityBadge = getPriorityBadge(followup.priority);
        const followupIcon = getFollowupIcon(followup.followup_type);
        
        return (
          <Card key={followup.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{followupIcon}</span>
                    <h4 className="font-medium text-healz-blue">
                      {followup.followup_type}
                    </h4>
                    <Badge className={priorityBadge.style}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Cronograma:</span><br />
                    {followup.timeline}
                    {followup.provider_type && (
                      <span> • <span className="font-semibold">Proveedor:</span> {followup.provider_type}</span>
                    )}
                  </p>
                </div>
                {isEditable && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(followup)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(followup.id)}
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
                {/* Cronograma y Programación */}
                <AccordionItem value="timeline">
                  <AccordionTrigger className="text-sm font-medium text-healz-blue">
                    <div className="flex items-center gap-2">
                      <span className="text-healz-teal">⏰</span>
                      Cronograma y Programación
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-sm">
                          <span className="font-semibold text-healz-blue">Cronograma:</span><br />
                          {followup.timeline}
                        </p>
                      </div>
                      {followup.provider_type && (
                        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                          <p className="text-sm">
                            <span className="font-semibold text-healz-blue">Tipo de Proveedor:</span><br />
                            {followup.provider_type}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Pruebas Específicas */}
                {followup.specific_tests && followup.specific_tests.length > 0 && (
                  <AccordionItem value="tests">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-purple">🧪</span>
                        Pruebas Específicas
                        <Badge variant="secondary" className="ml-2">
                          {followup.specific_tests.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {followup.specific_tests.map((test, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-healz-purple">✓</span>
                            <span className="text-sm text-gray-700">{test}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Métricas de Éxito */}
                {followup.success_metrics && followup.success_metrics.length > 0 && (
                  <AccordionItem value="metrics">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-green">🎯</span>
                        Métricas de Éxito
                        <Badge variant="secondary" className="ml-2">
                          {followup.success_metrics.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {followup.success_metrics.map((metric, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start gap-2">
                              <span className="text-healz-green font-medium">{index + 1}.</span>
                              <p className="text-sm text-gray-700">{metric}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Preparación Requerida */}
                {followup.preparation_required && followup.preparation_required.length > 0 && (
                  <AccordionItem value="preparation">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-orange">📋</span>
                        Preparación Requerida
                        <Badge variant="secondary" className="ml-2">
                          {followup.preparation_required.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {followup.preparation_required.map((preparation, index) => (
                          <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-start gap-2">
                              <span className="text-healz-orange">•</span>
                              <p className="text-sm text-gray-700">{preparation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Criterios de Escalación */}
                {followup.escalation_criteria && followup.escalation_criteria.length > 0 && (
                  <AccordionItem value="escalation">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">🚨</span>
                        Criterios de Escalación
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {followup.escalation_criteria.map((criterion, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <span className="text-red-500">⚠️</span>
                              <p className="text-sm text-gray-700">{criterion}</p>
                            </div>
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