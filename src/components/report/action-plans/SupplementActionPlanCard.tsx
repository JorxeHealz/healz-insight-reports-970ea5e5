import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Pill, Clock, DollarSign, AlertTriangle } from 'lucide-react';

type SupplementActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const SupplementActionPlanCard: React.FC<SupplementActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
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
            <Pill className="h-4 w-4 text-healz-orange" />
            <h4 className="font-semibold text-sm text-healz-brown">
              {item.supplement_name}
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

        {/* Información básica siempre visible */}
        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-xs text-healz-brown/80">
              <strong>Dosis:</strong> {item.dosage}
            </p>
            {item.frequency && (
              <p className="text-xs text-healz-brown/80">
                <strong>Frecuencia:</strong> {item.frequency}
              </p>
            )}
          </div>
          
          {item.timing && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-healz-brown/60" />
              <p className="text-xs text-healz-brown/80">{item.timing}</p>
            </div>
          )}

          {item.reason && (
            <p className="text-xs text-healz-brown/70">
              <strong>Motivo:</strong> {item.reason}
            </p>
          )}
        </div>

        {/* Contenido expandible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-8">
              <span className="text-xs">Ver detalles completos</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-3">
            {/* Duración */}
            {item.duration && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Duración del tratamiento:</h5>
                <p className="text-xs text-healz-brown/70">{item.duration}</p>
              </div>
            )}

            {/* Fase inmediata */}
            {item.immediate_phase_duration && (
              <div>
                <h5 className="text-xs font-medium text-healz-orange mb-1">Fase inmediata:</h5>
                <p className="text-xs text-healz-brown/70">{item.immediate_phase_duration}</p>
              </div>
            )}

            {/* Marcas recomendadas */}
            {item.brand_recommendations && Array.isArray(item.brand_recommendations) && item.brand_recommendations.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-green mb-1">Marcas recomendadas:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.brand_recommendations.map((brand: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-green/10 text-healz-green">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contraindicaciones */}
            {item.contraindications && Array.isArray(item.contraindications) && item.contraindications.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-red mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Contraindicaciones:
                </h5>
                <ul className="space-y-1">
                  {item.contraindications.map((contraindication: string, index: number) => (
                    <li key={index} className="text-xs text-healz-red/80">• {contraindication}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Costo mensual */}
            {item.total_monthly_cost && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Costo mensual estimado:
                </h5>
                <p className="text-xs text-healz-brown/70">{item.total_monthly_cost}</p>
              </div>
            )}

            {/* Notas de monitoreo */}
            {item.monitoring_notes && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1">Notas de monitoreo:</h5>
                <p className="text-xs text-healz-brown/70">{item.monitoring_notes}</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};