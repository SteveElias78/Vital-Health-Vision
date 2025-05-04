
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { DataTrends } from "@/components/DataTrends";
import { DemographicsBreakdown } from "@/components/DemographicsBreakdown";
import { CorrelationMatrix } from "@/components/CorrelationMatrix";
import { HealthMap } from "@/components/HealthMap";
import { PredictionModel } from "@/components/PredictionModel";
import { DashboardSettings } from '@/components/dashboard/DashboardSettings';
import { DashboardTemplates } from '@/components/dashboard/DashboardTemplates';
import { DashboardSharing } from '@/components/dashboard/DashboardSharing';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, Download, Settings, Layout as LayoutIcon, Share } from 'lucide-react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Apply the width provider to create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

// Define the available widgets
const AVAILABLE_WIDGETS = [
  { id: 'trends', name: 'Data Trends', component: DataTrends },
  { id: 'demographics', name: 'Demographics Breakdown', component: DemographicsBreakdown },
  { id: 'correlation', name: 'Correlation Matrix', component: CorrelationMatrix },
  { id: 'map', name: 'Health Map', component: HealthMap },
  { id: 'prediction', name: 'Prediction Model', component: PredictionModel }
];

// Define layout templates
const LAYOUT_TEMPLATES = {
  standard: [
    { i: 'trends', x: 0, y: 0, w: 8, h: 6 },
    { i: 'demographics', x: 8, y: 0, w: 4, h: 6 },
    { i: 'correlation', x: 0, y: 6, w: 6, h: 6 },
    { i: 'map', x: 6, y: 6, w: 6, h: 6 },
    { i: 'prediction', x: 0, y: 12, w: 12, h: 6 }
  ],
  compact: [
    { i: 'trends', x: 0, y: 0, w: 12, h: 6 },
    { i: 'demographics', x: 0, y: 6, w: 6, h: 6 },
    { i: 'correlation', x: 6, y: 6, w: 6, h: 6 },
    { i: 'map', x: 0, y: 12, w: 6, h: 6 },
    { i: 'prediction', x: 6, y: 12, w: 6, h: 6 }
  ],
  focus: [
    { i: 'trends', x: 0, y: 0, w: 12, h: 9 },
    { i: 'demographics', x: 0, y: 9, w: 4, h: 6 },
    { i: 'correlation', x: 4, y: 9, w: 4, h: 6 },
    { i: 'map', x: 8, y: 9, w: 4, h: 6 },
  ]
};

// Available color themes
const COLOR_THEMES = [
  { id: 'default', name: 'Default', primary: 'bg-indigo-600', secondary: 'bg-pink-500' },
  { id: 'dark', name: 'Dark', primary: 'bg-gray-800', secondary: 'bg-gray-700' },
  { id: 'light', name: 'Light', primary: 'bg-gray-100', secondary: 'bg-white' },
  { id: 'health', name: 'Health', primary: 'bg-emerald-600', secondary: 'bg-teal-500' },
  { id: 'vibrant', name: 'Vibrant', primary: 'bg-purple-600', secondary: 'bg-indigo-500' }
];

