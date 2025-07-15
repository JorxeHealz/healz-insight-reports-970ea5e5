import React from 'react';
import { Badge } from '../../ui/badge';
import { Dumbbell, Zap, Target, AlertTriangle, Clock } from 'lucide-react';
import { EnhancedActionPlanCard } from './EnhancedActionPlanCard';

type ActivityActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const ActivityActionPlanCard: React.FC<ActivityActionPlanCardProps> = ({ item, onEdit, onDelete }) => {
  
  // Extract essential information for preview
  const getEssentialTags = () => {
    const tags = [];
    if (item.frequency_per_week) tags.push(`${item.frequency_per_week}/semana`);
    if (item.session_duration) tags.push(item.session_duration);
    if (item.intensity_level) tags.push(`Intensidad ${item.intensity_level}`);
    if (item.specific_exercises?.length > 0) tags.push(`${item.specific_exercises.length} ejercicios`);
    return tags.slice(0, 3);
  };

  const getTimeframe = () => {
    if (item.phase1_duration) return item.phase1_duration;
    if (item.immediate_start) return "Iniciar esta semana";
    return "Programa estructurado";
  };

  // Preview content - most important information always visible
  const previewContent = (
    <div className="space-y-3">
      {/* Current capacity assessment */}
      {item.current_capacity && (
        <div className="bg-healz-teal/10 p-3 rounded-lg border border-healz-teal/20">
          <h5 className="text-sm font-semibold text-healz-teal mb-1 flex items-center gap-2">
            📊 Evaluación Actual
          </h5>
          <p className="text-sm text-healz-brown/90">{item.current_capacity}</p>
        </div>
      )}

      {/* Phase 1 focus */}
      {item.phase1_focus && (
        <div className="bg-healz-green/10 p-3 rounded-lg border-l-4 border-healz-green">
          <h5 className="text-sm font-semibold text-healz-green mb-1 flex items-center gap-2">
            🎯 Fase Inicial
          </h5>
          <p className="text-sm text-healz-brown/90">{item.phase1_focus}</p>
        </div>
      )}

      {/* Essential program info */}
      <div className="bg-healz-cream/40 p-3 rounded-lg border border-healz-brown/10">
        <h5 className="text-sm font-semibold text-healz-brown mb-2">Programa Base</h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-healz-brown/70 text-xs">Frecuencia:</span>
            <span className="text-healz-brown font-semibold text-base">{item.frequency_per_week || 'No especificado'}/semana</span>
          </div>
          {item.session_duration && (
            <div className="flex flex-col">
              <span className="font-medium text-healz-brown/70 text-xs">Duración:</span>
              <span className="text-healz-brown text-base font-medium">{item.session_duration}</span>
            </div>
          )}
        </div>
        
        {item.intensity_level && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-healz-cream">
            <Zap className="h-4 w-4 text-healz-orange" />
            <span className="text-sm text-healz-brown/90">
              <span className="font-medium">Intensidad:</span> {item.intensity_level}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Expanded content - detailed information
  const expandedContent = (
    <div className="space-y-4">
      {/* Specific exercises */}
      {item.specific_exercises && Array.isArray(item.specific_exercises) && item.specific_exercises.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-teal mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ejercicios Específicos
          </h5>
          <div className="flex flex-wrap gap-2">
            {item.specific_exercises.map((exercise: string, index: number) => (
              <Badge key={index} className="text-xs bg-healz-teal/10 text-healz-teal border border-healz-teal/30">
                {exercise}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Equipment needed */}
      {item.equipment_needed && Array.isArray(item.equipment_needed) && item.equipment_needed.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-brown mb-2">Equipamiento Necesario</h5>
          <div className="flex flex-wrap gap-2">
            {item.equipment_needed.map((equipment: string, index: number) => (
              <Badge key={index} className="text-xs bg-healz-brown/10 text-healz-brown border border-healz-brown/30">
                {equipment}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Progression plan */}
      {item.progression_plan && (
        <div>
          <h5 className="text-sm font-semibold text-healz-blue mb-2">Plan de Progresión</h5>
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200/50">
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.progression_plan}</p>
          </div>
        </div>
      )}

      {/* Rest periods */}
      {item.rest_periods && (
        <div>
          <h5 className="text-sm font-semibold text-healz-brown mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Períodos de Descanso
          </h5>
          <div className="bg-healz-cream/30 p-3 rounded-lg">
            <p className="text-sm text-healz-brown/80 leading-relaxed">{item.rest_periods}</p>
          </div>
        </div>
      )}

      {/* Monitoring signals */}
      {item.monitoring_signals && Array.isArray(item.monitoring_signals) && item.monitoring_signals.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-blue mb-2">Señales de Monitoreo</h5>
          <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-200/30">
            <ul className="space-y-1">
              {item.monitoring_signals.map((signal: string, index: number) => (
                <li key={index} className="text-sm text-healz-brown/80 flex items-start gap-2">
                  <span className="text-healz-blue text-xs mt-1">•</span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Restrictions */}
      {item.restrictions && Array.isArray(item.restrictions) && item.restrictions.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-healz-red mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Restricciones Importantes
          </h5>
          <div className="bg-red-50/50 p-3 rounded-lg border border-red-200/50">
            <ul className="space-y-1">
              {item.restrictions.map((restriction: string, index: number) => (
                <li key={index} className="text-sm text-healz-red/90 flex items-start gap-2">
                  <span className="text-healz-red text-xs mt-1">⚠️</span>
                  {restriction}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Phase details */}
      {(item.phase1_duration || item.phase1_focus) && (
        <div>
          <h5 className="text-sm font-semibold text-healz-green mb-2">Detalles de Fase Inicial</h5>
          <div className="bg-healz-green/5 p-3 rounded-lg border border-healz-green/20">
            {item.phase1_duration && (
              <p className="text-sm text-healz-brown/80 mb-1">
                <span className="font-medium">Duración:</span> {item.phase1_duration}
              </p>
            )}
            {item.phase1_focus && (
              <p className="text-sm text-healz-brown/80">
                <span className="font-medium">Enfoque:</span> {item.phase1_focus}
              </p>
            )}
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
      categoryIcon={Dumbbell}
      categoryColor="text-healz-teal"
      title={item.activity_type || 'Plan de Actividad'}
      previewContent={previewContent}
      expandedContent={expandedContent}
      timeframe={getTimeframe()}
      essentialTags={getEssentialTags()}
    />
  );
};