
import { useEffect, useState } from 'react';
import { cleanupRedundantQuestions } from '../utils/cleanupRedundantQuestions';
import { supabase } from '../lib/supabase';

export const useCleanupRunner = () => {
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const runCleanup = async () => {
    if (hasRun || isRunning) return;
    
    setIsRunning(true);
    console.log('Auto-running cleanup of redundant questions...');
    
    try {
      // Run local cleanup
      const localResult = await cleanupRedundantQuestions();
      console.log('Local cleanup result:', localResult);

      // Run edge function cleanup
      const { data, error } = await supabase.functions.invoke('remove-redundant-questions');
      
      if (error) {
        console.error('Edge function cleanup error:', error);
      } else {
        console.log('Edge function cleanup success:', data);
      }

      setHasRun(true);
      console.log('Cleanup completed successfully');
      
    } catch (error) {
      console.error('Error during auto-cleanup:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Run cleanup on first load
    const timer = setTimeout(() => {
      runCleanup();
    }, 1000); // Small delay to ensure everything is loaded

    return () => clearTimeout(timer);
  }, []);

  return { runCleanup, hasRun, isRunning };
};
