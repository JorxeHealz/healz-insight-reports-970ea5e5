import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Pill, Clock, Shield, AlertTriangle, Package } from 'lucide-react';

type SupplementActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const SupplementActionPlanCard: React.FC<SupplementActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null);

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

        {/* Vista compacta - Solo información esencial */}
        <div className="space-y-2">
          {/* Dosis y frecuencia en línea */}
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-healz-brown">{item.dosage}</span>
            {item.frequency && (
              <>
                <span className="text-healz-brown/40">•</span>
                <span className="text-healz-brown/70">{item.frequency}</span>
              </>
            )}
            {item.timing && (
              <>
                <span className="text-healz-brown/40">•</span>
                <Clock className="h-3 w-3 text-healz-brown/60" />
                <span className="text-healz-brown/70">{item.timing}</span>
              </>
            )}
          </div>

          {/* Indicación médica breve */}
          {item.reason && (
            <p className="text-xs text-healz-brown/70 line-clamp-1">{item.reason}</p>
          )}
        </div>

        {/* Botón para expandir detalles */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 h-7 text-xs font-medium hover:bg-healz-brown/5"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Ocultar detalles
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Ver información completa
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 space-y-3">
            {/* Indicación médica completa */}
            {item.reason && (
              <div className="bg-healz-teal/10 p-2 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-teal mb-1">Indicación médica:</h5>
                <p className="text-xs text-healz-brown/80">{item.reason}</p>
              </div>
            )}

            {/* Protocolo de toma */}
            <div className="bg-healz-cream/50 p-2 rounded-lg">
              <h5 className="text-xs font-semibold text-healz-brown mb-1">Protocolo de toma:</h5>
              <div className="space-y-1">
                <p className="text-xs text-healz-brown/80">
                  <strong>Dosis:</strong> {item.dosage}
                </p>
                {item.frequency && (
                  <p className="text-xs text-healz-brown/80">
                    <strong>Frecuencia:</strong> {item.frequency}
                  </p>
                )}
                {item.timing && (
                  <p className="text-xs text-healz-brown/80">
                    <strong>Momento:</strong> {item.timing}
                  </p>
                )}
                {item.with_or_without_food && (
                  <p className="text-xs text-healz-brown/80">
                    <strong>Con comida:</strong> {item.with_or_without_food}
                  </p>
                )}
              </div>
            </div>

            {/* Marcas recomendadas */}
            {item.brand_recommendations && Array.isArray(item.brand_recommendations) && item.brand_recommendations.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-healz-orange mb-1">Marcas recomendadas:</h5>
                <div className="flex flex-wrap gap-1">
                  {item.brand_recommendations.map((brand: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-orange/10 text-healz-orange">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interacciones y contraindicaciones */}
            {item.interactions && Array.isArray(item.interactions) && item.interactions.length > 0 && (
              <div className="bg-healz-red/10 p-2 rounded-lg">
                <h5 className="text-xs font-semibold text-healz-red mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Interacciones:
                </h5>
                <ul className="space-y-0.5">
                  {item.interactions.map((interaction: string, index: number) => (
                    <li key={index} className="text-xs text-healz-red/80">• {interaction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notas de monitoreo */}
            {item.monitoring_notes && (
              <div>
                <h5 className="text-xs font-semibold text-healz-purple mb-1 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Monitoreo:
                </h5>
                <p className="text-xs text-healz-brown/70">{item.monitoring_notes}</p>
              </div>
            )}

            {/* Duración del tratamiento */}
            {item.duration && (
              <div className="flex items-center gap-1 text-xs text-healz-brown/70">
                <Clock className="h-3 w-3" />
                <span><strong>Duración:</strong> {item.duration}</span>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};