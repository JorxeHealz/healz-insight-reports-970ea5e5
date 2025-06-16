
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { EvaluationCard } from './EvaluationCard';
import { CreateEvaluationDialog } from './CreateEvaluationDialog';
import { useEvaluations } from '../../../hooks/useEvaluations';
import { Evaluation, PanelInfo } from './types';
import { FileText, Package, Activity } from 'lucide-react';

type EvaluationsManagerProps = {
  reportId: string;
  formId: string;
  availablePanels?: PanelInfo[];
  availableBiomarkers?: { id: string; name: string }[];
};

export const EvaluationsManager: React.FC<EvaluationsManagerProps> = ({
  reportId,
  formId,
  availablePanels = [],
  availableBiomarkers = []
}) => {
  const {
    evaluations,
    isLoading,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
  } = useEvaluations(reportId, formId);

  const groupedEvaluations = evaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.evaluation_type]) {
      acc[evaluation.evaluation_type] = [];
    }
    acc[evaluation.evaluation_type].push(evaluation);
    return acc;
  }, {} as Record<string, Evaluation[]>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general': return <FileText className="h-4 w-4" />;
      case 'panel': return <Package className="h-4 w-4" />;
      case 'biomarker': return <Activity className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'general': return 'Evaluaciones Generales';
      case 'panel': return 'Evaluaciones por Panel';
      case 'biomarker': return 'Evaluaciones por Biomarcador';
      default: return 'Evaluaciones';
    }
  };

  if (isLoading) {
    return <div>Cargando evaluaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-healz-brown">Evaluaciones del Informe</h3>
          <p className="text-sm text-healz-brown/70">
            Evaluaciones personalizadas del estado del paciente por categoría
          </p>
        </div>
        <CreateEvaluationDialog
          reportId={reportId}
          onCreateEvaluation={createEvaluation.mutate}
          availablePanels={availablePanels}
          availableBiomarkers={availableBiomarkers}
          disabled={createEvaluation.isPending}
        />
      </div>

      {evaluations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-healz-brown/30 mb-4" />
            <h3 className="text-lg font-medium text-healz-brown mb-2">
              No hay evaluaciones aún
            </h3>
            <p className="text-healz-brown/70 mb-4">
              Comienza creando una evaluación general del estado del paciente
            </p>
            <CreateEvaluationDialog
              reportId={reportId}
              onCreateEvaluation={createEvaluation.mutate}
              availablePanels={availablePanels}
              availableBiomarkers={availableBiomarkers}
              disabled={createEvaluation.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {['general', 'panel', 'biomarker'].map((type) => {
            const typeEvaluations = groupedEvaluations[type] || [];
            if (typeEvaluations.length === 0) return null;

            return (
              <Card key={type}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {getTypeIcon(type)}
                      {getTypeTitle(type)}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {typeEvaluations.length} evaluación{typeEvaluations.length !== 1 ? 'es' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {typeEvaluations.map((evaluation) => (
                    <EvaluationCard
                      key={evaluation.id}
                      evaluation={evaluation}
                      onUpdate={updateEvaluation.mutate}
                      onDelete={deleteEvaluation.mutate}
                    />
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
