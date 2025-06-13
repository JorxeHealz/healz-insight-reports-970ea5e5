
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Apple, Pill, Activity, Dumbbell, Heart, Calendar, MessageSquare, Star, Plus } from 'lucide-react';
import { EditableActionItem } from './EditableActionItem';
import { AddActionForm } from './AddActionForm';
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
        <CardHeader>
          <CardTitle className="text-lg">Tu Plan de Acción Personalizado</CardTitle>
          <p className="text-sm text-healz-brown/70">
            Basado en tus biomarcadores y perfil de salud actual
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="space-y-3">
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
                  
                  <div className="space-y-2">
                    {category.items.length > 0 ? (
                      category.items.map((item: any) => (
                        <EditableActionItem
                          key={item.id}
                          item={item}
                          reportId={report.id}
                          onDelete={handleDeleteAction}
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
                        reportId={report.id}
                        formId={report.patient?.id || ''}
                        onCancel={() => setShowAddForm(null)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sección de Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            ¿Cómo lo estamos haciendo?
          </CardTitle>
          <p className="text-sm text-healz-brown/70">
            Tu feedback nos ayuda a mejorar tu plan de salud
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calificación con estrellas */}
          <div>
            <label className="text-sm font-medium text-healz-brown mb-2 block">
              Califica tu experiencia general:
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="p-1 hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-healz-yellow hover:text-healz-orange transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Campo de comentarios */}
          <div>
            <label className="text-sm font-medium text-healz-brown mb-2 block">
              Comparte tu experiencia (opcional):
            </label>
            <Textarea 
              placeholder="¿Cómo te sientes con las recomendaciones? ¿Hay algo que te gustaría cambiar o mejorar?"
              className="resize-none"
              rows={4}
            />
          </div>

          {/* Estado del plan actual */}
          <div className="bg-healz-cream/30 p-4 rounded-lg border border-healz-brown/10">
            <h4 className="font-medium text-healz-brown mb-2">Estado de tu plan:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <p className="font-medium text-healz-green">85%</p>
                <p className="text-healz-brown/70">Adherencia</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-healz-orange">3</p>
                <p className="text-healz-brown/70">Semanas activo</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-healz-teal">12</p>
                <p className="text-healz-brown/70">Mejoras detectadas</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-healz-brown">2</p>
                <p className="text-healz-brown/70">Próximos análisis</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Programar consulta
            </Button>
            <Button className="flex-1">
              Enviar feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
