
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { EditableActionItem } from './EditableActionItem';
import { AddActionForm } from './AddActionForm';
import { FoodActionPlanCard } from './action-plans/FoodActionPlanCard';
import { SupplementActionPlanCard } from './action-plans/SupplementActionPlanCard';
import { ActivityActionPlanCard } from './action-plans/ActivityActionPlanCard';
import { LifestyleActionPlanCard } from './action-plans/LifestyleActionPlanCard';
import { TherapyActionPlanCard } from './action-plans/TherapyActionPlanCard';
import { FollowupActionPlanCard } from './action-plans/FollowupActionPlanCard';

type ActionPlanCategoryProps = {
  category: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: any[];
    color: string;
    supportsDosage?: boolean;
  };
  reportId: string;
  formId: string;
  showAddForm: string | null;
  setShowAddForm: (categoryId: string | null) => void;
  onDeleteAction: (id: string) => void;
};

export const ActionPlanCategory: React.FC<ActionPlanCategoryProps> = ({
  category,
  reportId,
  formId,
  showAddForm,
  setShowAddForm,
  onDeleteAction
}) => {
  const Icon = category.icon;

  // Function to sort items by priority (high -> medium -> low)
  const sortedItems = [...category.items].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 4;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 4;
    return aPriority - bPriority;
  });

  // Group items by priority for better visual organization
  const groupedItems = {
    high: sortedItems.filter(item => item.priority === 'high'),
    medium: sortedItems.filter(item => item.priority === 'medium'),
    low: sortedItems.filter(item => item.priority === 'low' || !item.priority)
  };

  // Function to render the appropriate specialized component
  const renderSpecializedCard = (item: any) => {
    const handleEdit = () => {
      // For now, we'll keep the existing edit functionality
      // This could be expanded later with specialized edit forms
      console.log('Edit action:', item.id);
    };

    switch (category.id) {
      case 'foods':
        return (
          <FoodActionPlanCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={onDeleteAction}
          />
        );
      case 'supplements':
        return (
          <SupplementActionPlanCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={onDeleteAction}
          />
        );
      case 'activity':
        return (
          <ActivityActionPlanCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={onDeleteAction}
          />
        );
      case 'lifestyle':
        return (
          <LifestyleActionPlanCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={onDeleteAction}
          />
        );
      case 'therapy':
        return (
          <TherapyActionPlanCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={onDeleteAction}
          />
        );
      case 'followup':
        return (
          <FollowupActionPlanCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={onDeleteAction}
          />
        );
      default:
        // Fallback to the original EditableActionItem for unknown categories
        return (
          <EditableActionItem
            key={item.id}
            item={item}
            reportId={reportId}
            supportsDosage={category.supportsDosage}
            onDelete={onDeleteAction}
          />
        );
    }
  };

  const getPriorityGroupTitle = (priority: string) => {
    switch (priority) {
      case 'high': return 'Prioridad Alta';
      case 'medium': return 'Prioridad Media'; 
      case 'low': return 'Prioridad Baja';
      default: return 'Otras Recomendaciones';
    }
  };

  const getPriorityGroupIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '✅';
      default: return '📋';
    }
  };

  const getTotalCount = () => {
    return groupedItems.high.length + groupedItems.medium.length + groupedItems.low.length;
  };

  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-3 border-b border-healz-brown/10">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${category.color} shadow-sm`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-healz-brown">{category.title}</h3>
            <p className="text-sm text-healz-brown/60">
              {getTotalCount() > 0 ? `${getTotalCount()} recomendaciones` : 'Sin recomendaciones'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(category.id)}
          className="h-10 px-4 border-healz-brown/20 hover:bg-healz-cream/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
      
      <div className="space-y-5">
        {/* High Priority Items */}
        {groupedItems.high.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{getPriorityGroupIcon('high')}</span>
              <h4 className="font-semibold text-base text-healz-brown">
                {getPriorityGroupTitle('high')}
              </h4>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                {groupedItems.high.length}
              </span>
            </div>
            <div className="space-y-3">
              {groupedItems.high.map((item: any) => renderSpecializedCard(item))}
            </div>
          </div>
        )}

        {/* Medium Priority Items */}
        {groupedItems.medium.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{getPriorityGroupIcon('medium')}</span>
              <h4 className="font-semibold text-base text-healz-brown">
                {getPriorityGroupTitle('medium')}
              </h4>
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                {groupedItems.medium.length}
              </span>
            </div>
            <div className="space-y-3">
              {groupedItems.medium.map((item: any) => renderSpecializedCard(item))}
            </div>
          </div>
        )}

        {/* Low Priority Items */}
        {groupedItems.low.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{getPriorityGroupIcon('low')}</span>
              <h4 className="font-semibold text-base text-healz-brown">
                {getPriorityGroupTitle('low')}
              </h4>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {groupedItems.low.length}
              </span>
            </div>
            <div className="space-y-3">
              {groupedItems.low.map((item: any) => renderSpecializedCard(item))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {getTotalCount() === 0 && (
          <div className="text-center py-8 bg-healz-cream/20 rounded-lg border border-healz-brown/10">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-healz-brown/60 mb-4">
              No hay recomendaciones específicas en esta categoría
            </p>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(category.id)}
              className="border-healz-brown/20 hover:bg-healz-cream/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar primera recomendación
            </Button>
          </div>
        )}
        
        {/* Add Form */}
        {showAddForm === category.id && (
          <div className="mt-4">
            <AddActionForm
              category={category.id}
              reportId={reportId}
              formId={formId}
              supportsDosage={category.supportsDosage}
              onCancel={() => setShowAddForm(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
