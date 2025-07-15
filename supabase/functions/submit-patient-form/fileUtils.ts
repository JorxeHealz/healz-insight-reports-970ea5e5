
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FileData, UploadedFile } from "./types.ts";

export async function processFiles(
  supabaseClient: any,
  files_data: Record<string, FileData>,
  formId: string
): Promise<UploadedFile[]> {
  const uploadedFiles: UploadedFile[] = [];

  if (!files_data || Object.keys(files_data).length === 0) {
    return uploadedFiles;
  }

  console.log('Processing files:', Object.keys(files_data).length);
  
  for (const [questionId, fileData] of Object.entries(files_data)) {
    try {
      console.log(`Uploading file for question ${questionId}:`, fileData.name);
      
      // Generate unique filename
      const fileExt = fileData.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${formId}/${fileName}`;
      
      // Convert base64 to Uint8Array
      const fileBuffer = Uint8Array.from(atob(fileData.data), c => c.charCodeAt(0));
      
      // Upload file to storage
      const { error: uploadError } = await supabaseClient.storage
        .from('patient-files')
        .upload(filePath, fileBuffer, {
          contentType: fileData.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error(`Upload error for question ${questionId}:`, uploadError);
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('patient-files')
        .getPublicUrl(filePath);

      // Save file info
      uploadedFiles.push({
        name: fileData.name,
        url: publicUrl,
        type: fileData.type,
        size: fileData.size
      });
      
      console.log(`File uploaded successfully for question ${questionId}: ${publicUrl}`);
      
    } catch (error) {
      console.error(`Error processing file for question ${questionId}:`, error);
      // Continue with form submission but log the error
    }
  }

  return uploadedFiles;
}

export function updateAnswersWithFiles(
  answers: Record<string, any>,
  files_data: Record<string, FileData>,
  uploadedFiles: UploadedFile[]
): Record<string, any> {
  const updatedAnswers = { ...answers };
  
  // Create a map of file data to uploaded files by order
  const fileQuestions = Object.keys(files_data);
  
  fileQuestions.forEach((questionId, index) => {
    if (uploadedFiles[index]) {
      updatedAnswers[questionId] = uploadedFiles[index].url;
    } else {
      updatedAnswers[questionId] = `Error al subir: ${files_data[questionId].name}`;
    }
  });

  return updatedAnswers;
}
