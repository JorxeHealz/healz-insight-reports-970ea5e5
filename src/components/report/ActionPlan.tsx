
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

export const ActionPlan: React.FC<ActionPlanProps> = ({ report }) => {
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const { deleteActionPlan } = useActionPlans(report.id);
  
  // Usar los datos reales de report_action_plans en lugar del campo actionPlan vacío
  const actionPlans = report.actionPlans || [];
  
  // Agrupar los action plans por categoría
  const actionsByCategory = {
    foods: actionPlans.filter((plan: any) => plan.category === 'foods'),
    supplements: actionPlans.filter((plan: any) => plan.category === 'supplements'),
    lifestyle: actionPlans.filter((plan: any) => plan.category === 'lifestyle'),
    activity: actionPlans.filter((plan: any) => plan.category === 'activity'),
    therapy: actionPlans.filter((plan: any) => plan.category === 'therapy'),
    followup: actionPlans.filter((plan: any) => plan.category === 'followup')
  };

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
