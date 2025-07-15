import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Plus, X, Save } from "lucide-react";
import { useActionPlans, ActionPlanCategory, ActionPlanData } from "../../../hooks/useActionPlans";

// Common form data interface
interface ActionPlanFormData {
  priority: 'high' | 'medium' | 'low';
  // Common fields that most categories might have
  [key: string]: any;
}

interface ActionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ActionPlanCategory;
  reportId: string;
  formId: string;
  patientId: string;
  editingItem?: any | null;
  onSuccess?: () => void;
}

export const ActionPlanDialog: React.FC<ActionPlanDialogProps> = ({
  open,
  onOpenChange,
  category,
  reportId,
  formId,
  patientId,
  editingItem,
  onSuccess
}) => {
  const { createActionPlan, updateActionPlan } = useActionPlans(reportId);
  const isEditing = !!editingItem;
  
  // Initialize form data based on category
  const getInitialFormData = (): ActionPlanFormData => {
    if (isEditing) {
      return { ...editingItem };
    }

    const baseData = {
      priority: 'medium' as 'high' | 'medium' | 'low',
      report_id: reportId,
      form_id: formId,
      patient_id: patientId,
      active: true
    };

    switch (category) {
      case 'foods':
        return {
          ...baseData,
          dietary_pattern: '',
          main_goals: [],
          foods_to_include: [],
          foods_to_avoid: [],
          meal_examples: {},
          special_considerations: []
        };
      case 'supplements':
        return {
          ...baseData,
          supplement_name: '',
          dosage: '',
          frequency: '',
          timing: '',
          duration: '',
          brand_recommendations: [],
          contraindications: [],
          monitoring_notes: ''
        };
      case 'lifestyle':
        return {
          ...baseData,
          stress_management_techniques: [],
          sleep_target_hours: '',
          sleep_interventions: [],
          daily_routine_recommendations: [],
          environmental_factors: []
        };
      case 'activity':
        return {
          ...baseData,
          activity_type: '',
          frequency_per_week: 3,
          session_duration: '',
          intensity_level: '',
          specific_exercises: [],
          progression_plan: '',
          equipment_needed: [],
          restrictions: [],
          monitoring_signals: []
        };
      case 'therapy':
        return {
          ...baseData,
          therapy_type: '',
          protocol: '',
          frequency: '',
          duration: '',
          provider_type: '',
          monitoring_requirements: [],
          expected_outcomes: [],
          precautions: []
        };
      case 'followup':
        return {
          ...baseData,
          followup_type: '',
          timeline: '',
          specific_tests: [],
          success_metrics: [],
          provider_type: '',
          preparation_required: [],
          escalation_criteria: []
        };
      default:
        return baseData;
    }
  };

  const [formData, setFormData] = useState<ActionPlanFormData>(getInitialFormData);
  const [arrayInputs, setArrayInputs] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or editing item changes
  useEffect(() => {
    setFormData(getInitialFormData());
    setArrayInputs({});
  }, [open, editingItem, category]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: string) => {
    const inputValue = arrayInputs[field]?.trim();
    if (!inputValue) return;

    const currentArray = formData[field] || [];
    setFormData(prev => ({
      ...prev,
      [field]: [...currentArray, inputValue]
    }));
    setArrayInputs(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = formData[field] || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateActionPlan.mutateAsync({
          id: editingItem.id,
          category,
          ...formData
        });
      } else {
        await createActionPlan.mutateAsync({
          category,
          ...formData
        } as ActionPlanData & { category: ActionPlanCategory });
      }
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving action plan:', error);
    }
  };

  const renderArrayField = (field: string, label: string, placeholder: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={arrayInputs[field] || ''}
          onChange={(e) => setArrayInputs(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd(field))}
        />
        <Button type="button" size="sm" onClick={() => handleArrayAdd(field)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(formData[field] || []).map((item: string, index: number) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleArrayRemove(field, index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'foods':
        return (
          <>
            <div className="space-y-2">
              <Label>Patrón Dietético</Label>
              <Input
                value={formData.dietary_pattern || ''}
                onChange={(e) => handleInputChange('dietary_pattern', e.target.value)}
                placeholder="Ej: Dieta Mediterránea, Antiinflamatoria, etc."
              />
            </div>
            {renderArrayField('main_goals', 'Objetivos Principales', 'Agregar objetivo')}
            {renderArrayField('foods_to_include', 'Alimentos a Incluir', 'Agregar alimento')}
            {renderArrayField('foods_to_avoid', 'Alimentos a Evitar', 'Agregar alimento')}
            {renderArrayField('special_considerations', 'Consideraciones Especiales', 'Agregar consideración')}
          </>
        );

      case 'supplements':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del Suplemento *</Label>
                <Input
                  value={formData.supplement_name || ''}
                  onChange={(e) => handleInputChange('supplement_name', e.target.value)}
                  placeholder="Ej: Vitamina D3, Omega-3, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Dosificación *</Label>
                <Input
                  value={formData.dosage || ''}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="Ej: 2000 UI, 500mg, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Frecuencia *</Label>
                <Input
                  value={formData.frequency || ''}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  placeholder="Ej: Una vez al día, 2 veces/semana"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Momento de Toma</Label>
                <Input
                  value={formData.timing || ''}
                  onChange={(e) => handleInputChange('timing', e.target.value)}
                  placeholder="Ej: Con comida, en ayunas, etc."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duración del Tratamiento</Label>
              <Input
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ej: 3 meses, 6 semanas, indefinido"
              />
            </div>
            {renderArrayField('brand_recommendations', 'Marcas Recomendadas', 'Agregar marca')}
            {renderArrayField('contraindications', 'Contraindicaciones', 'Agregar contraindicación')}
            <div className="space-y-2">
              <Label>Notas de Monitoreo</Label>
              <Textarea
                value={formData.monitoring_notes || ''}
                onChange={(e) => handleInputChange('monitoring_notes', e.target.value)}
                placeholder="Observaciones especiales para el seguimiento"
                rows={3}
              />
            </div>
          </>
        );

      case 'lifestyle':
        return (
          <>
            <div className="space-y-2">
              <Label>Horas de Sueño Objetivo</Label>
              <Input
                value={formData.sleep_target_hours || ''}
                onChange={(e) => handleInputChange('sleep_target_hours', e.target.value)}
                placeholder="Ej: 7-8 horas"
              />
            </div>
            {renderArrayField('stress_management_techniques', 'Técnicas de Manejo de Estrés', 'Agregar técnica')}
            {renderArrayField('sleep_interventions', 'Intervenciones para el Sueño', 'Agregar intervención')}
            {renderArrayField('daily_routine_recommendations', 'Recomendaciones de Rutina Diaria', 'Agregar recomendación')}
            {renderArrayField('environmental_factors', 'Factores Ambientales', 'Agregar factor')}
          </>
        );

      case 'activity':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Actividad *</Label>
                <Input
                  value={formData.activity_type || ''}
                  onChange={(e) => handleInputChange('activity_type', e.target.value)}
                  placeholder="Ej: Entrenamiento de fuerza, Cardio, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Frecuencia por Semana</Label>
                <Select 
                  value={formData.frequency_per_week?.toString() || '3'} 
                  onValueChange={(value) => handleInputChange('frequency_per_week', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} vez{num !== 1 ? 'es' : ''} por semana</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duración de Sesión</Label>
                <Input
                  value={formData.session_duration || ''}
                  onChange={(e) => handleInputChange('session_duration', e.target.value)}
                  placeholder="Ej: 45-60 min"
                />
              </div>
              <div className="space-y-2">
                <Label>Nivel de Intensidad</Label>
                <Select 
                  value={formData.intensity_level || ''} 
                  onValueChange={(value) => handleInputChange('intensity_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar intensidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="moderate">Moderada</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Plan de Progresión</Label>
              <Textarea
                value={formData.progression_plan || ''}
                onChange={(e) => handleInputChange('progression_plan', e.target.value)}
                placeholder="Cómo avanzar en el programa de ejercicios"
                rows={3}
              />
            </div>
            {renderArrayField('specific_exercises', 'Ejercicios Específicos', 'Agregar ejercicio')}
            {renderArrayField('equipment_needed', 'Equipamiento Necesario', 'Agregar equipo')}
            {renderArrayField('restrictions', 'Restricciones', 'Agregar restricción')}
            {renderArrayField('monitoring_signals', 'Señales de Monitoreo', 'Agregar señal')}
          </>
        );

      case 'therapy':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Terapia *</Label>
                <Input
                  value={formData.therapy_type || ''}
                  onChange={(e) => handleInputChange('therapy_type', e.target.value)}
                  placeholder="Ej: Terapia hormonal, IV, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Proveedor</Label>
                <Input
                  value={formData.provider_type || ''}
                  onChange={(e) => handleInputChange('provider_type', e.target.value)}
                  placeholder="Ej: Endocrinólogo, Nutricionista"
                />
              </div>
              <div className="space-y-2">
                <Label>Frecuencia</Label>
                <Input
                  value={formData.frequency || ''}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  placeholder="Ej: Semanal, mensual"
                />
              </div>
              <div className="space-y-2">
                <Label>Duración Total</Label>
                <Input
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ej: 3 meses, 6 sesiones"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Protocolo</Label>
              <Textarea
                value={formData.protocol || ''}
                onChange={(e) => handleInputChange('protocol', e.target.value)}
                placeholder="Descripción del protocolo de tratamiento"
                rows={3}
              />
            </div>
            {renderArrayField('monitoring_requirements', 'Requerimientos de Monitoreo', 'Agregar requerimiento')}
            {renderArrayField('expected_outcomes', 'Resultados Esperados', 'Agregar resultado')}
            {renderArrayField('precautions', 'Precauciones', 'Agregar precaución')}
          </>
        );

      case 'followup':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Seguimiento *</Label>
                <Input
                  value={formData.followup_type || ''}
                  onChange={(e) => handleInputChange('followup_type', e.target.value)}
                  placeholder="Ej: Analítica de control, Cita médica"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cronograma *</Label>
                <Input
                  value={formData.timeline || ''}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="Ej: 6 semanas, 3 meses"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Proveedor</Label>
                <Input
                  value={formData.provider_type || ''}
                  onChange={(e) => handleInputChange('provider_type', e.target.value)}
                  placeholder="Ej: Médico de familia, Especialista"
                />
              </div>
            </div>
            {renderArrayField('specific_tests', 'Pruebas Específicas', 'Agregar prueba')}
            {renderArrayField('success_metrics', 'Métricas de Éxito', 'Agregar métrica')}
            {renderArrayField('preparation_required', 'Preparación Requerida', 'Agregar preparación')}
            {renderArrayField('escalation_criteria', 'Criterios de Escalación', 'Agregar criterio')}
          </>
        );

      default:
        return null;
    }
  };

  const getCategoryTitle = () => {
    const titles = {
      foods: 'Alimentación',
      supplements: 'Suplemento',
      lifestyle: 'Estilo de Vida',
      activity: 'Actividad Física',
      therapy: 'Terapia',
      followup: 'Seguimiento'
    };
    return titles[category];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar' : 'Agregar'} {getCategoryTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Priority Field - Common to all categories */}
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: 'high' | 'medium' | 'low') => handleInputChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta Prioridad</SelectItem>
                <SelectItem value="medium">Media Prioridad</SelectItem>
                <SelectItem value="low">Baja Prioridad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category-specific fields */}
          {renderCategorySpecificFields()}

          {/* Submit buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createActionPlan.isPending || updateActionPlan.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {createActionPlan.isPending || updateActionPlan.isPending 
                ? 'Guardando...' 
                : isEditing ? 'Actualizar' : 'Crear'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 