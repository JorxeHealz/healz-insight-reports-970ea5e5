import React from 'react';
import { Badge } from '../../ui/badge';
import { Apple, Target, Plus, Minus, Clock, AlertTriangle, Droplets } from 'lucide-react';
import { EnhancedActionPlanCard } from './EnhancedActionPlanCard';

type FoodActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const FoodActionPlanCard: React.FC<FoodActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  
  // Extract essential information for preview using new schema
  const getEssentialTags = () => {
    const tags = [];
    if (item.primary_focus) tags.push(item.primary_focus);
    if (item.recommended_foods?.length > 0) tags.push(`${item.recommended_foods.length} alimentos +`);
    if (item.foods_to_eliminate?.length > 0) tags.push(`${item.foods_to_eliminate.length} alimentos -`);
    if (item.hydration_goals) tags.push('Hidratación incluida');
    return tags.slice(0, 3);
  };

  const getTimeframe = () => {
    if (item.implementation_timeline === 'inmediato') return "Iniciar inmediatamente";
    if (item.implementation_timeline === 'gradual') return "Implementación gradual";
    if (item.implementation_timeline === 'por_fases') return "Por fases";
    return item.implementation_timeline || "Implementación flexible";
  };

  // NUEVA ESTRUCTURA - OBJETIVOS PRINCIPALES SIEMPRE VISIBLES
  const previewContent = (
    <div className="space-y-4">
      {/* SECCIÓN FIJA: OBJETIVOS PRINCIPALES */}
      <div className="bg-gradient-to-r from-healz-green/10 to-healz-teal/10 p-4 rounded-xl border border-healz-green/30">
        <h4 className="text-base font-bold text-healz-green mb-3 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Objetivos Principales del Plan
        </h4>
        {item.main_objectives && Array.isArray(item.main_objectives) && item.main_objectives.length > 0 ? (
          <div className="space-y-2">
            {item.main_objectives.slice(0, 3).map((goal: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-healz-green text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-healz-brown font-medium leading-relaxed">{goal}</p>
              </div>
            ))}
            {item.main_objectives.length > 3 && (
              <p className="text-xs text-healz-green/70 ml-9 font-medium">
                +{item.main_objectives.length - 3} objetivos adicionales
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-healz-brown/70 italic">Objetivos por definir</p>
        )}
      </div>

      {/* RESUMEN RÁPIDO */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-healz-cream/40 p-3 rounded-lg border border-healz-brown/10">
          <h5 className="text-xs font-semibold text-healz-brown/70 mb-1">Enfoque Principal</h5>
          <p className="text-sm text-healz-brown font-semibold">{item.primary_focus || 'Por definir'}</p>
        </div>
        
        {item.hydration_goals && (
          <div className="bg-healz-teal/10 p-3 rounded-lg border border-healz-teal/20 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-healz-teal" />
            <div>
              <h5 className="text-xs font-semibold text-healz-teal/70">Hidratación</h5>
              <p className="text-xs text-healz-brown/80 font-medium">{item.hydration_goals}</p>
            </div>
          </div>
        )}
      </div>

      {/* CONTADORES RÁPIDOS */}
      <div className="flex justify-between items-center pt-2 border-t border-healz-cream">
        <div className="flex items-center gap-1">
          <Plus className="h-4 w-4 text-healz-green" />
          <span className="text-sm font-medium text-healz-green">
            {item.recommended_foods?.length || 0} recomendados
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Minus className="h-4 w-4 text-healz-red" />
          <span className="text-sm font-medium text-healz-red">
            {item.foods_to_eliminate?.length || 0} a evitar
          </span>
        </div>
      </div>
    </div>
  );

  // CONTENIDO EXPANDIDO - NUEVA ORGANIZACIÓN POR SECCIONES
  const expandedContent = (
    <div className="space-y-6">
      
      {/* SECCIÓN 1: ALIMENTOS RECOMENDADOS */}
      {item.recommended_foods && Array.isArray(item.recommended_foods) && item.recommended_foods.length > 0 && (
        <div className="bg-healz-green/5 p-4 rounded-xl border border-healz-green/20">
          <h5 className="text-base font-bold text-healz-green mb-3 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Alimentos a Incluir
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.recommended_foods.map((food: string, index: number) => (
              <Badge key={index} className="text-sm bg-healz-green/10 text-healz-green border border-healz-green/30 px-3 py-1">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: ALIMENTOS A EVITAR */}
      {item.foods_to_eliminate && Array.isArray(item.foods_to_eliminate) && item.foods_to_eliminate.length > 0 && (
        <div className="bg-healz-red/5 p-4 rounded-xl border border-healz-red/20">
          <h5 className="text-base font-bold text-healz-red mb-3 flex items-center gap-2">
            <Minus className="h-5 w-5" />
            Alimentos a Evitar
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.foods_to_eliminate.map((food: string, index: number) => (
              <Badge key={index} className="text-sm bg-healz-red/10 text-healz-red border border-healz-red/30 px-3 py-1">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2.5: ALIMENTOS A MODERAR (NUEVA) */}
      {item.foods_to_moderate && Array.isArray(item.foods_to_moderate) && item.foods_to_moderate.length > 0 && (
        <div className="bg-healz-orange/5 p-4 rounded-xl border border-healz-orange/20">
          <h5 className="text-base font-bold text-healz-orange mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alimentos a Moderar
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.foods_to_moderate.map((food: string, index: number) => (
              <Badge key={index} className="text-sm bg-healz-orange/10 text-healz-orange border border-healz-orange/30 px-3 py-1">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: EJEMPLOS DE COMIDAS ESPAÑOLAS */}
      {item.spanish_meal_examples && typeof item.spanish_meal_examples === 'object' && Object.keys(item.spanish_meal_examples).length > 0 && (
        <div className="bg-healz-blue/5 p-4 rounded-xl border border-healz-blue/20">
          <h5 className="text-base font-bold text-healz-blue mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ejemplos de Comidas Españolas
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(item.spanish_meal_examples).map(([mealTime, example]) => {
              // Mapeo de nombres de comidas españolas
              const spanishMealNames: Record<string, string> = {
                'desayuno': 'Desayuno',
                'almuerzo': 'Almuerzo',
                'comida': 'Comida',
                'merienda': 'Merienda',
                'cena': 'Cena',
                'media_manana': 'Media Mañana',
                'media_tarde': 'Media Tarde'
              };
              
              const displayName = spanishMealNames[mealTime.toLowerCase()] || mealTime;
              
              return (
                <div key={mealTime} className="bg-white p-3 rounded-lg border border-healz-blue/20">
                  <h6 className="text-sm font-semibold text-healz-blue mb-2">{displayName}</h6>
                  <p className="text-sm text-healz-brown/80 leading-relaxed">{example as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN 4: CONSIDERACIONES ESPECIALES */}
      {item.special_instructions && Array.isArray(item.special_instructions) && item.special_instructions.length > 0 && (
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/50">
          <h5 className="text-base font-bold text-amber-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Consideraciones Especiales
          </h5>
          <div className="space-y-2">
            {item.special_instructions.map((instruction: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-amber-600 text-sm mt-1">⚠️</span>
                <p className="text-sm text-amber-800/90 leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 5: INFORMACIÓN ADICIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Horarios de comida */}
        {item.meal_timing_preferences && (
          <div className="bg-healz-teal/5 p-4 rounded-lg border border-healz-teal/20">
            <h6 className="text-sm font-semibold text-healz-teal mb-2">Horarios Recomendados</h6>
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.meal_timing_preferences}</p>
          </div>
        )}

        {/* Guía de porciones */}
        {item.portion_size_guide && (
          <div className="bg-healz-purple/5 p-4 rounded-lg border border-healz-purple/20">
            <h6 className="text-sm font-semibold text-healz-purple mb-2">Guía de Porciones</h6>
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.portion_size_guide}</p>
          </div>
        )}

        {/* Métodos de cocción */}
        {item.cooking_methods && Array.isArray(item.cooking_methods) && item.cooking_methods.length > 0 && (
          <div className="bg-healz-green/5 p-4 rounded-lg border border-healz-green/20">
            <h6 className="text-sm font-semibold text-healz-green mb-2">Métodos de Cocción</h6>
            <div className="flex flex-wrap gap-1">
              {item.cooking_methods.map((method: string, index: number) => (
                <Badge key={index} className="text-xs bg-healz-green/10 text-healz-green">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notas de adaptación */}
        {item.adaptation_notes && (
          <div className="bg-healz-blue/5 p-4 rounded-lg border border-healz-blue/20">
            <h6 className="text-sm font-semibold text-healz-blue mb-2">Notas de Adaptación</h6>
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.adaptation_notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <EnhancedActionPlanCard
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      categoryIcon={Apple}
      categoryColor="text-healz-green"
      title={item.plan_title || item.diet_type || 'Plan Alimentario'}
      previewContent={previewContent}
      expandedContent={expandedContent}
      timeframe={getTimeframe()}
      essentialTags={getEssentialTags()}
    />
  );
};