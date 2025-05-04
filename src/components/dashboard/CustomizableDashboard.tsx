
import React from 'react';
import { DashboardSettings } from '@/components/dashboard/DashboardSettings';
import { DashboardTemplates } from '@/components/dashboard/DashboardTemplates';
import { DashboardSharing } from '@/components/dashboard/DashboardSharing';
import { DashboardControls } from '@/components/dashboard/DashboardControls';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { useDashboard } from '@/components/dashboard/useDashboard';
import { AVAILABLE_WIDGETS, COLOR_THEMES, LAYOUT_TEMPLATES } from '@/components/dashboard/dashboardConfig';

export function CustomizableDashboard() {
  const {
    layouts,
    activeWidgets,
    showSettings,
    showTemplates,
    showSharing,
    colorTheme,
    compactMode,
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
  } = useDashboard();

  return (
    <div className="p-4 transition-colors duration-300 min-h-[calc(100vh-200px)]">
      {/* Dashboard Controls */}
      <DashboardControls
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        saveDashboard={saveDashboard}
        loadDashboard={loadDashboard}
        showSharing={showSharing}
        setShowSharing={setShowSharing}
      />
      
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
      <DashboardGrid
        layouts={layouts}
        activeWidgets={activeWidgets}
        handleLayoutChange={handleLayoutChange}
        compactMode={compactMode}
        currentTheme={getCurrentTheme()}
      />
    </div>
  );
}
