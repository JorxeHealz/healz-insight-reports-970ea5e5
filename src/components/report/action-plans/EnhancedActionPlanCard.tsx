import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

type EnhancedActionPlanCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
  categoryIcon: React.ComponentType<{ className?: string }>;
  categoryColor: string;
  title: string;
  previewContent: React.ReactNode;
  expandedContent: React.ReactNode;
  timeframe?: string;
  essentialTags?: string[];
};

export const EnhancedActionPlanCard: React.FC<EnhancedActionPlanCardProps> = ({
  item,
  onEdit,
  onDelete,
  categoryIcon: CategoryIcon,
  categoryColor,
  title,
  previewContent,
  expandedContent,
  timeframe,
  essentialTags = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityDesign = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-l-4 border-red-500',
          background: 'bg-red-50/70',
          badge: 'bg-red-100 text-red-700 px-3 py-1 font-semibold text-sm border border-red-200',
          icon: '🔥',
          shadow: 'shadow-red-100',
          glow: 'ring-1 ring-red-200'
        };
      case 'medium':
        return {
          border: 'border-l-4 border-orange-400',
          background: 'bg-orange-50/70',
          badge: 'bg-orange-100 text-orange-700 px-3 py-1 font-semibold text-sm border border-orange-200',
          icon: '⚡',
          shadow: 'shadow-orange-100',
          glow: 'ring-1 ring-orange-200'
        };
      default:
        return {
          border: 'border-l-4 border-green-400',
          background: 'bg-green-50/70',
          badge: 'bg-green-100 text-green-700 px-3 py-1 font-semibold text-sm border border-green-200',
          icon: '✅',
          shadow: 'shadow-green-100',
          glow: 'ring-1 ring-green-200'
        };
    }
  };

  const priorityDesign = getPriorityDesign(item.priority || 'low');

  const getPriorityText = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'Prioridad Alta';
      case 'medium': return 'Prioridad Media';
      default: return 'Prioridad Baja';
    }
  };

  return (
    <Card className={`
      ${priorityDesign.border} 
      ${priorityDesign.background} 
      ${priorityDesign.shadow}
      ${priorityDesign.glow}
      hover:shadow-lg 
      transition-all 
      duration-200 
      border-healz-brown/10
      bg-white/90
      backdrop-blur-sm
    `}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-2xl" role="img" aria-label="Priority indicator">
                {priorityDesign.icon}
              </div>
              <CategoryIcon className={`h-5 w-5 ${categoryColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base text-healz-brown leading-tight">
                {title}
              </h4>
              {timeframe && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-healz-brown/60" />
                  <p className="text-sm text-healz-brown/70 font-medium">{timeframe}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={priorityDesign.badge}>
              {getPriorityText(item.priority || 'low')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Preview Content - Siempre visible */}
        <div className="mb-4">
          {previewContent}
          
          {/* Essential Tags */}
          {essentialTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {essentialTags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-healz-cream/50 text-healz-brown border-healz-brown/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-3">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 border-healz-brown/20 hover:bg-healz-cream/30"
              >
                <span className="text-sm font-medium">
                  {isExpanded ? 'Ocultar detalles' : 'Ver detalles completos'}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-9 w-9 p-0 hover:bg-healz-brown/10"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-9 w-9 p-0 text-healz-red hover:text-healz-red hover:bg-red-50"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="mt-4 space-y-4 border-t border-healz-brown/10 pt-4">
            {expandedContent}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}; 