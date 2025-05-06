
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Trash2, Edit, Database } from 'lucide-react';
import { toast } from 'sonner';
import { DatasetFieldForm } from './DatasetFieldForm';

interface DatasetField {
  id: string;
  dataset_id: string;
  name: string;
  display_name: string;
  data_type: string;
  description: string | null;
  required: boolean;
  statistics: any;
  created_at: string;
}

export function DatasetFieldsList() {
  const { id: datasetId } = useParams<{ id: string }>();
  const [fields, setFields] = useState<DatasetField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<DatasetField | null>(null);
  const [datasetName, setDatasetName] = useState<string>('');

  useEffect(() => {
    if (!datasetId) return;
    
    const fetchDatasetInfo = async () => {
      try {
        const { data: datasetData, error: datasetError } = await supabase
          .from('health_datasets')
          .select('name')
          .eq('id', datasetId)
          .single();

        if (datasetError) throw datasetError;
        setDatasetName(datasetData.name);
      } catch (error: any) {
        console.error('Error fetching dataset:', error.message);
      }
    };
    
    const fetchFields = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dataset_fields')
          .select('*')
          .eq('dataset_id', datasetId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setFields(data || []);
      } catch (error: any) {
        console.error('Error fetching fields:', error.message);
        toast.error('Failed to load dataset fields');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetInfo();
    fetchFields();
  }, [datasetId]);

  const handleDeleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dataset_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setFields(fields.filter(field => field.id !== id));
      toast.success('Field deleted successfully');
    } catch (error: any) {
      console.error('Error deleting field:', error.message);
      toast.error('Failed to delete field');
    }
  };

  const handleFieldSaved = () => {
    setIsAddingField(false);
    setEditingField(null);
    
    // Refetch the fields
    if (datasetId) {
      setLoading(true);
      supabase
        .from('dataset_fields')
        .select('*')
        .eq('dataset_id', datasetId)
        .order('created_at', { ascending: true })
        .then(({ data, error }) => {
          setLoading(false);
          if (error) {
            console.error('Error refetching fields:', error.message);
            toast.error('Failed to refresh dataset fields');
            return;
          }
          setFields(data || []);
        });
    }
  };

  if (loading && fields.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Dataset Fields</h2>
          <Skeleton className="h-9 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isAddingField || editingField) {
    return (
      <DatasetFieldForm 
        datasetId={datasetId!} 
        field={editingField}
        onCancel={() => {
          setIsAddingField(false);
          setEditingField(null);
        }}
        onSave={handleFieldSaved}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Fields for {datasetName}</h2>
          <p className="text-sm text-gray-500">Define the structure of your dataset</p>
        </div>
        <Button onClick={() => setIsAddingField(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="text-center p-6">
          <div className="py-8">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Fields Defined</h3>
            <p className="text-gray-500 mb-4">
              Define fields to structure your dataset and enable advanced analytics
            </p>
            <Button onClick={() => setIsAddingField(true)}>
              Add Your First Field
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <Card key={field.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg">{field.display_name}</h3>
                      {field.required && (
                        <Badge variant="outline" className="text-red-500 border-red-200">
                          Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {field.name}
                      </span>
                      <Badge variant="secondary">
                        {field.data_type}
                      </Badge>
                    </div>
                    {field.description && (
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {field.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteField(field.id)}
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
