
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface RadialChartDataPoint {
  id: string | number;
  value: number;
  label?: string;
  color?: string;
}

export interface ArtDecoRadialChartProps {
  data: RadialChartDataPoint[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  arcPadding?: number;
  animationDuration?: number;
  showLabels?: boolean;
  tooltipEnabled?: boolean;
  className?: string;
  onArcClick?: (data: RadialChartDataPoint) => void;
  centerContent?: React.ReactNode;
}

export const ArtDecoRadialChart: React.FC<ArtDecoRadialChartProps> = ({
  data,
  width = 300,
  height = 300,
  innerRadius = 60,
  outerRadius = 120,
  arcPadding = 2,
  animationDuration = 800,
  showLabels = false,
  tooltipEnabled = true,
  className,
  onArcClick,
  centerContent
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeSegment, setActiveSegment] = useState<RadialChartDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Default Art Deco colors if none are provided in data
  const defaultColors = [
    "#FFC700", // Gold
    "#FFDD66", // Light gold
    "#CCA000", // Dark gold
    "#997800", // Deeper gold
    "#332800"  // Very dark gold
  ];

  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    
    const svg = svgRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    
    // Clear existing elements
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Add background circle with Art Deco pattern
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', centerX.toString());
    bgCircle.setAttribute('cy', centerY.toString());
    bgCircle.setAttribute('r', outerRadius.toString());
    bgCircle.setAttribute('fill', 'url(#artDecoPattern)');
    bgCircle.setAttribute('opacity', '0.1');
    svg.appendChild(bgCircle);
    
    // Create defs for Art Deco pattern
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Create pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'artDecoPattern');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '10');
    pattern.setAttribute('height', '10');
    
    // Create pattern content
    const patternRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    patternRect.setAttribute('width', '5');
    patternRect.setAttribute('height', '5');
    patternRect.setAttribute('fill', '#FFC700');
    patternRect.setAttribute('opacity', '0.3');
    
    const patternRect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    patternRect2.setAttribute('x', '5');
    patternRect2.setAttribute('y', '5');
    patternRect2.setAttribute('width', '5');
    patternRect2.setAttribute('height', '5');
    patternRect2.setAttribute('fill', '#FFC700');
    patternRect2.setAttribute('opacity', '0.3');
    
    pattern.appendChild(patternRect);
    pattern.appendChild(patternRect2);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    // Create group for arcs with transform to center
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${centerX}, ${centerY})`);
    svg.appendChild(g);
    
    // Draw arcs
    let startAngle = 0;
    data.forEach((item, i) => {
      const percentage = item.value / total;
      const angleSize = percentage * 2 * Math.PI;
      const endAngle = startAngle + angleSize;
      
      // Calculate path
      const startX = innerRadius * Math.sin(startAngle);
      const startY = -innerRadius * Math.cos(startAngle);
      const endX = innerRadius * Math.sin(endAngle);
      const endY = -innerRadius * Math.cos(endAngle);
      
      const startOuterX = outerRadius * Math.sin(startAngle);
      const startOuterY = -outerRadius * Math.cos(startAngle);
      const endOuterX = outerRadius * Math.sin(endAngle);
      const endOuterY = -outerRadius * Math.cos(endAngle);
      
      const largeArcFlag = angleSize > Math.PI ? 1 : 0;
      
      // Create path for arc
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathData = [
        `M ${startX} ${startY}`,
        `L ${startOuterX} ${startOuterY}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}`,
        `L ${endX} ${endY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startX} ${startY}`,
        'Z'
      ].join(' ');
      
      path.setAttribute('d', pathData);
      path.setAttribute('fill', item.color || defaultColors[i % defaultColors.length]);
      path.setAttribute('stroke', '#000723');
      path.setAttribute('stroke-width', arcPadding.toString());
      path.setAttribute('data-id', item.id.toString());
      path.setAttribute('opacity', '0');
      
      // Animation
      const animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animation.setAttribute('attributeName', 'opacity');
      animation.setAttribute('from', '0');
      animation.setAttribute('to', '1');
      animation.setAttribute('dur', `${animationDuration}ms`);
      animation.setAttribute('fill', 'freeze');
      path.appendChild(animation);
      
      // Handle interaction
      path.onmouseenter = (event) => {
        path.setAttribute('opacity', '0.8');
        if (tooltipEnabled) {
          setActiveSegment(item);
          const rect = svg.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          setTooltipPosition({ x, y });
        }
      };
      
      path.onmouseleave = () => {
        path.setAttribute('opacity', '1');
        if (tooltipEnabled) {
          setActiveSegment(null);
        }
      };
      
      if (onArcClick) {
        path.onclick = () => {
          onArcClick(item);
        };
      }
      
      g.appendChild(path);
      
      // Add labels if enabled
      if (showLabels && item.label) {
        const midAngle = startAngle + (angleSize / 2);
        const labelRadius = outerRadius + 20;
        const labelX = labelRadius * Math.sin(midAngle);
        const labelY = -labelRadius * Math.cos(midAngle);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX.toString());
        label.setAttribute('y', labelY.toString());
        label.setAttribute('text-anchor', midAngle > Math.PI ? 'end' : 'start');
        label.setAttribute('dominant-baseline', 'middle');
        label.setAttribute('fill', '#FFC700');
        label.setAttribute('font-size', '12');
        label.setAttribute('opacity', '0');
        label.textContent = item.label;
        
        const labelAnimation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        labelAnimation.setAttribute('attributeName', 'opacity');
        labelAnimation.setAttribute('from', '0');
        labelAnimation.setAttribute('to', '1');
        labelAnimation.setAttribute('dur', `${animationDuration + 200}ms`);
        labelAnimation.setAttribute('fill', 'freeze');
        label.appendChild(labelAnimation);
        
        g.appendChild(label);
      }
      
      startAngle = endAngle;
    });
    
    // Add center circle with gradient
    if (innerRadius > 0) {
      const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerCircle.setAttribute('cx', '0');
      centerCircle.setAttribute('cy', '0');
      centerCircle.setAttribute('r', innerRadius.toString());
      centerCircle.setAttribute('fill', 'url(#centerGradient)');
      centerCircle.setAttribute('stroke', '#FFC700');
      centerCircle.setAttribute('stroke-width', '1');
      centerCircle.setAttribute('stroke-opacity', '0.3');
      
      // Create gradient
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      gradient.setAttribute('id', 'centerGradient');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#000723');
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#00020F');
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
      
      g.appendChild(centerCircle);
    }
    
  }, [data, width, height, innerRadius, outerRadius, arcPadding]);

  return (
    <div className={cn("relative inline-block", className)}>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        className="art-deco-radial-chart"
      />
      
      {/* Center content */}
      {centerContent && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ maxWidth: innerRadius * 1.8 }}
        >
          {centerContent}
        </div>
      )}
      
      {/* Tooltip */}
      {tooltipEnabled && activeSegment && (
        <div 
          className="absolute bg-midnight-900 border border-gold-500/30 rounded px-3 py-1.5 text-xs z-10 shadow-lg"
          style={{ 
            left: tooltipPosition.x + 10, 
            top: tooltipPosition.y - 20,
            pointerEvents: 'none'
          }}
        >
          <div className="font-light text-gold-400">
            {activeSegment.label || activeSegment.id}
          </div>
          <div className="text-gold-300">
            {activeSegment.value}
          </div>
        </div>
      )}
    </div>
  );
};
