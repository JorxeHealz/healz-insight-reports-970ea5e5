
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { EditableActionItem } from './EditableActionItem';
import { AddActionForm } from './AddActionForm';
import { FoodActionPlanCard } from './action-plans/FoodActionPlanCard';
import { SupplementActionPlanCard } from './action-plans/SupplementActionPlanCard';
import { ActivityActionPlanCard } from './action-plans/ActivityActionPlanCard';
import { LifestyleActionPlanCard } from './action-plans/LifestyleActionPlanCard';
import { TherapyActionPlanCard } from './action-plans/TherapyActionPlanCard';
import { FollowupActionPlanCard } from './action-plans/FollowupActionPlanCard';
import { ActionPlanDialog } from './action-plans/ActionPlanDialogs';
import { useActionPlans, ActionPlanCategory as ActionPlanCategoryType } from '../../hooks/useActionPlans';

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
  patientId: string;
  showAddForm: string | null;
  setShowAddForm: (categoryId: string | null) => void;
  onDeleteAction: (id: string) => void;
};

export const ActionPlanCategory: React.FC<ActionPlanCategoryProps> = ({ 
  category, 
  reportId, 
  formId,
  patientId,
  showAddForm, 
  setShowAddForm, 
  onDeleteAction 
}) => {
  const Icon = category.icon;
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  
  const { deleteActionPlan } = useActionPlans(reportId);

  // Sort items by priority
  const sortedItems = category.items.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aScore = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
    const bScore = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
    return bScore - aScore;
  });

  // Group items by priority for fallback display
  const itemsByPriority = {
    high: sortedItems.filter(item => item.priority === 'high'),
    medium: sortedItems.filter(item => item.priority === 'medium'),
    low: sortedItems.filter(item => item.priority === 'low' || !item.priority)
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActionPlan.mutateAsync({ 
        id, 
        category: category.id as ActionPlanCategoryType 
      });
    } catch (error) {
      console.error('Error deleting action plan:', error);
    }
    setDeletingItemId(null);
  };

  const handleDialogSuccess = () => {
    setShowDialog(false);
    setEditingItem(null);
  };

  // Function to render the appropriate specialized component
  const renderSpecializedCard = () => {
    // Pass the full array to specialized cards as they expect
    const commonProps = {
      onEdit: handleEdit,
      onDelete: (id: string) => setDeletingItemId(id),
      onAdd: handleAdd,
      isEditable: true
    };

    switch (category.id) {
      case 'foods':
        return (
          <FoodActionPlanCard
            foodPlans={sortedItems}
            {...commonProps}
          />
        );
      case 'supplements':
        return (
          <SupplementActionPlanCard
            supplements={sortedItems}
            {...commonProps}
          />
        );
      case 'activity':
        return (
          <ActivityActionPlanCard
            activities={sortedItems}
            {...commonProps}
          />
        );
      case 'lifestyle':
        return (
          <LifestyleActionPlanCard
            lifestylePlans={sortedItems}
            {...commonProps}
          />
        );
      case 'therapy':
        return (
          <TherapyActionPlanCard
            therapyPlans={sortedItems}
            {...commonProps}
          />
        );
      case 'followup':
        return (
          <FollowupActionPlanCard
            followupPlans={sortedItems}
            {...commonProps}
          />
        );
      default:
        // Fallback to the original implementation for unknown categories
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-healz-blue">{category.title}</h3>
                  <p className="text-sm text-gray-500">
                    {category.items.length} acción{category.items.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAdd}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>

            {category.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay acciones en esta categoría</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAdd}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar primera acción
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {['high', 'medium', 'low'].map(priority => (
                  itemsByPriority[priority as keyof typeof itemsByPriority].length > 0 && (
                    <div key={priority} className="space-y-2">
                      <h4 className="text-sm font-medium text-healz-brown capitalize">
                        Prioridad {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                      </h4>
                      {itemsByPriority[priority as keyof typeof itemsByPriority].map((item) => (
                        <EditableActionItem
                          key={item.id}
                          item={item}
                          reportId={reportId}
                          supportsDosage={category.supportsDosage}
                          onDelete={(id) => setDeletingItemId(id)}
                        />
                      ))}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Add Form */}
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
        );
    }
  };

  return (
    <>
      {renderSpecializedCard()}
      
      {/* Action Plan Dialog */}
      <ActionPlanDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        category={category.id as ActionPlanCategoryType}
        reportId={reportId}
        formId={formId}
        patientId={patientId}
        editingItem={editingItem}
        onSuccess={handleDialogSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deletingItemId} 
        onOpenChange={(open) => !open && setDeletingItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta recomendación del plan de acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingItemId && handleDelete(deletingItemId)}
              className="bg-healz-red hover:bg-healz-red/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
