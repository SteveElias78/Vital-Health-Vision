
import React from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { AVAILABLE_WIDGETS } from './dashboardConfig';

// Import required CSS
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Apply the width provider to create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

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
