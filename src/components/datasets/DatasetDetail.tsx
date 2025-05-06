
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Download, Calendar, Database, Tag, TableProperties } from 'lucide-react';
import { toast } from 'sonner';
import { DatasetFieldsList } from './DatasetFieldsList';
import { DatasetData } from './DatasetData';

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

export function DatasetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCanEdit, setUserCanEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    
    const fetchDataset = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('health_datasets')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDataset(data);
        
        // Check if current user is the owner
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        
        setUserCanEdit(
          !!currentUserId && currentUserId === data.user_id
        );
      } catch (error: any) {
        console.error('Error fetching dataset:', error.message);
        toast.error('Failed to load dataset');
        navigate('/datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dataset) {
    return (
      <Card className="text-center p-6">
        <p className="text-gray-500 mb-4">Dataset not found or you don't have permission to view it.</p>
        <Button variant="outline" onClick={() => navigate('/datasets')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Datasets
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/datasets')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Datasets
        </Button>
        
        {userCanEdit && (
          <Button onClick={() => navigate(`/datasets/edit/${dataset.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Dataset
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{dataset.name}</CardTitle>
            <Badge variant={dataset.is_public ? "default" : "outline"}>
              {dataset.is_public ? 'Public' : 'Private'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {dataset.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Database className="h-4 w-4 mr-2" />
                    <span>Source: {dataset.source}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created: {formatDate(dataset.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Last Updated: {formatDate(dataset.updated_at)}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">Tags</span>
                  </div>
                  {dataset.tags && dataset.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {dataset.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No tags</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Metadata</h3>
                {Object.keys(dataset.metadata || {}).length > 0 ? (
                  <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
                    {JSON.stringify(dataset.metadata, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500">No additional metadata</p>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Metadata
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="fields">
              <DatasetFieldsList />
            </TabsContent>
            
            <TabsContent value="data">
              <DatasetData datasetId={dataset.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
