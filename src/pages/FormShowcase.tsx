
import React from 'react';
import { AppLayoutWrapper } from '@/components/layout/AppLayoutWrapper';
import { ArtDecoForm, FormData } from '@/components/forms/ArtDecoForm';
import { DashboardCard } from '@/components/DashboardCard';
import { FormDivider } from '@/components/decorative/FormDivider';
import { toast } from 'sonner';
import { GeometricDivider } from '@/components/decorative/GeometricDivider';

export default function FormShowcase() {
  const handleFormSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast.success('Form submitted successfully!');
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-light tracking-wider text-gold-400 mb-6">
          Art Deco Form Elements
        </h1>
        
        <GeometricDivider pattern="diamonds" size="md" />
        
        <DashboardCard 
          title="Registration Form" 
          description="Example form with Art Deco styled elements"
        >
          <div className="px-2 py-4">
            <ArtDecoForm onSubmit={handleFormSubmit} />
          </div>
        </DashboardCard>
        
        <GeometricDivider pattern="chevron" size="md" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard title="Form Dividers">
            <div className="p-6 space-y-6">
              <FormDivider label="Standard Divider" />
              <FormDivider pattern="diamonds" />
              <FormDivider pattern="zigzag" />
              <FormDivider label="With Label" pattern="diamonds" />
            </div>
          </DashboardCard>
          
          <DashboardCard title="Geometric Patterns">
            <div className="p-6 space-y-6">
              <GeometricDivider pattern="triangles" />
              <GeometricDivider pattern="squares" />
              <GeometricDivider pattern="chevron" />
              <GeometricDivider pattern="zigzag" />
            </div>
          </DashboardCard>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
