
import { ReactNode } from 'react';

export interface ArtDecoProps {
  children?: ReactNode;
  className?: string;
}

export interface ArtDecoCardProps extends ArtDecoProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  animation?: 'none' | 'glow' | 'pulse';
  corners?: 'rounded' | 'sharp' | 'decorated';
}

export interface ArtDecoButtonProps extends ArtDecoProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
}

export interface ArtDecoLayoutProps {
  children: ReactNode;
}

export interface ArtDecoThemeProps {
  theme?: 'light' | 'dark' | 'system';
  accentColor?: 'gold' | 'silver' | 'copper' | 'jade';
}
