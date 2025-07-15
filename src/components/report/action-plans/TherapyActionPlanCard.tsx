import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Activity, Clock, Target, Eye, AlertTriangle, User } from 'lucide-react';

type TherapyActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const TherapyActionPlanCard: React.FC<TherapyActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
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
            <Activity className="h-4 w-4 text-healz-red" />
            <h4 className="font-semibold text-sm text-healz-brown">
              {item.therapy_type}
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
          {item.frequency && (
            <p className="text-xs text-healz-brown/80">
              <strong>Frecuencia:</strong> {item.frequency}
            </p>
          )}
          
          {item.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-healz-brown/60" />
              <p className="text-xs text-healz-brown/80">
                <strong>Duración:</strong> {item.duration}
              </p>
            </div>
          )}

          {item.provider_type && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-healz-brown/60" />
              <p className="text-xs text-healz-brown/80">
                <strong>Proveedor:</strong> {item.provider_type}
              </p>
            </div>
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
            {/* Protocolo */}
            {item.protocol && (
              <div>
                <h5 className="text-xs font-medium text-healz-brown mb-1">Protocolo de tratamiento:</h5>
                <p className="text-xs text-healz-brown/70">{item.protocol}</p>
              </div>
            )}

            {/* Resultados esperados */}
            {item.expected_outcomes && Array.isArray(item.expected_outcomes) && item.expected_outcomes.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-green mb-1 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Resultados esperados:
                </h5>
                <ul className="space-y-1">
                  {item.expected_outcomes.map((outcome: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {outcome}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requisitos de monitoreo */}
            {item.monitoring_requirements && Array.isArray(item.monitoring_requirements) && item.monitoring_requirements.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Requisitos de monitoreo:
                </h5>
                <ul className="space-y-1">
                  {item.monitoring_requirements.map((requirement: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Precauciones */}
            {item.precautions && Array.isArray(item.precautions) && item.precautions.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-red mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Precauciones:
                </h5>
                <ul className="space-y-1">
                  {item.precautions.map((precaution: string, index: number) => (
                    <li key={index} className="text-xs text-healz-red/80">• {precaution}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};