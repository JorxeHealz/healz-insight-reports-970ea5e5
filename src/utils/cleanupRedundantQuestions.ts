
import { supabase } from '../lib/supabase';

export const cleanupRedundantQuestions = async () => {
  try {
    console.log('Starting cleanup of redundant patient information questions...');
    
    // Remove questions that ask for information we already have from patient record
    const redundantPatterns = [
      '%nombre%completo%',
      '%email%',
      '%teléfono%',
      '%telefono%',
      '%correo%electrónico%',
      '%correo%'
    ];

    for (const pattern of redundantPatterns) {
      const { data: questionsToDelete, error: searchError } = await supabase
        .from('form_questions')
        .select('id, question_text')
        .ilike('question_text', pattern)
        .eq('category', 'general_info');

      if (searchError) {
        console.error('Error searching for redundant questions:', searchError);
        continue;
      }

      if (questionsToDelete && questionsToDelete.length > 0) {
        console.log('Found redundant questions:', questionsToDelete);
        
        const { error: deleteError } = await supabase
          .from('form_questions')
          .delete()
          .in('id', questionsToDelete.map(q => q.id));

        if (deleteError) {
          console.error('Error deleting redundant questions:', deleteError);
        } else {
          console.log(`Deleted ${questionsToDelete.length} redundant questions matching pattern: ${pattern}`);
        }
      }
    }

    console.log('Cleanup of redundant questions completed');
    return { success: true };

  } catch (error) {
    console.error('Error during cleanup:', error);
    return { success: false, error };
  }
};
