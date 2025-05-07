
import React from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoRadialChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  width?: number;
  height?: number;
  centerLabel?: string;
  className?: string;
  chartClassName?: string;
  segmentClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const ArtDecoRadialChart: React.FC<ArtDecoRadialChartProps> = ({
  data,
  width = 300,
  height = 300,
  centerLabel,
  className,
  chartClassName,
  segmentClassName,
  labelClassName,
  valueClassName
}) => {
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.6;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Color palette for the chart segments
  const defaultColors = [
    '#FFC700', // Gold
    '#FFDD66', // Light Gold
    '#CCA000', // Dark Gold
    '#000723', // Midnight
    '#000415', // Dark Midnight
  ];
  
  let startAngle = 0;
  
  return (
    <div className={cn("relative", className)}>
      <svg 
        width={width} 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("art-deco-radial-chart", chartClassName)}
      >
        {/* Decorative Art Deco outer ring */}
        <circle 
          cx={centerX}
          cy={centerY}
          r={radius - 2}
          fill="none"
          stroke="rgba(255, 199, 0, 0.3)"
          strokeWidth={1}
          className="art-deco-chart-ring"
        />
        
        {/* Create the pie segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const endAngle = startAngle + angle;
          
          // SVG Arc calculation
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);
          
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          // Path for the segment
          const pathData = `
            M ${centerX} ${centerY}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `;
          
          const segmentColor = item.color || defaultColors[index % defaultColors.length];
          
          // Calculate position for the label (in the middle of the segment)
          const labelRad = startRad + (endRad - startRad) / 2;
          const labelRadius = radius * 0.8; // Place labels at 80% of radius
          const labelX = centerX + labelRadius * Math.cos(labelRad);
          const labelY = centerY + labelRadius * Math.sin(labelRad);
          
          // Save the end angle as the next start angle
          const currentStartAngle = startAngle;
          startAngle = endAngle;
          
          return (
            <g key={index} className={cn("art-deco-chart-segment", segmentClassName)}>
              <path
                d={pathData}
                fill={segmentColor}
                stroke="#000108"
                strokeWidth={1}
                opacity={0.85}
              />
              
              {/* Only add labels for segments that are large enough */}
              {percentage > 5 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFF9E6"
                  fontSize="10"
                  fontWeight="light"
                  className={cn("art-deco-chart-label", labelClassName)}
                >
                  {item.name}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Inner circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="#000108"
          stroke="rgba(255, 199, 0, 0.4)"
          strokeWidth={1}
        />
        
        {/* Center text */}
        {centerLabel && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFDD66"
            fontSize="14"
            fontWeight="light"
            className={cn("art-deco-chart-center-label", valueClassName)}
          >
            {centerLabel}
          </text>
        )}
        
        {/* Art Deco decorative elements */}
        <circle 
          cx={centerX}
          cy={centerY}
          r={radius + 5}
          fill="none"
          stroke="rgba(255, 199, 0, 0.2)"
          strokeWidth={0.5}
          strokeDasharray="4 2"
        />
      </svg>
    </div>
  );
};
