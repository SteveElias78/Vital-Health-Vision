
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { HealthDataset, Insertable, Updatable } from '@/lib/database.types';

export function useDatasets() {
  const queryClient = useQueryClient();

  const fetchDatasets = async (): Promise<HealthDataset[]> => {
    const { data, error } = await supabase
      .from('health_datasets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  };

  const createDataset = async (dataset: Insertable<'health_datasets'>): Promise<HealthDataset> => {
    const { data, error } = await supabase
      .from('health_datasets')
      .insert(dataset)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const updateDataset = async ({ id, ...updates }: Updatable<'health_datasets'> & { id: string }): Promise<HealthDataset> => {
    const { data, error } = await supabase
      .from('health_datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const deleteDataset = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('health_datasets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  };

  const datasetsQuery = useQuery({
    queryKey: ['datasets'],
    queryFn: fetchDatasets
  });

  const createMutation = useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    }
  });

  return {
    datasets: datasetsQuery.data || [],
    isLoading: datasetsQuery.isLoading,
    error: datasetsQuery.error,
    createDataset: createMutation.mutate,
    updateDataset: updateMutation.mutate,
    deleteDataset: deleteMutation.mutate
  };
}
