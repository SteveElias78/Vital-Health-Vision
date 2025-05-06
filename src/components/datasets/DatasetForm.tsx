
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

interface Dataset {
  id?: string;
  name: string;
  description: string;
  source: string;
  metadata: any;
  tags: string[];
  is_public: boolean;
}

export function DatasetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState<Dataset>({
    name: '',
    description: '',
    source: '',
    metadata: {},
    tags: [],
    is_public: false
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchDataset(id);
    }
  }, [id]);

  const fetchDataset = async (datasetId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_datasets')
        .select('*')
        .eq('id', datasetId)
        .single();

      if (error) throw error;
      
      setDataset(data);
    } catch (error: any) {
      console.error('Error fetching dataset:', error.message);
      toast.error('Failed to load dataset');
      navigate('/datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDataset(prev => ({ ...prev, [name]: value }));
  };

  const handlePublicToggle = (checked: boolean) => {
    setDataset(prev => ({ ...prev, is_public: checked }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!dataset.tags.includes(tagInput.trim())) {
        setDataset(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setDataset(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        // Update existing dataset
        const { error } = await supabase
          .from('health_datasets')
          .update({
            name: dataset.name,
            description: dataset.description,
            source: dataset.source,
            metadata: dataset.metadata,
            tags: dataset.tags,
            is_public: dataset.is_public,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
        toast.success('Dataset updated successfully');
      } else {
        // Create new dataset
        const { error } = await supabase
          .from('health_datasets')
          .insert([{
            name: dataset.name,
            description: dataset.description,
            source: dataset.source,
            metadata: dataset.metadata,
            tags: dataset.tags,
            is_public: dataset.is_public
          }]);

        if (error) throw error;
        toast.success('Dataset created successfully');
      }
      
      navigate('/datasets');
    } catch (error: any) {
      console.error('Error saving dataset:', error.message);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} dataset`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate('/datasets')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <CardTitle>
            {isEditMode ? 'Edit Dataset' : 'Create New Dataset'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Dataset Name</Label>
            <Input
              id="name"
              name="name"
              value={dataset.name}
              onChange={handleChange}
              placeholder="Enter dataset name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={dataset.description}
              onChange={handleChange}
              placeholder="Describe this dataset"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              value={dataset.source}
              onChange={handleChange}
              placeholder="e.g., CDC, WHO, NHS"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {dataset.tags.map((tag, index) => (
                <div key={index} className="bg-gray-100 px-2 py-1 rounded-md flex items-center text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Input
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to add a tag
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={dataset.is_public}
              onCheckedChange={handlePublicToggle}
            />
            <Label htmlFor="is_public">Make this dataset public</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : isEditMode ? 'Update Dataset' : 'Create Dataset'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
