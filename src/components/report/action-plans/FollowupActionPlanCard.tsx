import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Calendar, Clock, TestTube, CheckCircle, AlertTriangle, User } from 'lucide-react';

type FollowupActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const FollowupActionPlanCard: React.FC<FollowupActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
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
            <Calendar className="h-4 w-4 text-healz-orange" />
            <h4 className="font-semibold text-sm text-healz-brown">
              {item.followup_type}
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
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-healz-orange" />
            <p className="text-xs text-healz-brown/80 font-medium">
              <strong>Timeline:</strong> {item.timeline}
            </p>
          </div>
          
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
            {/* Pruebas específicas */}
            {item.specific_tests && Array.isArray(item.specific_tests) && item.specific_tests.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-blue mb-1 flex items-center gap-1">
                  <TestTube className="h-3 w-3" />
                  Pruebas específicas:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {item.specific_tests.map((test: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-healz-blue/10 text-healz-blue">
                      {test}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preparación requerida */}
            {item.preparation_required && Array.isArray(item.preparation_required) && item.preparation_required.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-orange mb-1">Preparación requerida:</h5>
                <ul className="space-y-1">
                  {item.preparation_required.map((prep: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {prep}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Métricas de éxito */}
            {item.success_metrics && Array.isArray(item.success_metrics) && item.success_metrics.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-green mb-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Métricas de éxito:
                </h5>
                <ul className="space-y-1">
                  {item.success_metrics.map((metric: string, index: number) => (
                    <li key={index} className="text-xs text-healz-brown/70">• {metric}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Criterios de escalamiento */}
            {item.escalation_criteria && Array.isArray(item.escalation_criteria) && item.escalation_criteria.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-healz-red mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Criterios de escalamiento:
                </h5>
                <ul className="space-y-1">
                  {item.escalation_criteria.map((criteria: string, index: number) => (
                    <li key={index} className="text-xs text-healz-red/80">• {criteria}</li>
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