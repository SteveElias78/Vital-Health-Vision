
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SourceInfoPanel } from './SourceInfoPanel';
import { ActiveSegmentDetails } from './ActiveSegmentDetails';
import { formatSourceName, getConfidenceColor, formatValue } from './utils';
import './styles.css';

export interface SourceInfo {
  primary?: string;
  fetchedAt?: string;
  sources?: Array<{
    source: string;
    status: string;
  }>;
  validation?: {
    confidenceScore?: number;
    discrepancies?: any[];
  };
}

export interface SourceTransparentVizProps {
  data: Array<Record<string, any>>;
  title: string;
  subtitle?: string;
  sourceInfo?: SourceInfo;
  metricField?: string;
  categoryField?: string;
  showSourceDetails?: boolean;
  onSegmentClick?: (data: any) => void;
  height?: number;
  colorRange?: string[];
}

const SourceTransparentViz: React.FC<SourceTransparentVizProps> = ({
  data,
  title,
  subtitle,
  sourceInfo,
  metricField = 'value',
  categoryField = 'category',
  showSourceDetails = true,
  onSegmentClick,
  height = 500,
  colorRange = ['#f9ca24', '#f0932b', '#d4a010', '#c48c0c', '#a37707', '#826006'],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState<Record<string, any> | null>(null);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false);
  
  // Calculate confidence score based on source information
  const confidenceScore = sourceInfo?.validation?.confidenceScore || 
                         (sourceInfo?.primary ? 0.9 : 0.7);
  
  // D3 Visualization Effect
  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 800;
    const margin = { top: 60, right: 30, bottom: 50, left: 60 };
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create main group with margin
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Set up scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d[categoryField]))
      .range([0, chartWidth])
      .padding(0.3);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[metricField]) * 1.1]) // Add 10% padding
      .range([chartHeight, 0]);
    
    // Color scale based on confidence and provided color range
    const colorScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 1])
      .clamp(true);
      
    // Create gradient definitions for bars
    const defs = svg.append('defs');
    
    // Create a gradient for each bar
    data.forEach((d, i) => {
      const gradientId = `bar-gradient-${i}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorRange[Math.min(colorRange.length - 1, i)])
        .attr('stop-opacity', confidenceScore);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colorRange[Math.min(colorRange.length - 1, i)])
        .attr('stop-opacity', confidenceScore * 0.7);
    });
    
    // Add confidence indicator background
    g.append('rect')
      .attr('class', 'confidence-bg')
      .attr('x', -20)
      .attr('y', -30)
      .attr('width', chartWidth + 40)
      .attr('height', 20)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', '#131a2c')
      .attr('stroke', '#f9ca24')
      .attr('stroke-opacity', 0.3);
    
    // Add confidence indicator
    g.append('rect')
      .attr('class', 'confidence-indicator')
      .attr('x', -15)
      .attr('y', -25)
      .attr('width', (chartWidth + 30) * confidenceScore)
      .attr('height', 10)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', getConfidenceColor(confidenceScore));
    
    // Add confidence text
    g.append('text')
      .attr('class', 'confidence-text')
      .attr('x', chartWidth / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f9ca24')
      .attr('font-size', '12px')
      .text(`Data Confidence: ${Math.round(confidenceScore * 100)}%`);
    
    // Add source info
    if (sourceInfo && sourceInfo.primary) {
      g.append('text')
        .attr('class', 'source-text')
        .attr('x', -15)
        .attr('y', -40)
        .attr('text-anchor', 'start')
        .attr('fill', '#f9ca24')
        .attr('font-size', '10px')
        .attr('opacity', 0.8)
        .text(`Source: ${formatSourceName(sourceInfo.primary)}`);
    }
    
    // Add last updated info if available
    if (sourceInfo && sourceInfo.fetchedAt) {
      const fetchDate = new Date(sourceInfo.fetchedAt);
      g.append('text')
        .attr('class', 'update-text')
        .attr('x', chartWidth + 15)
        .attr('y', -40)
        .attr('text-anchor', 'end')
        .attr('fill', '#f9ca24')
        .attr('font-size', '10px')
        .attr('opacity', 0.8)
        .text(`Updated: ${fetchDate.toLocaleDateString()}`);
    }
    
    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f9ca24')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text(title);
    
    // Add subtitle if provided
    if (subtitle) {
      svg.append('text')
        .attr('class', 'chart-subtitle')
        .attr('x', width / 2)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f9ca24')
        .attr('font-size', '14px')
        .attr('opacity', 0.8)
        .text(subtitle);
    }

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#f9ca24')
      .attr('opacity', 0.9)
      .attr('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');
    
    // Style x-axis
    g.selectAll('.x-axis path, .x-axis line')
      .attr('stroke', '#f9ca24')
      .attr('stroke-opacity', 0.3);
    
    // Create y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => {
        // Format based on value magnitude
        if (typeof d === 'number') {
          if (d >= 1000000) return `${d / 1000000}M`;
          if (d >= 1000) return `${d / 1000}K`;
        }
        return d;
      });
    
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#f9ca24')
      .attr('opacity', 0.9)
      .attr('font-size', '12px');
    
    // Style y-axis
    g.selectAll('.y-axis path, .y-axis line')
      .attr('stroke', '#f9ca24')
      .attr('stroke-opacity', 0.3);
    
    // Create grid lines
    g.selectAll('grid-line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#f9ca24')
      .attr('stroke-opacity', 0.1)
      .attr('stroke-dasharray', '3,3');
    
    // Create bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d[categoryField]))
      .attr('y', d => yScale(d[metricField]))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d[metricField]))
      .attr('fill', (_, i) => `url(#bar-gradient-${i})`)
      .attr('stroke', '#131a2c')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke', '#f9ca24')
          .attr('stroke-width', 2);
        
        if (tooltipRef.current) {
          showTooltip(event, d);
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
          .attr('stroke', '#131a2c')
          .attr('stroke-width', 1);
        
        if (tooltipRef.current) {
          hideTooltip();
        }
      })
      .on('click', (event, d) => {
        setActiveSegment(activeSegment === d ? null : d);
        if (onSegmentClick) onSegmentClick(d);
      });
    
    // Add value labels on bars
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => xScale(d[categoryField]) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d[metricField]) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f9ca24')
      .attr('font-size', '12px')
      .text(d => formatValue(d[metricField]));
    
    // Add source info panel button
    if (showSourceDetails && sourceInfo) {
      const sourceButton = svg.append('g')
        .attr('class', 'source-button')
        .attr('transform', `translate(${width - 35}, 30)`)
        .attr('cursor', 'pointer')
        .on('click', () => setSourcePanelOpen(!sourcePanelOpen));
      
      sourceButton.append('circle')
        .attr('r', 15)
        .attr('fill', '#131a2c')
        .attr('stroke', '#f9ca24')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5);
      
      sourceButton.append('text')
        .attr('x', 0)
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f9ca24')
        .attr('font-size', '16px')
        .text('i');
    }
    
    // Add "Based on Alternative Sources" indicator if not from CDC
    if (sourceInfo && sourceInfo.primary !== 'CDC') {
      const warningGroup = svg.append('g')
        .attr('class', 'alt-source-indicator')
        .attr('transform', `translate(35, 30)`);
      
      warningGroup.append('rect')
        .attr('x', -25)
        .attr('y', -15)
        .attr('width', 160)
        .attr('height', 25)
        .attr('rx', 12.5)
        .attr('ry', 12.5)
        .attr('fill', 'rgba(249, 202, 36, 0.2)')
        .attr('stroke', '#f9ca24')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5);
      
      warningGroup.append('text')
        .attr('x', 55)
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f9ca24')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text('Alternative Data Source');
    }
  }, [data, height, metricField, categoryField, title, subtitle, sourceInfo, confidenceScore, colorRange, onSegmentClick]);
  
  // Show tooltip
  const showTooltip = (event: any, data: any) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    
    tooltip.style.opacity = '1';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 28}px`;
    
    // Set tooltip content
    tooltip.innerHTML = `
      <div class="tooltip-category">${data[categoryField]}</div>
      <div class="tooltip-value">${formatValue(data[metricField])}</div>
      ${data.sourceName ? `<div class="tooltip-source">Source: ${formatSourceName(data.sourceName)}</div>` : ''}
    `;
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    
    tooltip.style.opacity = '0';
  };
  
  return (
    <div className="source-transparent-viz-container">
      {/* Main Visualization */}
      <svg 
        ref={svgRef}
        width="100%"
        height={height}
        className="source-viz-svg"
      />
      
      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="source-viz-tooltip"
      />
      
      {/* Source Information Panel */}
      {showSourceDetails && sourcePanelOpen && sourceInfo && (
        <SourceInfoPanel 
          sourceInfo={sourceInfo} 
          confidenceScore={confidenceScore} 
          onClose={() => setSourcePanelOpen(false)} 
        />
      )}
      
      {/* Active Segment Details */}
      {activeSegment && (
        <ActiveSegmentDetails 
          segment={activeSegment} 
          metricField={metricField} 
          categoryField={categoryField} 
        />
      )}
    </div>
  );
};

export default SourceTransparentViz;
