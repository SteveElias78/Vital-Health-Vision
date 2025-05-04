
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Upload, Settings, Layout as LayoutIcon, Share } from 'lucide-react';

interface DashboardControlsProps {
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  saveDashboard: () => void;
  loadDashboard: () => void;
  showSharing: boolean;
  setShowSharing: (show: boolean) => void;
}

export function DashboardControls({
  showTemplates,
  setShowTemplates,
  showSettings,
  setShowSettings,
  saveDashboard,
  loadDashboard,
  showSharing,
  setShowSharing
}: DashboardControlsProps) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold">Customizable Dashboard</h2>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <LayoutIcon className="mr-2 h-4 w-4" />
          Templates
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={saveDashboard}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadDashboard}
        >
          <Upload className="mr-2 h-4 w-4" />
          Load
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSharing(!showSharing)}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
