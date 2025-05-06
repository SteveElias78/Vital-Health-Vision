
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AnalysisResult {
  id?: string;
  analysis_type: string;
  parameters: any;
  results: any;
  created_at?: string;
  dataset_id?: string | null;
}

export function useAnalysisResults() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all analysis results for the current user
  const { data: analysisResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['analysis-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching analysis results:', error);
        toast({
          title: 'Error fetching analysis results',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data as AnalysisResult[];
    },
  });

  // Save a new analysis result
  const saveResultMutation = useMutation({
    mutationFn: async (result: AnalysisResult) => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('analysis_results')
          .insert([result])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-results'] });
      toast({
        title: 'Analysis saved',
        description: 'Your analysis result has been saved successfully',
      });
    },
    onError: (error: any) => {
      console.error('Error saving analysis result:', error);
      toast({
        title: 'Error saving analysis',
        description: error.message || 'Failed to save analysis result',
        variant: 'destructive',
      });
    },
  });

  // Delete an analysis result
  const deleteResultMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);
      
      try {
        const { error } = await supabase
          .from('analysis_results')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return true;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-results'] });
      toast({
        title: 'Analysis deleted',
        description: 'The analysis has been deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting analysis result:', error);
      toast({
        title: 'Error deleting analysis',
        description: error.message || 'Failed to delete analysis result',
        variant: 'destructive',
      });
    },
  });

  return {
    analysisResults,
    isLoading: isLoading || isLoadingResults,
    saveResult: (result: AnalysisResult) => saveResultMutation.mutate(result),
    deleteResult: (id: string) => deleteResultMutation.mutate(id),
  };
}
