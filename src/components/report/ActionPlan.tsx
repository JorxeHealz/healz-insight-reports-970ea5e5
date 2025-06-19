
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Apple, Pill, Activity, Dumbbell, Heart, Calendar } from 'lucide-react';
import { ActionPlanHeader } from './ActionPlanHeader';
import { ActionPlanCategory } from './ActionPlanCategory';
import { ActionPlanFeedback } from './ActionPlanFeedback';
import { useActionPlans } from '../../hooks/useActionPlans';

type ActionPlanProps = {
  report: any;
};

// Function to sort actions by priority (high -> medium -> low)
const sortActionsByPriority = (actions: any[]) => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return actions.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 4;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 4;
    return aPriority - bPriority;
  });
};

export const ActionPlan: React.FC<ActionPlanProps> = ({ report }) => {
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const { deleteActionPlan } = useActionPlans(report.id);
  
  // Usar los datos reales de report_action_plans en lugar del campo actionPlan vacío
  const actionPlans = report.actionPlans || [];
  
  console.log('🔍 [ActionPlan] Report data:', {
    reportId: report.id,
    actionPlansCount: actionPlans.length,
    actionPlans: actionPlans,
    allCategories: actionPlans.map((plan: any) => plan.category)
  });
  
  // Agrupar los action plans por categoría y ordenar por prioridad
  const actionsByCategory = {
    foods: sortActionsByPriority(actionPlans.filter((plan: any) => plan.category === 'foods')),
    supplements: sortActionsByPriority(actionPlans.filter((plan: any) => plan.category === 'supplements')),
    lifestyle: sortActionsByPriority(actionPlans.filter((plan: any) => plan.category === 'lifestyle')),
    activity: sortActionsByPriority(actionPlans.filter((plan: any) => plan.category === 'activity')),
    therapy: sortActionsByPriority(actionPlans.filter((plan: any) => plan.category === 'therapy')),
    followup: sortActionsByPriority(actionPlans.filter((plan: any) => plan.category === 'followup'))
  };

  console.log('🔍 [ActionPlan] Actions by category:', {
    foods: actionsByCategory.foods.length,
    supplements: actionsByCategory.supplements.length,
    lifestyle: actionsByCategory.lifestyle.length,
    activity: actionsByCategory.activity.length,
    therapy: actionsByCategory.therapy.length,
    followup: actionsByCategory.followup.length,
    activityItems: actionsByCategory.activity,
    therapyItems: actionsByCategory.therapy
  });

  const actionCategories = [
    {
      id: 'foods',
      title: 'Alimentación',
      icon: Apple,
      items: actionsByCategory.foods,
      color: 'bg-healz-green/20 text-healz-green'
    },
    {
      id: 'supplements',
      title: 'Suplementos',
      icon: Pill,
      items: actionsByCategory.supplements,
      color: 'bg-healz-orange/20 text-healz-orange'
    },
    {
      id: 'lifestyle',
      title: 'Estilo de Vida',
      icon: Heart,
      items: actionsByCategory.lifestyle,
      color: 'bg-healz-blue/20 text-healz-teal'
    },
    {
      id: 'activity',
      title: 'Actividad',
      icon: Dumbbell,
      items: actionsByCategory.activity,
      color: 'bg-healz-teal/20 text-healz-teal'
    },
    {
      id: 'therapy',
      title: 'Terapia',
      icon: Activity,
      items: actionsByCategory.therapy,
      color: 'bg-healz-red/20 text-healz-red'
    },
    {
      id: 'followup',
      title: 'Seguimiento',
      icon: Calendar,
      items: actionsByCategory.followup,
      color: 'bg-healz-yellow/20 text-healz-orange'
    }
  ];

  const handleDeleteAction = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta acción?')) {
      try {
        await deleteActionPlan.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting action plan:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan de Acción Principal */}
      <Card>
        <ActionPlanHeader />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCategories.map((category) => (
              <ActionPlanCategory
                key={category.id}
                category={category}
                reportId={report.id}
                formId={report.form_id}
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
                onDeleteAction={handleDeleteAction}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sección de Feedback */}
      <ActionPlanFeedback />
    </div>
  );
};
