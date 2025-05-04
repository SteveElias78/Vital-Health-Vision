
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DashboardTemplatesProps {
  templates: string[];
  applyTemplate: (templateName: any) => void;
  onClose: () => void;
}

export function DashboardTemplates({
  templates,
  applyTemplate,
  onClose
}: DashboardTemplatesProps) {
  // Function to get a readable template name
  const getTemplateName = (templateId: string) => {
    return templateId.charAt(0).toUpperCase() + templateId.slice(1);
  };

  // Function to get template description
  const getTemplateDescription = (templateId: string) => {
    switch (templateId) {
      case 'standard':
        return 'Balanced layout with all widgets';
      case 'compact':
        return 'Space-efficient layout with all widgets';
      case 'focus':
        return 'Emphasis on trends with supporting metrics';
      default:
        return 'Custom template layout';
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Dashboard Templates</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card 
              key={template} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => applyTemplate(template)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                  {/* Template preview visualization */}
                  <div className="w-full h-full p-2">
                    <div className={`w-full h-full border-2 border-dashed rounded flex items-center justify-center ${
                      template === 'standard' ? 'grid grid-cols-3 grid-rows-2 gap-1' :
                      template === 'compact' ? 'grid grid-cols-2 grid-rows-3 gap-1' :
                      'grid grid-cols-1 grid-rows-2 gap-1'
                    }`}>
                      {template === 'standard' && (
                        <>
                          <div className="bg-primary/20 col-span-2 row-span-1"></div>
                          <div className="bg-primary/30"></div>
                          <div className="bg-primary/20"></div>
                          <div className="bg-primary/30"></div>
                          <div className="bg-primary/20 col-span-3"></div>
                        </>
                      )}
                      {template === 'compact' && (
                        <>
                          <div className="bg-primary/20 col-span-2"></div>
                          <div className="bg-primary/30"></div>
                          <div className="bg-primary/20"></div>
                          <div className="bg-primary/30"></div>
                          <div className="bg-primary/20"></div>
                        </>
                      )}
                      {template === 'focus' && (
                        <>
                          <div className="bg-primary/20"></div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="bg-primary/30"></div>
                            <div className="bg-primary/20"></div>
                            <div className="bg-primary/30"></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium">{getTemplateName(template)}</h3>
                <p className="text-sm text-muted-foreground">{getTemplateDescription(template)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
