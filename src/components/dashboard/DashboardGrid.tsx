import React from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { AVAILABLE_WIDGETS } from './dashboardConfig';

// Import required CSS
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Apply the width provider to create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

import { DataTrends } from '@/components/DataTrends';
import { DemographicsBreakdown } from '@/components/DemographicsBreakdown';
import { PredictionModel } from '@/components/PredictionModel';
import { CorrelationMatrix } from '@/components/CorrelationMatrix';
import { HealthMap } from '@/components/HealthMap';
import { HealthDataAIInsights } from '@/components/HealthDataAIInsights';

interface DashboardGridProps {
  layouts: Layouts;
  activeWidgets: string[];
  handleLayoutChange: (currentLayout: Layout[], allLayouts: Layouts) => void;
  compactMode: boolean;
  currentTheme: { primary: string; secondary: string };
}

export function DashboardGrid({
  layouts,
  activeWidgets,
  handleLayoutChange,
  compactMode,
  currentTheme
}: DashboardGridProps) {
  // Render appropriate widget based on ID
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'health-trends':
        return <DataTrends />;
      case 'demographic-breakdown':
        return <DemographicsBreakdown />;
      case 'prediction-model':
        return <PredictionModel />;
      case 'correlation-matrix':
        return <CorrelationMatrix />;
      case 'health-map':
        return <HealthMap />;
      case 'ai-insights':
        return <HealthDataAIInsights />;
      default:
        return <div>Unknown widget type</div>;
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden ${currentTheme.primary} bg-opacity-5`}>
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
  );
}
