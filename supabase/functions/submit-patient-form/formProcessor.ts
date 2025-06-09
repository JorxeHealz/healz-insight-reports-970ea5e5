
import { AnswerRecord, UploadedFile } from "./types.ts";

export function mapQuestionTypeToAnswerType(questionType: string): string {
  switch (questionType) {
    case 'radio':
    case 'select':
    case 'frequency':
      return 'text';
    case 'checkbox_multiple':
      return 'text';
    case 'number':
    case 'scale':
      return 'number';
    case 'textarea':
      return 'textarea';
    case 'file':
      return 'file';
    case 'boolean':
      return 'boolean';
    case 'text':
    default:
      return 'text';
  }
}

export function prepareAnswersForInsertion(
  answers: Record<string, any>,
  questions: any[],
  form: any
): AnswerRecord[] {
  return Object.entries(answers).map(([questionId, answer]) => {
    const question = questions.find(q => q.id === questionId);
    const answerType = question ? mapQuestionTypeToAnswerType(question.question_type) : 'text';
    
    // Convert arrays to string for checkbox_multiple
    let processedAnswer = answer;
    if (Array.isArray(answer)) {
      processedAnswer = answer.join(', ');
    }
    
    return {
      form_id: form.id,
      patient_id: form.patient_id,
      question_id: questionId,
      answer: typeof processedAnswer === 'string' ? processedAnswer : JSON.stringify(processedAnswer),
      answer_type: answerType,
      date: new Date().toISOString()
    };
  });
}

export async function saveFileRecords(
  supabaseClient: any,
  uploadedFiles: UploadedFile[],
  form: any
): Promise<void> {
  if (uploadedFiles.length === 0) return;

  console.log('Saving file records:', uploadedFiles.length);
  const filesToInsert = uploadedFiles.map((file: UploadedFile) => ({
    form_id: form.id,
    patient_id: form.patient_id,
    file_name: file.name,
    file_url: file.url,
    file_type: file.type,
    file_size: file.size || 0
  }));

  const { error: filesError } = await supabaseClient
    .from('form_files')
    .insert(filesToInsert);

  if (filesError) {
    console.error('Error inserting files:', filesError);
    // No fallar por errores de archivos, pero loggear
  } else {
    console.log('Files saved successfully');
  }
}
