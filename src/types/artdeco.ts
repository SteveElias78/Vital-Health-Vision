
import { ReactNode } from 'react';

// Art Deco Card Types
export interface ArtDecoCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'elegant';
  animate?: boolean;
}

export interface ArtDecoCardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  action?: ReactNode;
}

// Art Deco Button Types
export interface ArtDecoButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'link';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Art Deco Input Types
export interface ArtDecoInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

// Art Deco Divider Types
export interface ArtDecoDividerProps {
  className?: string;
  pattern?: 'line' | 'diamonds' | 'zigzag' | 'dots';
  centered?: boolean;
  text?: string;
}

// Art Deco Badge Types
export interface ArtDecoBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'elegant';
  color?: 'gold' | 'blue' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulsate?: boolean;
}

// Art Deco Stats Card Types
export interface ArtDecoStatsCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  status: 'positive' | 'negative' | 'neutral';
  unit?: string;
  icon?: ReactNode;
  className?: string;
}

// Art Deco Dataset Card Types
export interface ArtDecoDatasetCardProps {
  title: string;
  description: string;
  source: string;
  lastUpdated: string;
  records: string;
  onAnalyze: () => void;
  className?: string;
}

// Art Deco Page Header Types
export interface ArtDecoPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  actions?: ReactNode;
}

// Art Deco Gradient Divider Types  
export interface ArtDecoGradientDividerProps {
  text?: string;
  className?: string;
  gradientClassName?: string;
  textClassName?: string;
  pattern?: 'none' | 'diamonds' | 'zigzag' | 'dots';
}

// Art Deco Visualization Types
export interface ArtDecoRadialChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  width?: number;
  height?: number;
  centerText?: string;
  className?: string;
  onClick?: (segment: string) => void;
}

// Demo Mode Types
export interface DemoIndicatorProps {
  role?: string;
  className?: string;
}
