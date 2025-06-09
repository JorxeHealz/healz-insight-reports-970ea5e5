
import { useState } from 'react';
import { toast } from './use-toast';

export function useFormFileHandling() {
  const [files, setFiles] = useState<Record<string, File>>({});

  const handleFileChange = (questionId: string, file: File | null) => {
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten archivos PDF, JPEG y PNG",
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Archivo demasiado grande",
          description: "El archivo debe ser menor a 10MB",
          variant: "destructive"
        });
        return;
      }

      setFiles(prev => ({
        ...prev,
        [questionId]: file
      }));
    } else {
      // Remove file if null
      setFiles(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:mime/type;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const prepareFilesForSubmission = async (): Promise<Record<string, { name: string; type: string; size: number; data: string }>> => {
    const preparedFiles: Record<string, { name: string; type: string; size: number; data: string }> = {};
    
    for (const [questionId, file] of Object.entries(files)) {
      try {
        console.log(`Converting file to base64 for question ${questionId}:`, file.name);
        const base64Data = await convertFileToBase64(file);
        
        preparedFiles[questionId] = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        };
        
        console.log(`File converted successfully for question ${questionId}`);
      } catch (error) {
        console.error(`Error converting file for question ${questionId}:`, error);
        toast({
          title: "Error",
          description: `No se pudo procesar el archivo ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    return preparedFiles;
  };

  return {
    files,
    setFiles,
    handleFileChange,
    prepareFilesForSubmission
  };
}
