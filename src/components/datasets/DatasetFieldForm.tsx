
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

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

interface DatasetFieldFormProps {
  datasetId: string;
  field: DatasetField | null;
  onCancel: () => void;
  onSave: () => void;
}

export function DatasetFieldForm({ datasetId, field, onCancel, onSave }: DatasetFieldFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<DatasetField, 'id' | 'created_at'>>({
    dataset_id: datasetId,
    name: '',
    display_name: '',
    data_type: 'string',
    description: '',
    required: false,
    statistics: {}
  });
  const isEditMode = !!field;

  useEffect(() => {
    if (field) {
      setFormData({
        dataset_id: field.dataset_id,
        name: field.name,
        display_name: field.display_name,
        data_type: field.data_type,
        description: field.description || '',
        required: field.required,
        statistics: field.statistics
      });
    }
  }, [field]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, data_type: value }));
  };

  const handleRequiredToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, required: checked }));
  };

  const generateFieldName = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .substring(0, 50);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayName = e.target.value;
    setFormData(prev => ({
      ...prev,
      display_name: displayName,
      name: isEditMode ? prev.name : generateFieldName(displayName)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.name.trim() || !formData.display_name.trim() || !formData.data_type) {
        toast.error('Name, display name, and data type are required');
        setLoading(false);
        return;
      }

      if (isEditMode) {
        // Update existing field
        const { error } = await supabase
          .from('dataset_fields')
          .update({
            name: formData.name,
            display_name: formData.display_name,
            data_type: formData.data_type,
            description: formData.description || null,
            required: formData.required,
            statistics: formData.statistics
          })
          .eq('id', field!.id);

        if (error) throw error;
        toast.success('Field updated successfully');
      } else {
        // Create new field
        const { error } = await supabase
          .from('dataset_fields')
          .insert([{
            dataset_id: datasetId,
            name: formData.name,
            display_name: formData.display_name,
            data_type: formData.data_type,
            description: formData.description || null,
            required: formData.required,
            statistics: formData.statistics
          }]);

        if (error) throw error;
        toast.success('Field created successfully');
      }
      
      onSave();
    } catch (error: any) {
      console.error('Error saving field:', error.message);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} field`);
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
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <CardTitle>
            {isEditMode ? 'Edit Field' : 'Add New Field'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleDisplayNameChange}
              placeholder="e.g., Patient Age"
              required
            />
            <p className="text-xs text-gray-500">
              This is the human-readable name shown in the UI
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., patient_age"
              required
              readOnly={isEditMode}
              className={isEditMode ? "bg-gray-100" : ""}
            />
            <p className="text-xs text-gray-500">
              {isEditMode 
                ? "Field name cannot be changed after creation" 
                : "Technical name used in data processing (auto-generated)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_type">Data Type</Label>
            <Select 
              value={formData.data_type} 
              onValueChange={handleSelectChange}
              disabled={isEditMode}
            >
              <SelectTrigger id="data_type" className={isEditMode ? "bg-gray-100" : ""}>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="enum">Enumeration</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="object">Object</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {isEditMode 
                ? "Data type cannot be changed after creation" 
                : "The type of data this field will contain"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe this field"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={formData.required}
              onCheckedChange={handleRequiredToggle}
            />
            <Label htmlFor="required">This field is required</Label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : isEditMode ? 'Update Field' : 'Create Field'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
