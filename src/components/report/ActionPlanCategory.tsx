
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { EditableActionItem } from './EditableActionItem';
import { AddActionForm } from './AddActionForm';

type ActionPlanCategoryProps = {
  category: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: any[];
    color: string;
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

  console.log(`🔍 [ActionPlanCategory] Rendering category "${category.id}":`, {
    categoryId: category.id,
    itemsCount: category.items.length,
    items: category.items,
    reportId,
    formId,
    isActivityOrTherapy: category.id === 'activity' || category.id === 'therapy'
  });

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
          onClick={() => {
            console.log(`🚀 [ActionPlanCategory] Adding form for category: ${category.id}`);
            setShowAddForm(category.id);
          }}
          className="h-8 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>
      
      <div className="space-y-2">
        {category.items.length > 0 ? (
          category.items.map((item: any) => (
            <EditableActionItem
              key={item.id}
              item={item}
              reportId={reportId}
              onDelete={onDeleteAction}
            />
          ))
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
            onCancel={() => {
              console.log(`❌ [ActionPlanCategory] Cancelling form for category: ${category.id}`);
              setShowAddForm(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
