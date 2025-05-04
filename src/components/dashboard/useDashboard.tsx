
import { useState, useEffect } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { LAYOUT_TEMPLATES, AVAILABLE_WIDGETS, COLOR_THEMES } from './dashboardConfig';

interface DashboardConfig {
  layouts: Layouts;
  activeWidgets: string[];
  colorTheme: string;
  compactMode: boolean;
}

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

  return {
    // State
    layouts,
    activeWidgets,
    showSettings,
    showTemplates,
    showSharing,
    colorTheme,
    compactMode,
    
    // Actions
    setShowSettings,
    setShowTemplates,
    setShowSharing,
    setColorTheme,
    setCompactMode,
    handleLayoutChange,
    applyTemplate,
    saveDashboard,
    loadDashboard,
    toggleWidget,
    createShareableLink,
    getCurrentTheme,
  };
}
