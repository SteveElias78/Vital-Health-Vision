
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit, Eye, Globe, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!userLoggedIn) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Please log in to manage your datasets</p>
        <Button variant="outline" asChild>
          <a href="/auth">Login / Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Health Datasets</h2>
        <Button asChild>
          <a href="/datasets/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Dataset
          </a>
        </Button>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-gray-500">You don't have any datasets yet</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/datasets/new">Create Your First Dataset</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <Card key={dataset.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg line-clamp-1">{dataset.name}</h3>
                    <Badge variant={dataset.is_public ? "default" : "outline"}>
                      {dataset.is_public ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                      {dataset.is_public ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {dataset.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dataset.tags && dataset.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(!dataset.tags || dataset.tags.length === 0) && (
                      <span className="text-xs text-gray-400">No tags</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Source: {dataset.source}
                  </div>
                </div>
                <div className="border-t p-2 bg-gray-50 flex justify-between">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`/datasets/${dataset.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`/datasets/edit/${dataset.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </a>
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => togglePublicStatus(dataset.id, dataset.is_public)}
                    >
                      {dataset.is_public ? 'Make Private' : 'Make Public'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteDataset(dataset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
