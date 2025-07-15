import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus, Stethoscope, Activity, Zap, MapPin, Hand, Heart, ClipboardList, Clock, Target, BarChart3, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface Therapy {
  id: string;
  patient_id: string;
  form_id: string;
  therapy_type: string;
  priority: 'high' | 'medium' | 'low';
  protocol?: string;
  frequency?: string;
  duration?: string;
  provider_type?: string;
  monitoring_requirements?: string[];
  expected_outcomes?: string[];
  precautions?: string[];
}

interface TherapyActionPlanCardProps {
  therapyPlans: Therapy[];
  onEdit?: (item: Therapy) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}

export const TherapyActionPlanCard: React.FC<TherapyActionPlanCardProps> = ({
  therapyPlans,
  onEdit,
  onDelete,
  onAdd,
  isEditable = true
}) => {
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  if (!therapyPlans || therapyPlans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-red/20 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-healz-red" />
              </div>
              <div>
                <h3 className="font-medium text-healz-blue">Terapia</h3>
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

  const getTherapyIcon = (therapyType: string) => {
    const icons: Record<string, any> = {
      hormone_replacement: Activity,
      iv_therapy: Zap,
      red_light: Heart,
      hyperbaric: Activity,
      physical_therapy: Activity,
      acupuncture: MapPin,
      massage: Hand,
      default: Stethoscope
    };
    const IconComponent = icons[therapyType?.toLowerCase().replace(' ', '_')] || icons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-red/20 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-healz-red" />
          </div>
          <div>
            <h3 className="font-medium text-healz-blue">Terapia</h3>
            <p className="text-sm text-gray-500">{therapyPlans.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {therapyPlans.map((therapy) => {
        const priorityBadge = getPriorityBadge(therapy.priority);
        const therapyIcon = getTherapyIcon(therapy.therapy_type);
        const isExpanded = showDetails[therapy.id] || false;
        
        const getPriorityCardClass = (priority: string) => {
          const classes = {
            high: 'bg-healz-red/5 border-l-4 border-healz-red',
            medium: 'bg-healz-orange/5 border-l-4 border-healz-orange', 
            low: 'bg-healz-green/5 border-l-4 border-healz-green'
          };
          return classes[priority as keyof typeof classes] || classes.low;
        };
        
        return (
          <Card key={therapy.id} className={`w-full border border-healz-brown/10 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${getPriorityCardClass(therapy.priority)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-healz-blue">{therapyIcon}</span>
                    <h4 className="font-medium text-healz-blue">
                      {therapy.therapy_type}
                    </h4>
                    <Badge className={priorityBadge.style}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {therapy.frequency && (
                      <span><span className="font-semibold">Frecuencia:</span> {therapy.frequency}</span>
                    )}
                    {therapy.duration && (
                      <span><span className="font-semibold">Duración:</span> {therapy.duration}</span>
                    )}
                  </div>
                </div>
                {isEditable && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(therapy)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(therapy.id)}
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
                  onClick={() => setShowDetails(prev => ({ ...prev, [therapy.id]: !prev[therapy.id] }))}
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
                  {/* Protocolo de Tratamiento */}
                  {therapy.protocol && (
                    <AccordionItem value="protocol">
                      <AccordionTrigger className="text-sm font-medium text-healz-blue">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-healz-blue" />
                          Protocolo de Tratamiento
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-3 bg-healz-cream/30 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {therapy.protocol}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Programación */}
                  <AccordionItem value="scheduling">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-healz-purple" />
                        Programación
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm">
                            <span className="font-semibold text-healz-blue">Frecuencia:</span><br />
                            {therapy.frequency || 'No especificada'}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm">
                            <span className="font-semibold text-healz-blue">Duración Total:</span><br />
                            {therapy.duration || 'No especificada'}
                          </p>
                        </div>
                        {therapy.provider_type && (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 md:col-span-2">
                            <p className="text-sm">
                              <span className="font-semibold text-healz-blue">Tipo de Proveedor:</span><br />
                              {therapy.provider_type}
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Resultados Esperados */}
                  {therapy.expected_outcomes && therapy.expected_outcomes.length > 0 && (
                    <AccordionItem value="outcomes">
                      <AccordionTrigger className="text-sm font-medium text-healz-blue">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-healz-green" />
                          Resultados Esperados
                          <Badge variant="secondary" className="ml-2">
                            {therapy.expected_outcomes.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {therapy.expected_outcomes.map((outcome, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-start gap-2">
                                <span className="text-healz-green font-medium">{index + 1}.</span>
                                <p className="text-sm text-gray-700">{outcome}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Monitoreo Requerido */}
                  {therapy.monitoring_requirements && therapy.monitoring_requirements.length > 0 && (
                    <AccordionItem value="monitoring">
                      <AccordionTrigger className="text-sm font-medium text-healz-blue">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-healz-teal" />
                          Monitoreo Requerido
                          <Badge variant="secondary" className="ml-2">
                            {therapy.monitoring_requirements.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {therapy.monitoring_requirements.map((requirement, index) => (
                            <div key={index} className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                              <p className="text-sm text-gray-700">{requirement}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Precauciones */}
                  {therapy.precautions && therapy.precautions.length > 0 && (
                    <AccordionItem value="precautions">
                      <AccordionTrigger className="text-sm font-medium text-healz-blue">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Precauciones
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {therapy.precautions.map((precaution, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-gray-700">{precaution}</p>
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