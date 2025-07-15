import React from 'react';
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface Supplement {
  id: string;
  patient_id: string;
  form_id: string;
  supplement_name: string;
  priority: 'high' | 'medium' | 'low';
  dosage: string;
  timing?: string;
  reason?: string;
  frequency?: string;
  duration?: string;
  brand_recommendations?: string[];
  contraindications?: string[];
  monitoring_notes?: string;
}

interface SupplementActionPlanCardProps {
  supplements: Supplement[];
  onEdit?: (item: Supplement) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}

export const SupplementActionPlanCard: React.FC<SupplementActionPlanCardProps> = ({
  supplements,
  onEdit,
  onDelete,
  onAdd,
  isEditable = true
}) => {
  if (!supplements || supplements.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-healz-orange/20 flex items-center justify-center">
                💊
              </div>
              <div>
                <h3 className="font-medium text-healz-blue">Suplementos</h3>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-healz-orange/20 flex items-center justify-center">
            💊
          </div>
          <div>
            <h3 className="font-medium text-healz-blue">Suplementos</h3>
            <p className="text-sm text-gray-500">{supplements.length} recomendaciones</p>
          </div>
        </div>
        {isEditable && onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {supplements.map((supplement) => {
        const priorityBadge = getPriorityBadge(supplement.priority);
        
        return (
          <Card key={supplement.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-healz-blue">{supplement.supplement_name}</h4>
                    <Badge className={priorityBadge.style}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Dosis:</span> {supplement.dosage}
                    {supplement.frequency && (
                      <span> • <span className="font-semibold">Frecuencia:</span> {supplement.frequency}</span>
                    )}
                  </p>
                </div>
                {isEditable && (
                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(supplement)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(supplement.id)}
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
                {/* Indicación Médica */}
                {supplement.reason && (
                  <AccordionItem value="indication">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-green">🩺</span>
                        Indicación Médica
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-healz-cream/30 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {supplement.reason}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Protocolo de Toma */}
                <AccordionItem value="protocol">
                  <AccordionTrigger className="text-sm font-medium text-healz-blue">
                    <div className="flex items-center gap-2">
                      <span className="text-healz-blue">⏰</span>
                      Protocolo de Toma
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm">
                            <span className="font-semibold text-healz-blue">Dosis:</span><br />
                            {supplement.dosage}
                          </p>
                        </div>
                        {supplement.timing && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm">
                              <span className="font-semibold text-healz-blue">Momento:</span><br />
                              {supplement.timing}
                            </p>
                          </div>
                        )}
                        {supplement.frequency && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm">
                              <span className="font-semibold text-healz-blue">Frecuencia:</span><br />
                              {supplement.frequency}
                            </p>
                          </div>
                        )}
                        {supplement.duration && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm">
                              <span className="font-semibold text-healz-blue">Duración:</span><br />
                              {supplement.duration}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Marcas Recomendadas */}
                {supplement.brand_recommendations && supplement.brand_recommendations.length > 0 && (
                  <AccordionItem value="brands">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-purple">🏷️</span>
                        Marcas Recomendadas
                        <Badge variant="secondary" className="ml-2">
                          {supplement.brand_recommendations.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {supplement.brand_recommendations.map((brand, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-healz-purple">✓</span>
                            <span className="text-sm text-gray-700">{brand}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Interacciones y Precauciones */}
                {supplement.contraindications && supplement.contraindications.length > 0 && (
                  <AccordionItem value="contraindications">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        Interacciones y Precauciones
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {supplement.contraindications.map((contraindication, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-gray-700">{contraindication}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Monitoreo y Seguimiento */}
                {supplement.monitoring_notes && (
                  <AccordionItem value="monitoring">
                    <AccordionTrigger className="text-sm font-medium text-healz-blue">
                      <div className="flex items-center gap-2">
                        <span className="text-healz-brown">📊</span>
                        Monitoreo y Seguimiento
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {supplement.monitoring_notes}
                        </p>
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