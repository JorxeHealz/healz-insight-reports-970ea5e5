import React from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';
import { Pill, Clock, Shield, AlertTriangle, Package, Edit2, Trash2, Target } from 'lucide-react';

type SupplementActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const SupplementActionPlanCard: React.FC<SupplementActionPlanCardProps> = ({ item, onEdit, onDelete }) => {

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Prioridad Media';
      default: return 'Prioridad Baja';
    }
  };

  return (
    <Card className="border-healz-brown/10 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-healz-orange/10">
              <Pill className="h-4 w-4 text-healz-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-healz-brown text-lg">
                {item.supplement_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-healz-brown/70 font-medium">{item.dosage}</span>
                {item.frequency && (
                  <>
                    <span className="text-healz-brown/40">•</span>
                    <span className="text-sm text-healz-brown/70">{item.frequency}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs border ${getPriorityStyle(item.priority)}`}>
              {getPriorityText(item.priority)}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8 p-0 hover:bg-healz-brown/5"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 text-healz-red hover:text-healz-red hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="single" className="w-full" collapsible>
          
          {/* Indicación Médica */}
          <AccordionItem value="indication" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-teal text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-healz-teal" />
                Indicación Médica
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {item.reason ? (
                  <div className="p-4 rounded-lg bg-healz-teal/5 border border-healz-teal/10">
                    <p className="text-sm text-healz-brown leading-relaxed">{item.reason}</p>
                  </div>
                ) : (
                  <p className="text-sm text-healz-brown/60 italic">No se ha especificado la indicación médica</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Protocolo de Toma */}
          <AccordionItem value="protocol" className="border-b border-healz-brown/5">
            <AccordionTrigger className="hover:text-healz-blue text-healz-brown font-medium py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-healz-blue" />
                Protocolo de Toma
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                    <span className="font-medium text-healz-brown text-sm block mb-2">Dosis:</span>
                    <p className="text-sm text-healz-brown/80">{item.dosage || 'No especificada'}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                    <span className="font-medium text-healz-brown text-sm block mb-2">Frecuencia:</span>
                    <p className="text-sm text-healz-brown/80">{item.frequency || 'No especificada'}</p>
                  </div>
                  
                  {item.timing && (
                    <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                      <span className="font-medium text-healz-brown text-sm block mb-2">Momento:</span>
                      <p className="text-sm text-healz-brown/80">{item.timing}</p>
                    </div>
                  )}
                  
                  {item.with_or_without_food && (
                    <div className="p-3 rounded-lg bg-healz-blue/5 border border-healz-blue/10">
                      <span className="font-medium text-healz-brown text-sm block mb-2">Con comida:</span>
                      <p className="text-sm text-healz-brown/80">{item.with_or_without_food}</p>
                    </div>
                  )}
                </div>
                
                {item.duration && (
                  <div className="mt-4 p-3 rounded-lg bg-healz-blue/10 border border-healz-blue/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-healz-blue" />
                      <span className="font-medium text-healz-brown text-sm">Duración del tratamiento:</span>
                    </div>
                    <p className="text-sm text-healz-brown/80">{item.duration}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Marcas Recomendadas */}
          {item.brand_recommendations && Array.isArray(item.brand_recommendations) && item.brand_recommendations.length > 0 && (
            <AccordionItem value="brands" className="border-b border-healz-brown/5">
              <AccordionTrigger className="hover:text-healz-orange text-healz-brown font-medium py-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-healz-orange" />
                  Marcas Recomendadas
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-orange/10 text-healz-orange border-0">
                    {item.brand_recommendations.length} marcas
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.brand_recommendations.map((brand: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-healz-orange/5 border border-healz-orange/10">
                        <div className="w-2 h-2 rounded-full bg-healz-orange flex-shrink-0"></div>
                        <span className="text-sm text-healz-brown font-medium">{brand}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Interacciones y Precauciones */}
          {item.interactions && Array.isArray(item.interactions) && item.interactions.length > 0 && (
            <AccordionItem value="interactions" className="border-b border-healz-brown/5">
              <AccordionTrigger className="hover:text-healz-red text-healz-brown font-medium py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-healz-red" />
                  Interacciones y Precauciones
                  <Badge variant="secondary" className="ml-2 text-xs bg-healz-red/10 text-healz-red border-0">
                    {item.interactions.length} interacciones
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4">
                  <div className="space-y-3">
                    {item.interactions.map((interaction: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-healz-red/5 border border-healz-red/10">
                        <AlertTriangle className="h-4 w-4 text-healz-red mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-healz-brown leading-relaxed">{interaction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Monitoreo y Seguimiento */}
          {item.monitoring_notes && (
            <AccordionItem value="monitoring" className="border-b-0">
              <AccordionTrigger className="hover:text-healz-purple text-healz-brown font-medium py-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-healz-purple" />
                  Monitoreo y Seguimiento
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4">
                  <div className="p-4 rounded-lg bg-healz-purple/5 border border-healz-purple/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-healz-purple" />
                      <span className="font-medium text-healz-brown text-sm">Indicaciones de seguimiento:</span>
                    </div>
                    <p className="text-sm text-healz-brown/80 leading-relaxed">{item.monitoring_notes}</p>
                  </div>
                  
                  {item.total_monthly_cost && (
                    <div className="mt-4 p-3 rounded-lg bg-healz-yellow/5 border border-healz-yellow/10">
                      <span className="font-medium text-healz-brown text-sm block mb-1">Costo mensual estimado:</span>
                      <p className="text-lg font-bold text-healz-brown">{item.total_monthly_cost}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

        </Accordion>
      </CardContent>
    </Card>
  );
};