
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, Plus, Upload, File, X } from 'lucide-react';

interface DatasetDataProps {
  datasetId?: string;
}

interface DataItem {
  id: string;
  dataset_id: string;
  data: any;
  created_at: string;
}

export function DatasetData({ datasetId }: DatasetDataProps) {
  const { id } = useParams();
  const effectiveId = datasetId || id;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataItem[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!effectiveId) return;
    
    const fetchDatasetInfo = async () => {
      try {
        const { data: datasetData, error: datasetError } = await supabase
          .from('health_datasets')
          .select('name')
          .eq('id', effectiveId)
          .single();

        if (datasetError) throw datasetError;
        setDatasetName(datasetData.name);
      } catch (error: any) {
        console.error('Error fetching dataset:', error.message);
      }
    };
    
    const fetchFields = async () => {
      try {
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('dataset_fields')
          .select('*')
          .eq('dataset_id', effectiveId)
          .order('created_at', { ascending: true });

        if (fieldsError) throw fieldsError;
        setFields(fieldsData || []);
      } catch (error: any) {
        console.error('Error fetching fields:', error.message);
      }
    };
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: dataItems, error } = await supabase
          .from('dataset_data')
          .select('*')
          .eq('dataset_id', effectiveId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(dataItems || []);
      } catch (error: any) {
        console.error('Error fetching dataset data:', error.message);
        toast.error('Failed to load dataset data');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetInfo();
    fetchFields();
    fetchData();
  }, [effectiveId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Only accept JSON files
    if (file.type !== 'application/json') {
      toast.error('Please upload a JSON file');
      return;
    }
    
    if (!fields || fields.length === 0) {
      toast.error('Please define fields for this dataset before uploading data');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const text = await file.text();
      let jsonData;
      
      try {
        jsonData = JSON.parse(text);
      } catch (e) {
        toast.error('Invalid JSON file');
        setIsUploading(false);
        return;
      }
      
      setUploadProgress(30);
      
      // If it's an array, we'll insert each item separately
      if (Array.isArray(jsonData)) {
        for (let i = 0; i < jsonData.length; i++) {
          const item = jsonData[i];
          
          // Update progress
          setUploadProgress(30 + Math.floor((i / jsonData.length) * 60));
          
          const { error } = await supabase
            .from('dataset_data')
            .insert([{
              dataset_id: effectiveId,
              data: item
            }]);
            
          if (error) {
            console.error('Error inserting data item:', error);
            toast.error(`Error uploading item ${i + 1}`);
          }
        }
        
        toast.success(`Uploaded ${jsonData.length} data items successfully`);
      } else {
        // It's a single object
        setUploadProgress(60);
        
        const { error } = await supabase
          .from('dataset_data')
          .insert([{
            dataset_id: effectiveId,
            data: jsonData
          }]);
          
        if (error) {
          throw error;
        }
        
        toast.success('Data uploaded successfully');
      }
      
      // Refresh the data
      const { data: dataItems, error } = await supabase
        .from('dataset_data')
        .select('*')
        .eq('dataset_id', effectiveId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(dataItems || []);
      
    } catch (error: any) {
      console.error('Error uploading data:', error);
      toast.error('Failed to upload data');
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dataset_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setData(data.filter(item => item.id !== id));
      toast.success('Data item deleted successfully');
    } catch (error: any) {
      console.error('Error deleting data item:', error.message);
      toast.error('Failed to delete data item');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Dataset Data</h2>
          <Skeleton className="h-9 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Data for {datasetName}</h2>
          <p className="text-sm text-gray-500">Manage data records for this dataset</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild className="gap-1">
            <label>
              <Upload className="h-4 w-4" />
              Upload JSON
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Record
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading data...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {data.length === 0 ? (
        <Card className="text-center p-6">
          <div className="py-8">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Data Records</h3>
            <p className="text-gray-500 mb-4">
              Upload JSON data or add individual records to populate this dataset
            </p>
            <Button asChild className="gap-1">
              <label>
                <Upload className="h-4 w-4 mr-1" />
                Upload JSON
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Showing {data.length} data records
          </div>
          
          {data.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">
                        Added: {formatDate(item.created_at)}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          ID: {item.id.split('-')[0]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm font-medium mb-1">Data Preview:</div>
                  <pre className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-xs overflow-auto max-h-32">
                    {JSON.stringify(item.data, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
