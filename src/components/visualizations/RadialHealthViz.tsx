
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  label: string;
  value: number;
  units?: string;
  percentChange?: string;
  [key: string]: any;
}

interface RadialHealthVizProps {
  data: DataPoint[];
  valueField?: string;
  labelField?: string;
  title?: string;
  subtitle?: string;
  colorRange?: string[];
  innerRadius?: number;
  showLabels?: boolean;
  animate?: boolean;
  onSegmentClick?: (data: DataPoint) => void;
}

const RadialHealthViz: React.FC<RadialHealthVizProps> = ({
  data = [],
  valueField = 'value',
  labelField = 'label',
  title = 'Health Insights',
  subtitle = '',
  colorRange = ['#f9ca24', '#f0932b', '#d4a010', '#c48c0c', '#a37707', '#826006'],
  innerRadius = 0.3,
  showLabels = true,
  animate = true,
  onSegmentClick = () => {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoveredSegment, setHoveredSegment] = useState<DataPoint | null>(null);

  // Set up resize observer to make the visualization responsive
  useEffect(() => {
    if (!svgRef.current) return;

    const updateSize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        // Make it square based on the smaller dimension
        const width = container.clientWidth;
        const height = container.clientHeight;
        const size = Math.min(width, height);
        setSize({ width: size, height: size });
      }
    };

    // Initial size
    updateSize();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateSize);
    if (svgRef.current.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Create and update the visualization
  useEffect(() => {
    if (!svgRef.current || !data.length || size.width === 0) return;

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
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d[labelField]))
      .range(colorRange);

    // Create the pie layout
    const pie = d3.pie<DataPoint>()
      .value(d => d[valueField])
      .sort(null);

    // Create the arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * innerRadius)
      .outerRadius(radius)
      .cornerRadius(3)
      .padAngle(0.01);

    // Smaller arc for labels
    const labelArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 1.05)
      .outerRadius(radius * 1.05);

    // Create a group for the visualization
    const g = svg.select('g');

    // Add title
    g.append('text')
      .attr('class', 'viz-title')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius * 1.15)
      .attr('fill', '#f9ca24')
      .style('font-size', `${radius * 0.08}px`)
      .style('font-weight', '700')
      .text(title);

    if (subtitle) {
      g.append('text')
        .attr('class', 'viz-subtitle')
        .attr('text-anchor', 'middle')
        .attr('dy', -radius * 1.05)
        .attr('fill', '#f9ca24')
        .style('opacity', 0.8)
        .style('font-size', `${radius * 0.05}px`)
        .text(subtitle);
    }

    // Create and add the segments
    const segments = g.selectAll('.segment')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'segment');

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
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('transform', 'translate(0, 0)');
        
        setHoveredSegment(null);
      })
      .on('click', (event, d) => {
        onSegmentClick(d.data);
      });

    // Add hover effect
    function calculateSegmentOffset(d: d3.PieArcDatum<DataPoint>) {
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
        .style('font-size', `${radius * 0.04}px`)
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
    const totalValue = data.reduce((sum, item) => sum + parseFloat(item[valueField]?.toString() || '0'), 0);
    
    g.append('text')
      .attr('class', 'center-value')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius * 0.02)
      .attr('fill', '#f9ca24')
      .style('font-size', `${radius * 0.12}px`)
      .style('font-weight', '700')
      .text(formatNumber(totalValue));

    g.append('text')
      .attr('class', 'center-label')
      .attr('text-anchor', 'middle')
      .attr('dy', radius * 0.08)
      .attr('fill', '#f9ca24')
      .style('font-size', `${radius * 0.05}px`)
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

  }, [data, size, innerRadius, valueField, labelField, title, subtitle, colorRange, showLabels, animate, onSegmentClick]);

  // Helper function to truncate labels
  const truncateLabel = (label: string | undefined, maxLength: number): string => {
    if (!label) return '';
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  // Helper function to format numbers nicely
  const formatNumber = (value: number): string => {
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
  const addDecorations = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, radius: number) => {
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

  return (
    <div className="radial-health-viz-container">
      <svg ref={svgRef} />
      {hoveredSegment && (
        <div className="radial-viz-tooltip">
          <div className="tooltip-label">{hoveredSegment[labelField]}</div>
          <div className="tooltip-value">
            <span className="value-number">{formatNumber(hoveredSegment[valueField])}</span>
            {hoveredSegment.units && <span className="value-units">{hoveredSegment.units}</span>}
          </div>
          {hoveredSegment.percentChange && (
            <div className={`tooltip-change ${parseFloat(hoveredSegment.percentChange) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(hoveredSegment.percentChange) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(hoveredSegment.percentChange))}%
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .radial-health-viz-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
          background-color: #0a0f1c;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radial-viz-tooltip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(10, 15, 28, 0.85);
          border: 1px solid rgba(249, 202, 36, 0.5);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          pointer-events: none;
          z-index: 10;
          text-align: center;
          min-width: 150px;
        }

        .tooltip-label {
          color: #f9ca24;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .tooltip-value {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .value-units {
          font-size: 0.8rem;
          opacity: 0.7;
          margin-left: 0.25rem;
        }

        .tooltip-change {
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        .tooltip-change.positive {
          color: #2ecc71;
          background-color: rgba(46, 204, 113, 0.15);
        }

        .tooltip-change.negative {
          color: #e74c3c;
          background-color: rgba(231, 76, 60, 0.15);
        }
      `}</style>
    </div>
  );
};

export default RadialHealthViz;
