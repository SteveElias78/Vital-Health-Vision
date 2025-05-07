
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { DatasetCard } from './DatasetCard';
import { FormDivider } from '../decorative/FormDivider';

interface Dataset {
  id: string;
  name: string;
  description: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  metadata: any;
  tags: string[];
  is_public: boolean;
  user_id: string | null;
}

export function DatasetsList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserLoggedIn(!!data.session);
    };

    checkUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch datasets
  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('health_datasets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setDatasets(data || []);
      } catch (error: any) {
        console.error('Error fetching datasets:', error.message);
        toast.error('Failed to load datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [userLoggedIn]);

  const handleDeleteDataset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setDatasets(datasets.filter(dataset => dataset.id !== id));
      toast.success('Dataset deleted successfully');
    } catch (error: any) {
      console.error('Error deleting dataset:', error.message);
      toast.error('Failed to delete dataset');
      throw error;
    }
  };

  const togglePublicStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('health_datasets')
        .update({ is_public: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setDatasets(datasets.map(dataset => 
        dataset.id === id ? {...dataset, is_public: !currentStatus} : dataset
      ));
      
      toast.success(`Dataset is now ${!currentStatus ? 'public' : 'private'}`);
    } catch (error: any) {
      console.error('Error updating dataset visibility:', error.message);
      toast.error('Failed to update dataset visibility');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="art-deco-card p-5">
            <Skeleton className="h-6 w-1/3 mb-2 bg-gold-500/10" />
            <Skeleton className="h-4 w-1/2 mb-4 bg-gold-500/5" />
            <div className="flex space-x-2 mb-4">
              <Skeleton className="h-6 w-16 bg-gold-500/10" />
              <Skeleton className="h-6 w-16 bg-gold-500/10" />
            </div>
            <Skeleton className="h-10 w-full mt-4 bg-gold-500/10" />
          </div>
        ))}
      </div>
    );
  }

  if (!userLoggedIn) {
    return (
      <div className="p-8 text-center art-deco-card">
        <p className="text-gold-300/80 mb-4">Please log in to manage your datasets</p>
        <Button variant="outline" asChild>
          <a href="/auth">Login / Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light tracking-wider text-gold-400">Your Health Datasets</h2>
        <Button asChild>
          <a href="/datasets/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Dataset
          </a>
        </Button>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-10 art-deco-card border-dashed">
          <p className="text-gold-300/80 mb-4">You don't have any datasets yet</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/datasets/new">Create Your First Dataset</a>
          </Button>
        </div>
      ) : (
        <>
          <FormDivider pattern="diamonds" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                id={dataset.id}
                name={dataset.name}
                description={dataset.description}
                source={dataset.source}
                tags={dataset.tags || []}
                isPublic={dataset.is_public}
                onDelete={handleDeleteDataset}
                onTogglePublic={togglePublicStatus}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
