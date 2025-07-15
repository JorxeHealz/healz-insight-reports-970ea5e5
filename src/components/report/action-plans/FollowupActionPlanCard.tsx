import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus, Calendar, Clock, TestTube, Target, FileText, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  if (!followupPlans || followupPlans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-teal/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-healz-teal" />
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

  const getFollowupIcon = (followupType: string) => {
    const icons: Record<string, any> = {
      lab_retest: TestTube,
      appointment: Calendar,
      progress_check: Target,
      imaging: FileText,
      consultation: Calendar,
      default: Calendar
    };
    const IconComponent = icons[followupType?.toLowerCase().replace(' ', '_')] || icons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-teal/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-healz-teal" />
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
        const isExpanded = showDetails[followup.id] || false;
        
        const getPriorityCardClass = (priority: string) => {
          const classes = {
            high: 'bg-healz-red/5 border-l-4 border-healz-red',
            medium: 'bg-healz-orange/5 border-l-4 border-healz-orange', 
            low: 'bg-healz-green/5 border-l-4 border-healz-green'
          };
          return classes[priority as keyof typeof classes] || classes.low;
        };
        
        return (
          <Card key={followup.id} className={`w-full border border-healz-brown/10 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${getPriorityCardClass(followup.priority)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-healz-teal">{followupIcon}</span>
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
              <div className="flex justify-center mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(prev => ({ ...prev, [followup.id]: !prev[followup.id] }))}
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
                  {/* Cronograma y Programación */}
                  <AccordionItem value="timeline">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-healz-teal" />
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
                          <TestTube className="w-4 h-4 text-healz-purple" />
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
                          <Target className="w-4 h-4 text-healz-green" />
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
                          <FileText className="w-4 h-4 text-healz-orange" />
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
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Criterios de Escalación
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {followup.escalation_criteria.map((criterion, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                <p className="text-sm text-gray-700">{criterion}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};