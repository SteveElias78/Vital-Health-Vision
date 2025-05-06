
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout, Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';

export interface DashboardConfig {
  name: string;
  description?: string;
  layout: {
    layouts: Layouts;
    activeWidgets: string[];
    colorTheme: string;
    compactMode: boolean;
  };
  is_public?: boolean;
}

export interface SavedDashboard extends DashboardConfig {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useUserDashboards() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch user dashboards
  const { data: dashboards, isLoading: isLoadingDashboards } = useQuery({
    queryKey: ['user-dashboards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_dashboards')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching dashboards:', error);
        toast({
          title: 'Error fetching dashboards',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data as SavedDashboard[];
    },
  });

  // Fetch public dashboards
  const { data: publicDashboards, isLoading: isLoadingPublic } = useQuery({
    queryKey: ['public-dashboards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_dashboards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching public dashboards:', error);
        return [];
      }
      
      return data as SavedDashboard[];
    },
  });

  // Save dashboard
  const saveDashboardMutation = useMutation({
    mutationFn: async (dashboard: DashboardConfig) => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_dashboards')
          .insert([dashboard])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboards'] });
      toast({
        title: 'Dashboard saved',
        description: 'Your dashboard layout has been saved successfully',
      });
    },
    onError: (error: any) => {
      console.error('Error saving dashboard:', error);
      toast({
        title: 'Error saving dashboard',
        description: error.message || 'Failed to save dashboard',
        variant: 'destructive',
      });
    },
  });

  // Update dashboard
  const updateDashboardMutation = useMutation({
    mutationFn: async ({ id, dashboard }: { id: string; dashboard: Partial<DashboardConfig> }) => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_dashboards')
          .update({ ...dashboard, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboards'] });
      toast({
        title: 'Dashboard updated',
        description: 'Your dashboard has been updated successfully',
      });
    },
    onError: (error: any) => {
      console.error('Error updating dashboard:', error);
      toast({
        title: 'Error updating dashboard',
        description: error.message || 'Failed to update dashboard',
        variant: 'destructive',
      });
    },
  });

  // Delete dashboard
  const deleteDashboardMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);
      
      try {
        const { error } = await supabase
          .from('user_dashboards')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return true;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboards'] });
      toast({
        title: 'Dashboard deleted',
        description: 'The dashboard has been deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting dashboard:', error);
      toast({
        title: 'Error deleting dashboard',
        description: error.message || 'Failed to delete dashboard',
        variant: 'destructive',
      });
    },
  });

  // Load dashboard by ID
  const getDashboardById = async (id: string): Promise<SavedDashboard | null> => {
    const { data, error } = await supabase
      .from('user_dashboards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching dashboard:', error);
      toast({
        title: 'Error loading dashboard',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    
    return data as SavedDashboard;
  };

  return {
    dashboards,
    publicDashboards,
    isLoading: isLoading || isLoadingDashboards || isLoadingPublic,
    saveDashboard: (dashboard: DashboardConfig) => saveDashboardMutation.mutate(dashboard),
    updateDashboard: (id: string, dashboard: Partial<DashboardConfig>) => 
      updateDashboardMutation.mutate({ id, dashboard }),
    deleteDashboard: (id: string) => deleteDashboardMutation.mutate(id),
    getDashboardById
  };
}
