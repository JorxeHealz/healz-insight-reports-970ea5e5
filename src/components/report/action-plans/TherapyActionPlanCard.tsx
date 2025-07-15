import React from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
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
  if (!therapies || therapies.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-red/20 flex items-center justify-center">
                🩺
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

  const getTherapyIcon = (therapyType: string) => {
    const icons: Record<string, string> = {
      hormone_replacement: '🧬',
      iv_therapy: '💉',
      red_light: '🔴',
      hyperbaric: '🫁',
      physical_therapy: '🤸',
      acupuncture: '📍',
      massage: '👐',
      default: '🩺'
    };
    return icons[therapyType?.toLowerCase().replace(' ', '_')] || icons.default;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-red/20 flex items-center justify-center">
            🩺
          </div>
          <div>
            <h3 className="font-medium text-healz-blue">Terapia</h3>
            <p className="text-sm text-gray-500">{therapies.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {therapies.map((therapy) => {
        const priorityBadge = getPriorityBadge(therapy.priority);
        const therapyIcon = getTherapyIcon(therapy.therapy_type);
        
        return (
          <Card key={therapy.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{therapyIcon}</span>
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
                        onClick={() => onEdit(therapy.id)}
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
              <Accordion type="multiple" className="w-full">
                {/* Protocolo de Tratamiento */}
                {therapy.protocol && (
                  <AccordionItem value="protocol">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-blue">📋</span>
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
                      <span className="text-healz-purple">⏰</span>
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
                        <span className="text-healz-green">🎯</span>
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
                        <span className="text-healz-teal">📊</span>
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
                        <span className="text-red-500">⚠️</span>
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};