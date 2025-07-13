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
  const {
    updateSummarySection
  } = useSummarySections(reportId);
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
  return <Card className={className}>
      
      
    </Card>;
};