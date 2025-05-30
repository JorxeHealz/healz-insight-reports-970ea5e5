
import { useState } from 'react';
import { supabase } from '../lib/supabase';
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

  const uploadFile = async (file: File, formId: string, retries = 3): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${formId}/${fileName}`;

    console.log('Attempting to upload file:', { fileName, filePath, size: file.size, type: file.type });

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Check if bucket exists, create if it doesn't
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error('Error listing buckets:', listError);
        }
        
        const bucketExists = buckets?.find(bucket => bucket.id === 'patient-files');
        
        if (!bucketExists) {
          console.log('Creating patient-files bucket...');
          const { error: createError } = await supabase.storage.createBucket('patient-files', {
            public: false,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
          });
          
          if (createError) {
            console.error('Error creating bucket:', createError);
            // Continue anyway, bucket might exist but not be visible
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('patient-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Upload attempt ${attempt} failed:`, uploadError);
          
          if (uploadError.message?.includes('row-level security')) {
            throw new Error('Los permisos de almacenamiento no están configurados correctamente. Por favor, contacte al administrador del sistema.');
          }
          
          if (attempt === retries) {
            throw new Error(`Error al subir archivo después de ${retries} intentos: ${uploadError.message}`);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        // Get public URL (this might not work if bucket is private, but we'll store the path)
        const { data: { publicUrl } } = supabase.storage
          .from('patient-files')
          .getPublicUrl(filePath);

        console.log('File uploaded successfully:', { filePath, publicUrl });
        return publicUrl || filePath; // Return path if public URL is not available

      } catch (error) {
        console.error(`Upload attempt ${attempt} error:`, error);
        
        if (attempt === retries) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error('Error inesperado al subir archivo');
  };

  return {
    files,
    setFiles,
    handleFileChange,
    uploadFile
  };
}
