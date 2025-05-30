
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../ui/use-toast';
import { cleanupRedundantQuestions } from '../../utils/cleanupRedundantQuestions';
import { supabase } from '../../lib/supabase';

export const CleanupUtility = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runCleanup = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Run the local cleanup function
      console.log('Running local cleanup function...');
      const localResult = await cleanupRedundantQuestions();
      
      if (localResult.success) {
        setResults(prev => [...prev, '✅ Local cleanup completed successfully']);
        console.log('Local cleanup completed successfully');
      } else {
        setResults(prev => [...prev, '❌ Local cleanup failed: ' + (localResult.error || 'Unknown error')]);
        console.error('Local cleanup failed:', localResult.error);
      }

      // Also run the edge function cleanup
      console.log('Running edge function cleanup...');
      const { data, error } = await supabase.functions.invoke('remove-redundant-questions');
      
      if (error) {
        setResults(prev => [...prev, '❌ Edge function cleanup failed: ' + error.message]);
        console.error('Edge function cleanup failed:', error);
      } else {
        setResults(prev => [...prev, '✅ Edge function cleanup completed successfully']);
        console.log('Edge function cleanup completed successfully:', data);
      }

      toast({
        title: "Cleanup completed",
        description: "Redundant questions have been removed from the database."
      });

    } catch (error) {
      console.error('Error during cleanup:', error);
      setResults(prev => [...prev, '❌ Cleanup error: ' + (error instanceof Error ? error.message : 'Unknown error')]);
      
      toast({
        title: "Cleanup failed",
        description: "An error occurred during the cleanup process.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Cleanup Utility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          This utility removes redundant questions from the form_questions table that ask for information 
          already available in the patient record (name, email, phone, etc.).
        </p>
        
        <Button 
          onClick={runCleanup}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Cleanup...' : 'Run Cleanup'}
        </Button>

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Cleanup Results:</h4>
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={index} className="text-sm font-mono">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
