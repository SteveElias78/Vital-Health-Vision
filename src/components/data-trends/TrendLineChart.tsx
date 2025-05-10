
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceArea, Brush
} from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendDataPoint, ZoomDomain } from './types';

interface TrendLineChartProps {
  data: TrendDataPoint[];
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
  handlePointClick: (data: any, index: number) => void;
  refAreaLeft: string | null;
  refAreaRight: string | null;
}

export function TrendLineChart({
  data,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handlePointClick,
  refAreaLeft,
  refAreaRight
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="month" 
          allowDataOverflow={true}
        />
        <YAxis allowDataOverflow={true} />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={{ strokeDasharray: '3 3', strokeWidth: 1 }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="Heart Disease" 
          stroke="#8B5CF6" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ 
            r: 8,
            onClick: (data: any) => handlePointClick(data.payload, data.index)
          }}
          isAnimationActive={true}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="Diabetes" 
          stroke="#0EA5E9" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ 
            r: 8,
            onClick: (data: any) => handlePointClick(data.payload, data.index)
          }}
          isAnimationActive={true}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="Obesity" 
          stroke="#F97316" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ 
            r: 8,
            onClick: (data: any) => handlePointClick(data.payload, data.index)
          }}
          isAnimationActive={true}
          animationDuration={1000}
        />
        <Brush dataKey="month" height={30} stroke="#8b5cf6" />
        {refAreaLeft && refAreaRight ? (
          <ReferenceArea
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
            fill="#8884d8"
            fillOpacity={0.3}
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}
