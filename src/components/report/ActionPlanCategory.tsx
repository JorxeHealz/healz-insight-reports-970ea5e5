
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${category.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-healz-brown">{category.title}</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(category.id)}
          className="h-8 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>
      
      <div className="space-y-3">
        {category.items.length > 0 ? (
          category.items.map((item: any) => renderSpecializedCard(item))
        ) : (
          <p className="text-sm text-healz-brown/60 italic">
            No hay recomendaciones específicas en esta categoría
          </p>
        )}
        
        {showAddForm === category.id && (
          <AddActionForm
            category={category.id}
            reportId={reportId}
            formId={formId}
            supportsDosage={category.supportsDosage}
            onCancel={() => setShowAddForm(null)}
          />
        )}
      </div>
    </div>
  );
};
