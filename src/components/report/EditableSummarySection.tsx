
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Pencil, Save, X } from 'lucide-react';
import { useSummarySections } from '../../hooks/useSummarySections';

type EditableSummarySectionProps = {
  reportId: string;
  formId: string;
  sectionType: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
  className?: string;
};

export const EditableSummarySection: React.FC<EditableSummarySectionProps> = ({
  reportId,
  formId,
  sectionType,
  title,
  content,
  icon,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const { updateSummarySection } = useSummarySections(reportId);

  const handleSave = async () => {
    try {
      await updateSummarySection.mutateAsync({
        sectionType,
        title,
        content: editContent,
        formId
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating summary section:', error);
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateSummarySection.isPending}
              >
                <Save className="h-3 w-3 mr-1" />
                {updateSummarySection.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-healz-brown/80 leading-relaxed whitespace-pre-wrap">
            {content || 'Haz clic en el ícono de editar para agregar contenido personalizado.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
