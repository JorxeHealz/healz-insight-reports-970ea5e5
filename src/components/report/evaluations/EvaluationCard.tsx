
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Pencil, Save, X, Trash2, Star } from 'lucide-react';
import { Evaluation, CriticalityLevel } from './types';

type EvaluationCardProps = {
  evaluation: Evaluation;
  onUpdate: (data: {
    id: string;
    title: string;
    content: string;
    evaluation_score?: number;
    recommendations?: any;
    criticality_level: CriticalityLevel;
  }) => void;
  onDelete: (id: string) => void;
};

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(evaluation.title);
  const [content, setContent] = useState(evaluation.content);
  const [score, setScore] = useState(evaluation.evaluation_score || 5);
  const [criticality, setCriticality] = useState(evaluation.criticality_level);

  const handleSave = () => {
    onUpdate({
      id: evaluation.id,
      title,
      content,
      evaluation_score: score,
      criticality_level: criticality,
      recommendations: evaluation.recommendations
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(evaluation.title);
    setContent(evaluation.content);
    setScore(evaluation.evaluation_score || 5);
    setCriticality(evaluation.criticality_level);
    setIsEditing(false);
  };

  const getCriticalityColor = (level: CriticalityLevel) => {
    switch (level) {
      case 'critical': return 'bg-healz-red/20 text-healz-red';
      case 'high': return 'bg-healz-orange/20 text-healz-orange';
      case 'medium': return 'bg-healz-yellow/20 text-healz-orange';
      case 'low': return 'bg-healz-green/20 text-healz-green';
      default: return 'bg-healz-cream/20 text-healz-brown';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return 'Evaluación General';
      case 'panel': return 'Panel';
      case 'biomarker': return 'Biomarcador';
      default: return 'Evaluación';
    }
  };

  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm font-medium"
              />
            ) : (
              <CardTitle className="text-sm">{evaluation.title}</CardTitle>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(evaluation.evaluation_type)}
              </Badge>
              {evaluation.target_id && (
                <Badge variant="outline" className="text-xs bg-healz-blue/10">
                  {evaluation.target_id}
                </Badge>
              )}
              <Badge className={`text-xs ${getCriticalityColor(evaluation.criticality_level)}`}>
                {evaluation.criticality_level}
              </Badge>
              {evaluation.is_auto_generated && (
                <Badge variant="outline" className="text-xs">
                  Auto-generado
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 p-0"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(evaluation.id)}
                  className="h-6 w-6 p-0 text-healz-red hover:text-healz-red"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="h-6 w-6 p-0 text-healz-green"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium">Puntuación (1-10)</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    className="text-sm"
                  />
                  <div className="flex">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < score ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Criticidad</label>
                <Select value={criticality} onValueChange={(value: CriticalityLevel) => setCriticality(value)}>
                  <SelectTrigger className="text-sm mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-healz-brown/80 leading-relaxed whitespace-pre-wrap">
              {evaluation.content}
            </p>
            {evaluation.evaluation_score && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Puntuación:</span>
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < evaluation.evaluation_score! ? 'fill-healz-yellow text-healz-yellow' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-xs ml-1">{evaluation.evaluation_score}/10</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
