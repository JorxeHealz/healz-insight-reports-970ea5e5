import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Pill, Clock, Shield, AlertTriangle, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { EnhancedActionPlanCard } from './EnhancedActionPlanCard';

type SupplementActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const SupplementActionPlanCard: React.FC<SupplementActionPlanCardProps> = ({ item, onEdit, onDelete }) => {

  // Extract essential information for preview
  const getEssentialTags = () => {
    const tags = [];
    if (item.dosage) tags.push(item.dosage);
    if (item.frequency) tags.push(item.frequency);
    if (item.timing) tags.push(item.timing);
    if (item.brand_recommendations?.length > 0) tags.push(`${item.brand_recommendations.length} marcas`);
    return tags.slice(0, 2); // Solo 2 tags para mantenerlo compacto
  };

  const getTimeframe = () => {
    if (item.duration) return item.duration;
    if (item.immediate_phase_duration) return `Fase inicial: ${item.immediate_phase_duration}`;
    return "Según indicación médica";
  };

  // VISTA PREVIA COMPACTA - Solo lo esencial
  const previewContent = (
    <div className="space-y-3">
      {/* LISTA COMPACTA DE SUPLEMENTOS */}
      <div className="space-y-2">
        {/* Información esencial en una línea */}
        <div className="flex items-center justify-between bg-healz-orange/5 p-3 rounded-lg border border-healz-orange/20">
          <div className="flex items-center gap-3">
            <Pill className="h-5 w-5 text-healz-orange" />
            <div>
              <h4 className="font-semibold text-healz-brown text-base">{item.supplement_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-healz-brown/70">{item.dosage}</span>
                {item.frequency && (
                  <>
                    <span className="text-healz-brown/40">•</span>
                    <span className="text-sm text-healz-brown/70">{item.frequency}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Badge de prioridad más prominente */}
          <Badge className={`px-3 py-1 text-sm font-semibold ${getPriorityStyle(item.priority)}`}>
            {getPriorityIcon(item.priority)} {getPriorityText(item.priority)}
          </Badge>
        </div>

        {/* Indicación médica destacada si existe */}
        {item.reason && (
          <div className="bg-healz-teal/10 p-3 rounded-lg border-l-4 border-healz-teal">
            <p className="text-sm text-healz-brown font-medium">
              <span className="text-healz-teal font-semibold">Indicación:</span> {item.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // CONTENIDO DETALLADO - Información médica completa
  const expandedContent = (
    <div className="space-y-4">
      
      {/* SECCIÓN 1: PROTOCOLO DE DOSIFICACIÓN */}
      <div className="bg-healz-blue/5 p-4 rounded-xl border border-healz-blue/20">
        <h5 className="text-base font-bold text-healz-blue mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Protocolo de Toma
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-healz-blue/20">
            <h6 className="text-sm font-semibold text-healz-blue mb-1">Dosis</h6>
            <p className="text-lg font-bold text-healz-brown">{item.dosage}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-healz-blue/20">
            <h6 className="text-sm font-semibold text-healz-blue mb-1">Frecuencia</h6>
            <p className="text-lg font-bold text-healz-brown">{item.frequency || 'No especificada'}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-healz-blue/20">
            <h6 className="text-sm font-semibold text-healz-blue mb-1">Momento</h6>
            <p className="text-lg font-bold text-healz-brown">{item.timing || 'Flexible'}</p>
          </div>
        </div>
        
        {item.duration && (
          <div className="mt-3 bg-healz-blue/10 p-3 rounded-lg">
            <p className="text-sm text-healz-brown">
              <span className="font-semibold">Duración del tratamiento:</span> {item.duration}
            </p>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: MARCAS RECOMENDADAS */}
      {item.brand_recommendations && Array.isArray(item.brand_recommendations) && item.brand_recommendations.length > 0 && (
        <div className="bg-healz-green/5 p-4 rounded-xl border border-healz-green/20">
          <h5 className="text-base font-bold text-healz-green mb-3 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Marcas Recomendadas
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.brand_recommendations.map((brand: string, index: number) => (
              <Badge key={index} className="text-sm bg-healz-green/10 text-healz-green border border-healz-green/30 px-3 py-2">
                {brand}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: CONTRAINDICACIONES Y PRECAUCIONES */}
      {item.contraindications && Array.isArray(item.contraindications) && item.contraindications.length > 0 && (
        <div className="bg-red-50/70 p-4 rounded-xl border border-red-200/50">
          <h5 className="text-base font-bold text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Contraindicaciones
          </h5>
          <div className="space-y-2">
            {item.contraindications.map((contraindication: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-red-600 text-sm mt-1">⚠️</span>
                <p className="text-sm text-red-800/90 leading-relaxed">{contraindication}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 4: INFORMACIÓN ADICIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monitoreo */}
        {item.monitoring_notes && (
          <div className="bg-healz-purple/5 p-4 rounded-lg border border-healz-purple/20">
            <h6 className="text-sm font-semibold text-healz-purple mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Monitoreo
            </h6>
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.monitoring_notes}</p>
          </div>
        )}

        {/* Costo estimado */}
        {item.total_monthly_cost && (
          <div className="bg-healz-yellow/5 p-4 rounded-lg border border-healz-yellow/20">
            <h6 className="text-sm font-semibold text-healz-orange mb-2">Costo Mensual</h6>
            <p className="text-lg font-bold text-healz-brown">{item.total_monthly_cost}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Funciones auxiliares para prioridad
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-healz-red/20 text-healz-red border-healz-red/50';
      case 'medium': return 'bg-healz-orange/20 text-healz-orange border-healz-orange/50';
      default: return 'bg-healz-green/20 text-healz-green border-healz-green/50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      default: return '✅';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Prioritario';
      case 'medium': return 'Importante';
      default: return 'Opcional';
    }
  };

  return (
    <EnhancedActionPlanCard
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      categoryIcon={Pill}
      categoryColor="text-healz-orange"
      title={`Suplementos (${getPriorityText(item.priority)})`}
      previewContent={previewContent}
      expandedContent={expandedContent}
      timeframe={getTimeframe()}
      essentialTags={getEssentialTags()}
    />
  );
};