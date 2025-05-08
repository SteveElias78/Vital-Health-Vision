// src/components/visualizations/RadialHealthViz.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

/**
 * A radial visualization component that matches the elegant gold/black aesthetic
 * from the design mockups, showing health data in a circular layout
 */
const RadialHealthViz = ({
  data = [],
  valueField = 'value',
  labelField = 'label',
  title = 'Health Insights',
  subtitle = '',
  colorRange = ['#f9ca24', '#f0932b', '#d4a010', '#c48c0c', '#a37707', '#826006'],
  innerRadius = 0.3,
  showLabels = true,
  animate = true,
  onSegmentClick = () => {},
  sourceInfo = null,
  height = 500,
  width
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [size, setSize] = useState({ width: width || 800, height });
  
  // Set up resize observer to make the visualization responsive
  useEffect(() => {
    if (!svgRef.current) return;
    
    const updateSize = () => {
      const container = svgRef.current.parentElement;
      if (!container) return;
      
      // Make it square based on the smaller dimension if width not specified
      if (!width) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight || height;
        const size = Math.min(containerWidth, containerHeight);
        setSize({ width: size, height: size });
      }
    };
    
    // Initial size
    updateSize();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(svgRef.current.parentElement);
    
    return () => {
      if (resizeObserver && svgRef.current?.parentElement) {
        resizeObserver.disconnect();
      }
    };
  }, [height, width]);
  
  // Create and update the visualization
  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0 || size.width === 0) return;
    
    const svg = d3.select(svgRef.current);
    const { width, height } = size;
    const radius = Math.min(width, height) / 2 * 0.85; // 85% of half the width/height
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    // Set up the SVG
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Create radial gradient background
    const defs = svg.append('defs');
    const radialGradient = defs.append('radialGradient')
      .attr('id', 'radial-bg-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    radialGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#131a2c');
    
    radialGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0a0f1c');
    
    // Add background
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius * 1.05)
      .attr('fill', 'url(#radial-bg-gradient)')
      .attr('stroke', '#f9ca24')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3);
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d[labelField]))
      .range(colorRange);
    
    // Create the pie layout
    const pie = d3.pie()
      .value(d => d[valueField])
      .sort(null);
    
    // Create the arc generator
    const arc = d3.arc()
      .innerRadius(radius * innerRadius)
      .outerRadius(radius)
      .cornerRadius(3)
      .padAngle(0.01);
    
    // Smaller arc for labels
    const labelArc = d3.arc()
      .innerRadius(radius * 1.05)
      .outerRadius(radius * 1.05);
    
    // Calculate total and display confidence info if source info is provided
    const totalValue = data.reduce((sum, item) => sum + parseFloat(item[valueField] || 0), 0);
    
    // Calculate confidence score based on source information
    const confidenceScore = sourceInfo?.validation?.confidenceScore || 
                          (sourceInfo?.primary ? 0.9 : 0.7);
    
    // Create a group for the visualization
    const g = svg.select('g');
    
    // Add source confidence indicator if sourceInfo is provided
    if (sourceInfo) {
      // Add confidence indicator background
      g.append('rect')
        .attr('class', 'confidence-bg')
        .attr('x', -radius * 0.8)
        .attr('y', -radius * 1.15)
        .attr('width', radius * 1.6)
        .attr('height', radius * 0.08)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', '#131a2c')
        .attr('stroke', '#f9ca24')
        .attr('stroke-opacity', 0.3);
      
      // Add confidence indicator
      g.append('rect')
        .attr('class', 'confidence-indicator')
        .attr('x', -radius * 0.78)
        .attr('y', -radius * 1.13)
        .attr('width', (radius * 1.56) * confidenceScore)
        .attr('height', radius * 0.04)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', getConfidenceColor(confidenceScore));
      
      // Add confidence text
      g.append('text')
        .attr('class', 'confidence-text')
        .attr('text-anchor', 'middle')
        .attr('dy', -radius * 1.18)
        .attr('fill', '#f9ca24')
        .style('font-size', radius * 0.04)
        .text(`Data Confidence: ${Math.round(confidenceScore * 100)}%`);
      
      // Add source info
      if (sourceInfo.primary) {
        g.append('text')
          .attr('class', 'source-text')
          .attr('x', -radius * 0.78)
          .attr('y', -radius * 1.23)
          .attr('text-anchor', 'start')
          .attr('fill', '#f9ca24')
          .attr('font-size', radius * 0.035)
          .attr('opacity', 0.8)
          .text(`Source: ${formatSourceName(sourceInfo.primary)}`);
      }
      
      // Add last updated info if available
      if (sourceInfo.fetchedAt) {
        const fetchDate = new Date(sourceInfo.fetchedAt);
        g.append('text')
          .attr('class', 'update-text')
          .attr('x', radius * 0.78)
          .attr('y', -radius * 1.23)
          .attr('text-anchor', 'end')
          .attr('fill', '#f9ca24')
          .attr('font-size', radius * 0.035)
          .attr('opacity', 0.8)
          .text(`Updated: ${fetchDate.toLocaleDateString()}`);
      }
    }
    
    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f9ca24')
      .attr('font-size', radius * 0.08)
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
        .attr('font-size', radius * 0.05)
        .attr('opacity', 0.8)
        .text(subtitle);
    }
    
    // Create and add the segments
    const segments = g.selectAll('.segment')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'segment');
    
    // Add segment paths
    const arcPaths = segments.append('path')
      .attr('d', d => arc(d))
      .attr('fill', d => colorScale(d.data[labelField]))
      .attr('stroke', '#0a0f1c')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('opacity', 0.9)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('transform', calculateSegmentOffset(d));
        
        setHoveredSegment(d.data);
        
        // Handle tooltip
        if (tooltipRef.current) {
          showTooltip(event, d.data);
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('transform', 'translate(0, 0)');
        
        setHoveredSegment(null);
        
        // Hide tooltip
        if (tooltipRef.current) {
          hideTooltip();
        }
      })
      .on('click', (event, d) => {
        onSegmentClick(d.data);
      });
    
    // Add hover effect - calculate offset for segment hovering
    function calculateSegmentOffset(d) {
      // Calculate angle in radians at the center of the arc
      const angle = (d.startAngle + d.endAngle) / 2;
      // Calculate offset distance (5% of radius)
      const offset = radius * 0.05;
      // Calculate x and y components of the offset
      const x = Math.sin(angle) * offset;
      const y = -Math.cos(angle) * offset;
      return `translate(${x}, ${y})`;
    }
    
    // Add segment labels if enabled
    if (showLabels) {
      // Add lines connecting to labels
      segments
        .filter(d => (d.endAngle - d.startAngle) > 0.15) // Only add labels to segments large enough
        .append('line')
        .attr('x1', d => arc.centroid(d)[0] * 1.05)
        .attr('y1', d => arc.centroid(d)[1] * 1.05)
        .attr('x2', d => labelArc.centroid(d)[0])
        .attr('y2', d => labelArc.centroid(d)[1])
        .attr('stroke', '#f9ca24')
        .attr('stroke-width', 0.5)
        .style('opacity', 0.5);
      
      // Add the text labels
      segments
        .filter(d => (d.endAngle - d.startAngle) > 0.15)
        .append('text')
        .attr('transform', d => {
          const pos = labelArc.centroid(d);
          // Adjust position based on which quadrant the label is in
          const x = pos[0];
          const y = pos[1];
          const angleInDegrees = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
          
          // Position the text properly based on which side of the circle it's on
          if (angleInDegrees >= 90 && angleInDegrees <= 270) {
            return `translate(${pos[0] - 5}, ${pos[1]}) rotate(${(Math.atan2(y, x) * 180 / Math.PI)})`;
          } else {
            return `translate(${pos[0] + 5}, ${pos[1]}) rotate(${(Math.atan2(y, x) * 180 / Math.PI)})`;
          }
        })
        .attr('text-anchor', d => {
          const pos = labelArc.centroid(d);
          const angleInDegrees = (Math.atan2(pos[1], pos[0]) * 180 / Math.PI + 360) % 360;
          return (angleInDegrees >= 90 && angleInDegrees <= 270) ? 'end' : 'start';
        })
        .attr('alignment-baseline', 'middle')
        .attr('fill', '#f9ca24')
        .style('font-size', radius * 0.04)
        .style('opacity', 0.85)
        .text(d => truncateLabel(d.data[labelField], 12));
    }
    
    // Add central circle
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * innerRadius)
      .attr('fill', '#0a0f1c')
      .attr('stroke', '#f9ca24')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.5);
    
    // Add decorative ring
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.98)
      .attr('fill', 'none')
      .attr('stroke', '#f9ca24')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.3);
    
    // Add central text (total value)
    g.append('text')
      .attr('class', 'center-value')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius * 0.02)
      .attr('fill', '#f9ca24')
      .style('font-size', radius * 0.12)
      .style('font-weight', '700')
      .text(formatNumber(totalValue));
    
    g.append('text')
      .attr('class', 'center-label')
      .attr('text-anchor', 'middle')
      .attr('dy', radius * 0.08)
      .attr('fill', '#f9ca24')
      .style('font-size', radius * 0.05)
      .style('opacity', 0.8)
      .text('TOTAL');
    
    // Add animated effect if enabled
    if (animate) {
      arcPaths
        .attr('transform', 'scale(0)')
        .transition()
        .delay((d, i) => i * 50)
        .duration(500)
        .ease(d3.easeBounce)
        .attr('transform', 'scale(1)');
    }
    
    // Add the decorative patterns
    addDecorations(svg, width, height, radius);
    
  }, [data, size, innerRadius, valueField, labelField, title, subtitle, colorRange, showLabels, animate, onSegmentClick, sourceInfo]);
  
  // Helper function to truncate labels
  const truncateLabel = (label, maxLength) => {
    if (!label) return '';
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };
  
  // Helper function to format numbers nicely
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    
    // Format based on magnitude
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else if (Number.isInteger(value)) {
      return value.toString();
    } else {
      return value.toFixed(1);
    }
  };
  
  // Add decorative elements to the visualization
  const addDecorations = (svg, width, height, radius) => {
    const g = svg.select('g');
    
    // Add subtle radial lines
    const lineCount = 60;
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const x1 = Math.sin(angle) * (radius * innerRadius * 1.02);
      const y1 = -Math.cos(angle) * (radius * innerRadius * 1.02);
      const x2 = Math.sin(angle) * (radius * 0.97);
      const y2 = -Math.cos(angle) * (radius * 0.97);
      
      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#f9ca24')
        .attr('stroke-width', 0.2)
        .attr('stroke-opacity', i % 5 === 0 ? 0.5 : 0.15); // Accentuate every 5th line
    }
    
    // Add tick marks around the outer edge
    const tickCount = 24;
    
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2;
      const x1 = Math.sin(angle) * (radius * 1);
      const y1 = -Math.cos(angle) * (radius * 1);
      const x2 = Math.sin(angle) * (radius * 1.03);
      const y2 = -Math.cos(angle) * (radius * 1.03);
      
      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#f9ca24')
        .attr('stroke-width', 0.8)
        .attr('stroke-opacity', 0.4);
    }
  };
  
  // Helper function to get color based on confidence score
  const getConfidenceColor = (score) => {
    if (score >= 0.8) return '#4cd137'; // High confidence - green
    if (score >= 0.6) return '#fbc531'; // Medium confidence - yellow
    return '#e84118'; // Low confidence - red
  };
  
  // Format source name for display
  const formatSourceName = (sourceName) => {
    return sourceName.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  // Show tooltip
  const showTooltip = (event, data) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    
    tooltip.style.opacity = 1;
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 28}px`;
    
    // Set tooltip content
    tooltip.innerHTML = `
      <div class="tooltip-category">${data[labelField]}</div>
      <div class="tooltip-value">
        <span class="value-number">${formatNumber(data[valueField])}</span>
        ${data.units ? `<span class="value-units">${data.units}</span>` : ''}
      </div>
      ${data.percentChange ? `
        <div class="tooltip-change ${parseFloat(data.percentChange) >= 0 ? 'positive' : 'negative'}">
          ${data.percentChange >= 0 ? '↑' : '↓'} ${Math.abs(data.percentChange)}%
        </div>
      ` : ''}
    `;
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    
    tooltip.style.opacity = 0;
  };
  
  return (
    <div className="radial-health-viz-container">
      <svg 
        ref={svgRef}
        width="100%"
        height={height}
        className="source-viz-svg"
      />
      <div 
        ref={tooltipRef}
        className="radial-viz-tooltip"
      />
      
      {/* Styled tooltip will be added here with JS */}
    </div>
  );
};

RadialHealthViz.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueField: PropTypes.string,
  labelField: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  colorRange: PropTypes.arrayOf(PropTypes.string),
  innerRadius: PropTypes.number,
  showLabels: PropTypes.bool,
  animate: PropTypes.bool,
  onSegmentClick: PropTypes.func,
  sourceInfo: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number
};

export default RadialHealthViz;