
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormDivider } from '@/components/decorative/FormDivider';
import { Label } from '@/components/ui/label';

export interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  category: string;
  agreeToTerms: boolean;
  notifications: string;
}

interface ArtDecoFormProps {
  onSubmit: (data: FormData) => void;
  className?: string;
}

export function ArtDecoForm({ onSubmit, className = '' }: ArtDecoFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    category: '',
    agreeToTerms: false,
    notifications: 'all'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="art-deco-form-group">
        <Label htmlFor="name" className="art-deco-form-label">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
      </div>
      
      <div className="art-deco-form-group">
        <Label htmlFor="email" className="art-deco-form-label">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />
      </div>
      
      <div className="art-deco-form-group">
        <Label htmlFor="password" className="art-deco-form-label">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>

      <FormDivider label="Account Details" />
      
      <div className="art-deco-form-group">
        <Label htmlFor="role" className="art-deco-form-label">Role</Label>
        <Select 
          onValueChange={(value) => handleSelectChange('role', value)}
          value={formData.role}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="art-deco-form-group">
        <Label htmlFor="category" className="art-deco-form-label">Category</Label>
        <Select 
          onValueChange={(value) => handleSelectChange('category', value)}
          value={formData.category}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="demographics">Demographics</SelectItem>
            <SelectItem value="geography">Geography</SelectItem>
            <SelectItem value="trends">Trends</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FormDivider pattern="diamonds" />
      
      <div className="art-deco-form-group">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="agreeToTerms" 
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, agreeToTerms: checked === true }))
            }
          />
          <Label 
            htmlFor="agreeToTerms" 
            className="text-sm font-light text-gold-300"
          >
            I agree to the terms and conditions
          </Label>
        </div>
      </div>
      
      <div className="art-deco-form-group">
        <Label className="art-deco-form-label mb-2 block">Notification Preferences</Label>
        <RadioGroup 
          value={formData.notifications}
          onValueChange={handleRadioChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="text-sm font-light text-gold-300">All notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="important" id="important" />
            <Label htmlFor="important" className="text-sm font-light text-gold-300">Important only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="text-sm font-light text-gold-300">None</Label>
          </div>
        </RadioGroup>
      </div>

      <FormDivider pattern="zigzag" />
      
      <div className="flex space-x-4 pt-2">
        <Button type="submit" className="flex-1">
          Submit
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