export function CustomizableDashboard() {
  // State for layout configuration
  const [layouts, setLayouts] = useState<Layouts>({
    lg: LAYOUT_TEMPLATES.standard,
    md: LAYOUT_TEMPLATES.standard,
    sm: LAYOUT_TEMPLATES.compact,
    xs: LAYOUT_TEMPLATES.compact,
    xxs: LAYOUT_TEMPLATES.compact
  });
  
  // State for active widgets
  const [activeWidgets, setActiveWidgets] = useState<string[]>(
    AVAILABLE_WIDGETS.map(widget => widget.id)
  );

  // State for settings
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');
  const [compactMode, setCompactMode] = useState(false);
  
  // Handle layout changes
  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };
  
  // Apply a template layout
  const applyTemplate = (templateName: keyof typeof LAYOUT_TEMPLATES) => {
    setLayouts({
      lg: LAYOUT_TEMPLATES[templateName],
      md: LAYOUT_TEMPLATES[templateName],
      sm: LAYOUT_TEMPLATES.compact,
      xs: LAYOUT_TEMPLATES.compact,
      xxs: LAYOUT_TEMPLATES.compact
    });
    setShowTemplates(false);
  };
  
  // Save the current dashboard configuration
  const saveDashboard = () => {
    const config = {
      layouts,
      activeWidgets,
      colorTheme,
      compactMode
    };
    
    localStorage.setItem('dashboardConfig', JSON.stringify(config));
    
    // Show a toast or notification
    console.log('Dashboard configuration saved!');
  };
  
  // Load a saved dashboard configuration
  const loadDashboard = () => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setLayouts(config.layouts);
      setActiveWidgets(config.activeWidgets);
      setColorTheme(config.colorTheme);
      setCompactMode(config.compactMode);
      
      // Show a toast or notification
      console.log('Dashboard configuration loaded!');
    }
  };
  
  // Load saved configuration on initial mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setLayouts(config.layouts);
        setActiveWidgets(config.activeWidgets);
        setColorTheme(config.colorTheme);
        setCompactMode(config.compactMode);
      } catch (error) {
        console.error('Error loading dashboard config:', error);
      }
    }
  }, []);
  
  // Create shareable link
  const createShareableLink = () => {
    const config = {
      layouts,
      activeWidgets,
      colorTheme,
      compactMode
    };
    
    // In a real app, we'd probably use a backend service to store this
    // and generate a short ID. For demo purposes, we'll use base64 encoding
    const encodedConfig = btoa(JSON.stringify(config));
    const shareableLink = `${window.location.origin}${window.location.pathname}?dashboard=${encodedConfig}`;
    
    return shareableLink;
  };
  
  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    if (activeWidgets.includes(widgetId)) {
      setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
    } else {
      setActiveWidgets([...activeWidgets, widgetId]);
    }
  };

  // Determine the current theme classes
  const getCurrentTheme = () => {
    const theme = COLOR_THEMES.find(theme => theme.id === colorTheme) || COLOR_THEMES[0];
    return theme;
  };
  
  // Render the dashboard
  return (
    <div className={`p-4 transition-colors duration-300 min-h-[calc(100vh-200px)]`}>
      {/* Dashboard Controls */}
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
      
      {/* Settings Panel */}
      {showSettings && (
        <DashboardSettings
          widgets={AVAILABLE_WIDGETS}
          activeWidgets={activeWidgets}
          toggleWidget={toggleWidget}
          colorThemes={COLOR_THEMES}
          currentTheme={colorTheme}
          setColorTheme={setColorTheme}
          compactMode={compactMode}
          setCompactMode={setCompactMode}
          onClose={() => setShowSettings(false)}
        />
      )}
      
      {/* Templates Panel */}
      {showTemplates && (
        <DashboardTemplates
          templates={Object.keys(LAYOUT_TEMPLATES)}
          applyTemplate={applyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
      
      {/* Sharing Panel */}
      {showSharing && (
        <DashboardSharing
          createShareableLink={createShareableLink}
          onClose={() => setShowSharing(false)}
        />
      )}
      
      {/* Grid Layout */}
      <div className={`border rounded-lg overflow-hidden ${getCurrentTheme().primary} bg-opacity-5`}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={50}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          compactType={compactMode ? "vertical" : null}
          margin={[12, 12]}
        >
          {AVAILABLE_WIDGETS.map(widget => {
            if (activeWidgets.includes(widget.id)) {
              const WidgetComponent = widget.component;
              return (
                <div key={widget.id} className="border rounded-lg bg-card shadow-sm overflow-hidden">
                  <WidgetComponent />
                </div>
              );
            }
            return null;
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}
