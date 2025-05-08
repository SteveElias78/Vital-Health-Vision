import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useDemoMode } from './useDemoMode';
import { demoDashboardConfig } from '@/data/demo/demoData';

export interface DashboardConfig {
  name: string;
  description?: string;
  layout: any;
  is_public?: boolean;
}

export interface SavedDashboard {
  id: string;
  name: string;
  description: string | null;
  user_id: string | null;
  is_public: boolean;
  layout: {
    layouts: any;
    activeWidgets: string[];
    colorTheme: string;
    compactMode: boolean;
  };
  created_at: string;
  updated_at: string;
}

export function useUserDashboards() {
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();

  // Fetch all dashboards for current user
  const fetchDashboards = useCallback(async () => {
    if (isDemoMode) {
      // In demo mode, provide a sample dashboard
      setLoading(true);
      try {
        const demoDashboard: SavedDashboard = {
          id: 'demo-dashboard-1',
          name: 'Demo Health Overview Dashboard',
          description: 'This is a sample dashboard showing health data visualizations',
          user_id: 'demo-user',
          is_public: true,
          layout: demoDashboardConfig,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const demoPersonalDashboard: SavedDashboard = {
          id: 'demo-dashboard-2',
          name: 'My Personal Health Trends',
          description: 'Tracking personal health metrics over time',
          user_id: 'demo-user',
          is_public: false,
          layout: {
            ...demoDashboardConfig,
            colorTheme: 'purple-gold'
          },
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()  // 2 days ago
        };
        
        setDashboards([demoDashboard, demoPersonalDashboard]);
        setLoading(false);
        setError(null);
      } catch (error: any) {
        console.error('Error loading demo dashboards:', error);
        setError('Failed to load demo dashboards');
        setLoading(false);
      }
      return;
    }

    // Real mode - fetch from Supabase
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setDashboards([]);
        setLoading(false);
        return;
      }
      
      // Fetch user's dashboards and public dashboards
      const { data, error } = await supabase
        .from('user_dashboards')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      setDashboards(data as SavedDashboard[]);
    } catch (error: any) {
      console.error('Error fetching dashboards:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  // Load dashboards on initial render
  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  // Get a dashboard by ID
  const getDashboardById = useCallback(async (id: string): Promise<SavedDashboard | null> => {
    if (isDemoMode) {
      // In demo mode, return a demo dashboard
      if (id === 'demo-dashboard-1' || id === 'demo-dashboard-2') {
        const demoDashboard: SavedDashboard = {
          id,
          name: id === 'demo-dashboard-1' ? 'Demo Health Overview Dashboard' : 'My Personal Health Trends',
          description: id === 'demo-dashboard-1' 
            ? 'This is a sample dashboard showing health data visualizations'
            : 'Tracking personal health metrics over time',
          user_id: 'demo-user',
          is_public: id === 'demo-dashboard-1',
          layout: demoDashboardConfig,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return demoDashboard;
      }
      return null;
    }

    // Real mode - fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('user_dashboards')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data as SavedDashboard;
    } catch (error) {
      console.error('Error fetching dashboard by ID:', error);
      return null;
    }
  }, [isDemoMode]);

  // Save a dashboard
  const saveDashboard = useCallback(async (
    name: string, 
    layout: any, 
    description: string = '', 
    isPublic: boolean = false
  ): Promise<SavedDashboard | null> => {
    if (isDemoMode) {
      // In demo mode, simulate saving
      toast({
        title: 'Dashboard Saved (Demo)',
        description: 'This is a simulated save in demo mode. Your changes will not be persistent.',
      });
      
      // Return a fake saved dashboard
      const fakeDashboard: SavedDashboard = {
        id: `demo-${Date.now()}`,
        name,
        description,
        user_id: 'demo-user',
        is_public: isPublic,
        layout,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Update the local state with the new dashboard
      setDashboards(prev => [fakeDashboard, ...prev]);
      
      return fakeDashboard;
    }

    // Real mode - save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to save dashboards',
          variant: 'destructive',
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('user_dashboards')
        .insert([
          {
            name,
            description,
            user_id: user.id,
            is_public: isPublic,
            layout
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Dashboard Saved',
        description: 'Your dashboard has been saved successfully',
      });
      
      // Refresh the dashboards list
      fetchDashboards();
      
      return data as SavedDashboard;
    } catch (error: any) {
      console.error('Error saving dashboard:', error);
      toast({
        title: 'Error Saving Dashboard',
        description: error.message || 'An error occurred while saving your dashboard',
        variant: 'destructive',
      });
      return null;
    }
  }, [fetchDashboards, isDemoMode]);

  // Update a dashboard
  const updateDashboard = useCallback(async (
    id: string,
    updates: Partial<SavedDashboard>
  ): Promise<SavedDashboard | null> => {
    if (isDemoMode) {
      // In demo mode, simulate updating
      toast({
        title: 'Dashboard Updated (Demo)',
        description: 'This is a simulated update in demo mode. Your changes will not be persistent.',
      });
      
      // Update the dashboard in local state
      setDashboards(prev => prev.map(dash => 
        dash.id === id ? { ...dash, ...updates, updated_at: new Date().toISOString() } : dash
      ));
      
      const updatedDashboard = dashboards.find(dash => dash.id === id);
      return updatedDashboard ? { ...updatedDashboard, ...updates } as SavedDashboard : null;
    }

    // Real mode - update in Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to update dashboards',
          variant: 'destructive',
        });
        return null;
      }
      
      // First check if the user owns this dashboard
      const { data: dashboardCheck } = await supabase
        .from('user_dashboards')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (dashboardCheck && dashboardCheck.user_id !== user.id) {
        toast({
          title: 'Permission Denied',
          description: 'You can only update your own dashboards',
          variant: 'destructive',
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('user_dashboards')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Dashboard Updated',
        description: 'Your dashboard has been updated successfully',
      });
      
      // Refresh the dashboards list
      fetchDashboards();
      
      return data as SavedDashboard;
    } catch (error: any) {
      console.error('Error updating dashboard:', error);
      toast({
        title: 'Error Updating Dashboard',
        description: error.message || 'An error occurred while updating your dashboard',
        variant: 'destructive',
      });
      return null;
    }
  }, [dashboards, fetchDashboards, isDemoMode]);

  // Delete a dashboard
  const deleteDashboard = useCallback(async (id: string): Promise<boolean> => {
    if (isDemoMode) {
      // In demo mode, simulate deleting
      toast({
        title: 'Dashboard Deleted (Demo)',
        description: 'This is a simulated deletion in demo mode.',
      });
      
      // Remove the dashboard from local state
      setDashboards(prev => prev.filter(dash => dash.id !== id));
      
      return true;
    }

    // Real mode - delete from Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to delete dashboards',
          variant: 'destructive',
        });
        return false;
      }
      
      // First check if the user owns this dashboard
      const { data: dashboardCheck } = await supabase
        .from('user_dashboards')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (dashboardCheck && dashboardCheck.user_id !== user.id) {
        toast({
          title: 'Permission Denied',
          description: 'You can only delete your own dashboards',
          variant: 'destructive',
        });
        return false;
      }
      
      const { error } = await supabase
        .from('user_dashboards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Dashboard Deleted',
        description: 'Your dashboard has been deleted successfully',
      });
      
      // Refresh the dashboards list
      fetchDashboards();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting dashboard:', error);
      toast({
        title: 'Error Deleting Dashboard',
        description: error.message || 'An error occurred while deleting your dashboard',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchDashboards, isDemoMode]);

  // Generate public dashboards list
  const publicDashboards = dashboards.filter(d => d.is_public);

  return {
    dashboards,
    publicDashboards,
    loading,
    isLoading: loading,
    error,
    fetchDashboards,
    getDashboardById,
    saveDashboard,
    updateDashboard,
    deleteDashboard
  };
}
