import React from 'react';
import { RadialChartDataPoint, mapToRadialChartData } from '@/types/visualization';

interface ArtDecoRadialChartProps {
  data: RadialChartDataPoint[] | any[];
  centerText?: string;
  centerLabel?: string; // For backward compatibility
  centerValue?: number | string;
  unit?: string;
  width?: number;
  height?: number;
}

/**
 * Art Deco Radial Chart component for visualizing data in a circular format
 */
export const ArtDecoRadialChart: React.FC<ArtDecoRadialChartProps> = ({ 
  data = [], 
  centerText = 'Average', 
  centerLabel, // For backward compatibility
  centerValue = 0,
  unit = '%',
  width = 280,
  height = 280
}) => {
  // Chart configuration
  const radius = 100;
  const centerRadius = 50;
  const segmentWidth = 30;
  const size = width || 280;
  const center = size / 2;
  
  // Use centerLabel as fallback for backward compatibility
  const displayCenterText = centerText || centerLabel || 'Average';
  
  // Convert data to the expected format if needed
  const processedData = Array.isArray(data) && data.length > 0 && 'category' in data[0] 
    ? data as RadialChartDataPoint[]
    : mapToRadialChartData(data);
  
  // Calculate total for percentage calculations
  const total = processedData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate angles for each segment
  let currentAngle = 0;
  const segments = processedData.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    return {
      ...item,
      startAngle,
      endAngle,
      percentage
    };
  });
  
  // SVG path generator for radial segments
  const createRadialPath = (segment: typeof segments[0], innerRadius: number, outerRadius: number) => {
    const startAngleRad = (segment.startAngle - 90) * Math.PI / 180;
    const endAngleRad = (segment.endAngle - 90) * Math.PI / 180;
    
    const innerStartX = center + innerRadius * Math.cos(startAngleRad);
    const innerStartY = center + innerRadius * Math.sin(startAngleRad);
    const innerEndX = center + innerRadius * Math.cos(endAngleRad);
    const innerEndY = center + innerRadius * Math.sin(endAngleRad);
    
    const outerStartX = center + outerRadius * Math.cos(startAngleRad);
    const outerStartY = center + outerRadius * Math.sin(startAngleRad);
    const outerEndX = center + outerRadius * Math.cos(endAngleRad);
    const outerEndY = center + outerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
    
    // Generate the path with Art Deco styling
    return `
      M ${innerStartX} ${innerStartY}
      L ${outerStartX} ${outerStartY}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };
  
  // Generate decorative elements - radial lines
  const createDecorativeLines = () => {
    const lines = [];
    const numLines = 36; // Divide circle into 36 segments (every 10 degrees)
    
    for (let i = 0; i < numLines; i++) {
      const angle = (i * 360 / numLines - 90) * Math.PI / 180;
      const innerRadius = centerRadius - 5;
      const outerRadius = centerRadius + segmentWidth + 10;
      
      const x1 = center + innerRadius * Math.cos(angle);
      const y1 = center + innerRadius * Math.sin(angle);
      const x2 = center + outerRadius * Math.cos(angle);
      const y2 = center + outerRadius * Math.sin(angle);
      
      // Make some lines more prominent for Art Deco effect
      const strokeWidth = i % 6 === 0 ? 0.8 : 0.3;
      const opacity = i % 6 === 0 ? 0.7 : 0.3;
      
      lines.push(
        <line 
          key={`line-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#FFC700"
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    }
    
    return lines;
  };

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <svg width={width} height={height} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background decorative elements */}
        <circle 
          cx={center} 
          cy={center} 
          r={centerRadius + segmentWidth + 10} 
          fill="none" 
          stroke="#FFC700" 
          strokeWidth="0.5" 
          opacity="0.3"
        />
        
        <circle 
          cx={center} 
          cy={center} 
          r={centerRadius - 5} 
          fill="none" 
          stroke="#FFC700" 
          strokeWidth="0.5" 
          opacity="0.3"
        />
        
        {/* Decorative radial lines */}
        {createDecorativeLines()}
        
        {/* Data segments */}
        {segments.map((segment, index) => (
          <g key={`segment-${index}`}>
            <path 
              d={createRadialPath(segment, centerRadius, centerRadius + segmentWidth)}
              fill={segment.color || `hsl(${index * 45}, 70%, 60%)`}
              opacity="0.9"
              stroke="#000"
              strokeWidth="0.5"
            >
              <title>{`${segment.category}: ${segment.value.toFixed(1)}${unit}`}</title>
            </path>
            
            {/* Text labels - only for segments with enough space */}
            {segment.percentage > 0.1 && (
              <text
                x={center + (centerRadius + segmentWidth / 2) * Math.cos(((segment.startAngle + segment.endAngle) / 2 - 90) * Math.PI / 180)}
                y={center + (centerRadius + segmentWidth / 2) * Math.sin(((segment.startAngle + segment.endAngle) / 2 - 90) * Math.PI / 180)}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="10"
                fill="#fff"
                fontWeight="300"
                transform={`rotate(${(segment.startAngle + segment.endAngle) / 2}, 
                  ${center + (centerRadius + segmentWidth / 2) * Math.cos(((segment.startAngle + segment.endAngle) / 2 - 90) * Math.PI / 180)}, 
                  ${center + (centerRadius + segmentWidth / 2) * Math.sin(((segment.startAngle + segment.endAngle) / 2 - 90) * Math.PI / 180)})`}
              >
                {segment.category}
              </text>
            )}
          </g>
        ))}
        
        {/* Center circle with value */}
        <circle 
          cx={center} 
          cy={center} 
          r={centerRadius - 5} 
          fill="#000723" 
          stroke="#FFC700" 
          strokeWidth="1"
        />
        
        <text
          x={center}
          y={center - 12}
          textAnchor="middle"
          fontSize="12"
          fill="#FFC700"
          fontWeight="300"
        >
          {displayCenterText}
        </text>
        
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          fontSize="24"
          fill="#FFC700"
          fontWeight="400"
        >
          {typeof centerValue === 'number' ? centerValue.toFixed(1) : centerValue}
          <tspan fontSize="14">{unit}</tspan>
        </text>
      </svg>
    </div>
  );
};

// Export the type so it can be used by other components
export type { RadialChartDataPoint };

export default ArtDecoRadialChart;
