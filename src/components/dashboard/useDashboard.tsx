
import { useState, useEffect } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { LAYOUT_TEMPLATES, AVAILABLE_WIDGETS, COLOR_THEMES } from './dashboardConfig';
import { toast } from '@/hooks/use-toast';
import { useUserDashboards, SavedDashboard } from '@/hooks/useUserDashboards';
import { useLocation } from 'react-router-dom';

export function useDashboard() {
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
  const [showManager, setShowManager] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');
  const [compactMode, setCompactMode] = useState(false);
  const location = useLocation();
  
  const { getDashboardById } = useUserDashboards();
  
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
  
  // Save the current dashboard configuration (local storage)
  const saveDashboard = () => {
    const config = {
      layouts,
      activeWidgets,
      colorTheme,
      compactMode
    };
    
    localStorage.setItem('dashboardConfig', JSON.stringify(config));
    
    toast({
      title: 'Dashboard configuration saved',
      description: 'Your dashboard layout has been saved locally',
    });
  };
  
  // Load a saved dashboard configuration (local storage)
  const loadDashboard = () => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setLayouts(config.layouts);
        setActiveWidgets(config.activeWidgets);
        setColorTheme(config.colorTheme);
        setCompactMode(config.compactMode);
        
        toast({
          title: 'Dashboard configuration loaded',
          description: 'Your saved dashboard layout has been restored',
        });
      } catch (error) {
        console.error('Error loading dashboard config:', error);
        toast({
          title: 'Error loading configuration',
          description: 'Could not load the saved dashboard',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'No saved configuration',
        description: 'No locally saved dashboard configuration was found',
        variant: 'destructive',
      });
    }
  };
  
  // Load a saved dashboard from the database
  const loadSavedDashboard = (dashboardConfig: SavedDashboard['layout']) => {
    setLayouts(dashboardConfig.layouts);
    setActiveWidgets(dashboardConfig.activeWidgets);
    setColorTheme(dashboardConfig.colorTheme);
    setCompactMode(dashboardConfig.compactMode);
    setShowManager(false);
    
    toast({
      title: 'Dashboard loaded',
      description: 'The selected dashboard has been loaded successfully',
    });
  };
  
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
  
  // Check URL for shared dashboard
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const dashboardParam = query.get('dashboard');
    const dashboardId = query.get('id');
    
    if (dashboardParam) {
      try {
        const decodedConfig = JSON.parse(atob(dashboardParam));
        setLayouts(decodedConfig.layouts);
        setActiveWidgets(decodedConfig.activeWidgets);
        setColorTheme(decodedConfig.colorTheme);
        setCompactMode(decodedConfig.compactMode);
        
        toast({
          title: 'Shared dashboard loaded',
          description: 'A shared dashboard configuration has been loaded',
        });
      } catch (error) {
        console.error('Error loading shared dashboard:', error);
      }
    } else if (dashboardId) {
      // Load dashboard by ID from database
      getDashboardById(dashboardId).then(dashboard => {
        if (dashboard) {
          setLayouts(dashboard.layout.layouts);
          setActiveWidgets(dashboard.layout.activeWidgets);
          setColorTheme(dashboard.layout.colorTheme);
          setCompactMode(dashboard.layout.compactMode);
          
          toast({
            title: 'Dashboard loaded',
            description: `The dashboard "${dashboard.name}" has been loaded`,
          });
        }
      });
    } else {
      // Load saved configuration on initial mount
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
    }
  }, [location.search, getDashboardById]);

  return {
    // State
    layouts,
    activeWidgets,
    showSettings,
    showTemplates,
    showSharing,
    showManager,
    colorTheme,
    compactMode,
    
    // Actions
    setShowSettings,
    setShowTemplates,
    setShowSharing,
    setShowManager,
    setColorTheme,
    setCompactMode,
    handleLayoutChange,
    applyTemplate,
    saveDashboard,
    loadDashboard,
    loadSavedDashboard,
    toggleWidget,
    createShareableLink,
    getCurrentTheme,
  };
}
