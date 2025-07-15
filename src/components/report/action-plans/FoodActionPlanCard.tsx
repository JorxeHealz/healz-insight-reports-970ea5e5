import React from 'react';
import { Badge } from '../../ui/badge';
import { Apple, Droplets, Clock } from 'lucide-react';
import { EnhancedActionPlanCard } from './EnhancedActionPlanCard';

type FoodActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const FoodActionPlanCard: React.FC<FoodActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  
  // Extract essential information for preview
  const getEssentialTags = () => {
    const tags = [];
    if (item.dietary_pattern) tags.push(item.dietary_pattern);
    if (item.meal_timing) tags.push(item.meal_timing);
    if (item.foods_to_include?.length > 0) tags.push(`${item.foods_to_include.length} alimentos recomendados`);
    if (item.foods_to_avoid?.length > 0) tags.push(`${item.foods_to_avoid.length} alimentos a evitar`);
    return tags.slice(0, 3); // Limit to 3 most important tags
  };

  const getTimeframe = () => {
    if (item.immediate_start) return "Iniciar inmediatamente";
    if (item.phase1_duration) return item.phase1_duration;
    return "Implementación gradual";
  };

  // Preview content - most important information always visible
  const previewContent = (
    <div className="space-y-3">
      {/* Main goals prominently displayed */}
      {item.main_goals && Array.isArray(item.main_goals) && item.main_goals.length > 0 && (
        <div className="bg-healz-green/10 p-3 rounded-lg border border-healz-green/20">
          <h5 className="text-sm font-semibold text-healz-green mb-2 flex items-center gap-2">
            <Apple className="h-4 w-4" />
            Objetivos Principales
          </h5>
          <div className="space-y-1">
            {item.main_goals.slice(0, 2).map((goal: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-healz-green rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm text-healz-brown/90 leading-relaxed">{goal}</p>
              </div>
            ))}
            {item.main_goals.length > 2 && (
              <p className="text-xs text-healz-green/70 ml-3.5">
                +{item.main_goals.length - 2} objetivos adicionales
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key dietary information */}
      <div className="grid grid-cols-1 gap-2">
        {item.dietary_pattern && (
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-healz-brown/70">Patrón Alimentario:</span>
            <span className="text-sm text-healz-brown font-semibold">{item.dietary_pattern}</span>
          </div>
        )}
        {item.meal_timing && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-healz-brown/60" />
            <p className="text-sm text-healz-brown/80 font-medium">{item.meal_timing}</p>
          </div>
        )}
        {item.hydration_recommendation && (
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-healz-teal" />
            <p className="text-sm text-healz-brown/80 font-medium">{item.hydration_recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Expanded content - detailed information
  const expandedContent = (
    <div className="space-y-4">
      {/* Foods to include */}
      {item.foods_to_include && Array.isArray(item.foods_to_include) && item.foods_to_include.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-green mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-healz-green rounded-full"></span>
            Alimentos Recomendados
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.foods_to_include.map((food: string, index: number) => (
              <Badge key={index} className="text-xs bg-healz-green/10 text-healz-green border border-healz-green/30">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Foods to avoid */}
      {item.foods_to_avoid && Array.isArray(item.foods_to_avoid) && item.foods_to_avoid.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-red mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-healz-red rounded-full"></span>
            Alimentos a Evitar
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.foods_to_avoid.map((food: string, index: number) => (
              <Badge key={index} className="text-xs bg-healz-red/10 text-healz-red border border-healz-red/30">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Portion guidelines */}
      {item.portion_guidelines && (
        <div>
          <h5 className="text-sm font-semibold text-healz-brown mb-2">Guías de Porciones</h5>
          <div className="bg-healz-cream/30 p-3 rounded-lg">
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.portion_guidelines}</p>
          </div>
        </div>
      )}

      {/* Meal examples */}
      {item.meal_examples && typeof item.meal_examples === 'object' && (
        <div>
          <h5 className="text-sm font-semibold text-healz-brown mb-2">Ejemplos de Comidas</h5>
          <div className="space-y-2">
            {Object.entries(item.meal_examples).map(([meal, example]) => (
              <div key={meal} className="bg-healz-cream/20 p-2 rounded border-l-2 border-healz-teal/40">
                <p className="text-sm">
                  <span className="font-medium text-healz-brown">{meal}:</span>
                  <span className="text-healz-brown/80 ml-2">{example as string}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special considerations */}
      {item.special_considerations && Array.isArray(item.special_considerations) && item.special_considerations.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-orange mb-2">Consideraciones Especiales</h5>
          <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-200/50">
            <ul className="space-y-1">
              {item.special_considerations.map((consideration: string, index: number) => (
                <li key={index} className="text-sm text-healz-brown/80 flex items-start gap-2">
                  <span className="text-healz-orange text-xs mt-1">•</span>
                  {consideration}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Preparation notes */}
      {item.preparation_notes && (
        <div>
          <h5 className="text-sm font-semibold text-healz-brown mb-2">Notas de Preparación</h5>
          <div className="bg-healz-cream/30 p-3 rounded-lg border border-healz-brown/10">
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.preparation_notes}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <EnhancedActionPlanCard
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      categoryIcon={Apple}
      categoryColor="text-healz-green"
      title={item.diet_type || 'Plan Alimentario'}
      previewContent={previewContent}
      expandedContent={expandedContent}
      timeframe={getTimeframe()}
      essentialTags={getEssentialTags()}
    />
  );
};