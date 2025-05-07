
import { useEffect, RefObject } from 'react';
import * as d3 from 'd3';
import { DataPoint } from './index';

interface UseRadialVisualizationProps {
  svgRef: RefObject<SVGSVGElement>;
  data: DataPoint[];
  size: { width: number, height: number } | undefined;
  innerRadius: number;
  valueField: string;
  labelField: string;
  title: string;
  subtitle: string;
  colorRange: string[];
  showLabels: boolean;
  animate: boolean;
  onSegmentClick: (data: DataPoint) => void;
  setHoveredSegment: (data: DataPoint | null) => void;
}

export function useRadialVisualization({
  svgRef,
  data,
  size,
  innerRadius,
  valueField,
  labelField,
  title,
  subtitle,
  colorRange,
  showLabels,
  animate,
  onSegmentClick,
  setHoveredSegment
}: UseRadialVisualizationProps) {
  useEffect(() => {
    if (!svgRef.current || !data.length || !size) return;

    const svg = d3.select(svgRef.current);
    const width = size.width;
    const height = size.height;
    const radius = Math.min(width, height) / 2;
    
    // Clear previous elements
    svg.selectAll('*').remove();
    
    // Set SVG size
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
      
    // Create the central group element
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
      
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d[labelField] as string))
      .range(colorRange);
      
    // Calculate total value for percentage
    const totalValue = d3.sum(data, d => Number(d[valueField]));

    // Create pie layout
    const pie = d3.pie<DataPoint>()
      .value(d => Number(d[valueField]))
      .sort(null);
      
    // Create arc generator for segments
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * innerRadius)
      .outerRadius(radius * 0.8);
      
    // Create arc generator for labels
    const labelArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.85)
      .outerRadius(radius * 0.85);
      
    // Create the pie chart segments
    const segments = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
      
    // Add segment paths
    const paths = segments
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(d.data[labelField] as string) as string)
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .style('opacity', 0.85)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('filter', 'url(#gold-glow)')
          .style('opacity', 1);
        
        setHoveredSegment(d.data);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('filter', null)
          .style('opacity', 0.85);
          
        setHoveredSegment(null);
      })
      .on('click', (_, d) => onSegmentClick(d.data));
      
    // Animation effect
    if (animate) {
      paths.transition()
        .duration(1000)
        .attrTween('d', function(d) {
          const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
          return function(t) {
            return arc(interpolate(t));
          };
        });
    }
    
    // Add labels if enabled
    if (showLabels) {
      segments
        .append('text')
        .attr('transform', d => {
          const centroid = labelArc.centroid(d);
          const x = centroid[0];
          const y = centroid[1];
          const h = Math.sqrt(x * x + y * y);
          return `translate(${x / h * radius * 0.9},${y / h * radius * 0.9})`;
        })
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '300')
        .style('fill', '#FFC700')
        .style('opacity', 0.9)
        .style('pointer-events', 'none')
        .text(d => {
          // Only show label if segment is large enough
          const angleSize = d.endAngle - d.startAngle;
          return angleSize > 0.2 ? d.data[labelField] as string : '';
        });
    }
    
    // Add title
    g.append('text')
      .attr('class', 'title')
      .attr('text-anchor', 'middle')
      .attr('y', -10)
      .style('font-size', '16px')
      .style('font-weight', '300')
      .style('fill', '#FFC700')
      .text(title);
      
    // Add subtitle
    if (subtitle) {
      g.append('text')
        .attr('class', 'subtitle')
        .attr('text-anchor', 'middle')
        .attr('y', 15)
        .style('font-size', '12px')
        .style('font-weight', '300')
        .style('fill', '#FFC700')
        .style('opacity', 0.7)
        .text(subtitle);
    }
    
    // Create central circle
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * innerRadius)
      .attr('fill', '#000723')
      .attr('stroke', '#FFC700')
      .attr('stroke-width', 1)
      .style('opacity', 0.9);
      
    // Add total or average value in the center
    const averageValue = (totalValue / data.length).toFixed(1);
    g.append('text')
      .attr('class', 'center-value')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .style('font-size', '18px')
      .style('font-weight', '400')
      .style('fill', '#FFC700')
      .text(averageValue);
      
    // Add radiating lines (Art Deco rays)
    const rayCount = 36;
    const rayG = g.append('g').attr('class', 'rays');
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * 360 / rayCount) * (Math.PI / 180);
      const x1 = Math.cos(angle) * (radius * innerRadius - 5);
      const y1 = Math.sin(angle) * (radius * innerRadius - 5);
      const x2 = Math.cos(angle) * (radius * 0.9);
      const y2 = Math.sin(angle) * (radius * 0.9);
      
      rayG.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#FFC700')
        .attr('stroke-width', i % 4 === 0 ? 1 : 0.5)
        .attr('opacity', i % 4 === 0 ? 0.3 : 0.1);
    }
    
    // Add Art Deco geometric patterns around border
    const patternG = g.append('g').attr('class', 'art-deco-pattern');
    const patternCount = 18;
    
    for (let i = 0; i < patternCount; i++) {
      const angle = (i * 360 / patternCount) * (Math.PI / 180);
      const x = Math.cos(angle) * (radius * 0.95);
      const y = Math.sin(angle) * (radius * 0.95);
      
      // Art Deco triangular ornament
      patternG.append('path')
        .attr('d', `M ${x} ${y} L ${x + Math.cos(angle) * 10} ${y + Math.sin(angle) * 10} L ${x + Math.cos(angle + Math.PI/6) * 8} ${y + Math.sin(angle + Math.PI/6) * 8} Z`)
        .attr('fill', 'none')
        .attr('stroke', '#FFC700')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.4);
    }
    
    // Add gold glow filter
    const defs = svg.append('defs');
    
    const glowFilter = defs.append('filter')
      .attr('id', 'gold-glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
      
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'blur');
      
    const feComponentTransfer = glowFilter.append('feComponentTransfer')
      .attr('in', 'blur')
      .attr('result', 'glow');
      
    feComponentTransfer.append('feFuncR')
      .attr('type', 'linear')
      .attr('slope', '1.5')
      .attr('intercept', '0');
      
    feComponentTransfer.append('feFuncG')
      .attr('type', 'linear')
      .attr('slope', '1.2')
      .attr('intercept', '0');
      
    feComponentTransfer.append('feFuncB')
      .attr('type', 'linear')
      .attr('slope', '0')
      .attr('intercept', '0.3');
      
    const feMerge = glowFilter.append('feMerge');
    
    feMerge.append('feMergeNode')
      .attr('in', 'glow');
      
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
  
  }, [svgRef, data, size, innerRadius, valueField, labelField, title, subtitle, colorRange, showLabels, animate, onSegmentClick, setHoveredSegment]);
}
