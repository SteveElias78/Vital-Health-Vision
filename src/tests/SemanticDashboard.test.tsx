
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SemanticDataDashboard from '@/pages/SemanticDataDashboard';

// Mock the imports that might cause issues in tests
vi.mock('@/data/fusion/SemanticDataFusionService', () => ({
  SemanticDataFusionService: class {
    getHarmonizedData = vi.fn().mockResolvedValue({
      data: [],
      metadata: { source: 'test', confidence: 0.95 }
    });
  }
}));

// Mock the component dependencies
vi.mock('@/components/layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  )
}));

vi.mock('@/components/predictive/PredictiveTrendsChart', () => ({
  PredictiveTrendsChart: () => <div data-testid="predictive-trends-chart">PredictiveTrendsChart</div>,
  generatePredictiveData: vi.fn().mockReturnValue([])
}));

vi.mock('@/components/visualizations/NetworkGraphVisualization', () => ({
  NetworkGraphVisualization: () => <div data-testid="network-graph">NetworkGraph</div>,
  generateNetworkData: vi.fn().mockReturnValue({ nodes: [], links: [] })
}));

vi.mock('@/components/governance/DataSourceTransparency', () => ({
  DataSourceTransparency: () => <div data-testid="data-source-transparency">DataSourceTransparency</div>,
  generateDataSources: vi.fn().mockReturnValue([])
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children, value }: { children: React.ReactNode, value: string }) => 
    <div data-testid={`tab-content-${value}`}>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('@/components/artdeco/ArtDecoPageHeader', () => ({
  ArtDecoPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>
}));

vi.mock('@/components/artdeco/ArtDecoStatsCard', () => ({
  ArtDecoStatsCard: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/components/artdeco/ArtDecoGradientDivider', () => ({
  ArtDecoGradientDivider: () => <hr />
}));

describe('SemanticDataDashboard', () => {
  it('renders the semantic dashboard', async () => {
    render(
      <BrowserRouter>
        <SemanticDataDashboard />
      </BrowserRouter>
    );
    
    // Check that the title is rendered
    expect(screen.getByText('Semantic Health Intelligence')).toBeInTheDocument();
    
    // Check that tabs are rendered with their content
    expect(screen.getByTestId('tab-content-insights')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-predictions')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-relationships')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-governance')).toBeInTheDocument();
    
    // Check that data visualization components are rendered
    expect(screen.getByTestId('predictive-trends-chart')).toBeInTheDocument();
  });
});
