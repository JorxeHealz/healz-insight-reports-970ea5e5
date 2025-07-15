
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
  
  // Usar los datos reales de report_action_plans organizados por categoría
  const actionPlans = report.actionPlans || {};
  
  // Los action plans ya vienen agrupados por categoría, solo ordenar por prioridad
  const actionsByCategory = {
    foods: sortActionsByPriority(actionPlans.foods || []),
    supplements: sortActionsByPriority(actionPlans.supplements || []),
    lifestyle: sortActionsByPriority(actionPlans.lifestyle || []),
    activity: sortActionsByPriority(actionPlans.activity || []),
    therapy: sortActionsByPriority(actionPlans.therapy || []),
    followup: sortActionsByPriority(actionPlans.followup || [])
  };

  const actionCategories = [
    {
      id: 'foods',
      title: 'Alimentación',
      icon: Apple,
      items: actionsByCategory.foods,
      color: 'bg-healz-green/20 text-healz-green',
      supportsDosage: true
    },
    {
      id: 'supplements',
      title: 'Suplementos',
      icon: Pill,
      items: actionsByCategory.supplements,
      color: 'bg-healz-orange/20 text-healz-orange',
      supportsDosage: true
    },
    {
      id: 'lifestyle',
      title: 'Estilo de Vida',
      icon: Heart,
      items: actionsByCategory.lifestyle,
      color: 'bg-healz-blue/20 text-healz-teal',
      supportsDosage: false
    },
    {
      id: 'activity',
      title: 'Actividad',
      icon: Dumbbell,
      items: actionsByCategory.activity,
      color: 'bg-healz-teal/20 text-healz-teal',
      supportsDosage: false
    },
    {
      id: 'therapy',
      title: 'Terapia',
      icon: Activity,
      items: actionsByCategory.therapy,
      color: 'bg-healz-red/20 text-healz-red',
      supportsDosage: false
    },
    {
      id: 'followup',
      title: 'Seguimiento',
      icon: Calendar,
      items: actionsByCategory.followup,
      color: 'bg-healz-yellow/20 text-healz-orange',
      supportsDosage: false
    }
  ];

  const handleDeleteAction = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta acción?')) {
      try {
        await deleteActionPlan.mutateAsync({ id, category: 'foods' as any });
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
                patientId={report.patient?.id || report.patient_id}
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
