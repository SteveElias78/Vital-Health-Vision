
import React, { ReactNode } from 'react';

export interface ChartConfig {
  [key: string]: any; // Index signature for string keys
  male?: {
    theme: {
      light: string;
      dark: string;
    };
  };
  female?: {
    theme: {
      light: string;
      dark: string;
    };
  };
}

interface ChartContainerProps {
  children: ReactNode;
  config?: ChartConfig;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  config, 
  className = "" 
}) => {
  return (
    <div className={`chart-container ${className}`}>
      {children}
    </div>
  );
};

// Adding the ChartTooltip export that was missing
export const ChartTooltip = (props: any) => {
  // Simply pass all props to the Tooltip component from recharts
  return props.children;
};

export const ChartTooltipContent: React.FC<any> = (props) => {
  const { active, payload, label } = props;
  
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  return (
    <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
      <p className="font-medium">{label}</p>
      <div className="mt-1">
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    </div>
  );
};
