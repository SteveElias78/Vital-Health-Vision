
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "rounded-md overflow-hidden relative",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-midnight-800 to-midnight-900 border border-gold-500/30",
        accent: "bg-gradient-to-br from-midnight-800 to-midnight-900 border border-gold-500/50",
        minimal: "bg-midnight-900/70 border border-gold-500/20",
        gradient: "bg-gradient-to-br from-midnight-800 via-midnight-900 to-midnight-950 border border-gold-500/30",
      },
      animation: {
        none: "",
        glow: "hover:border-gold-500/70 hover:shadow-[0_0_15px_rgba(255,199,0,0.15)] transition-all duration-300",
        pulse: "art-deco-pulse",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      corners: {
        default: "",
        decorated: "art-deco-decorated-corners",
        large: "art-deco-large-corners",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
      padding: "md",
      corners: "default",
    },
  }
);

export interface ArtDecoCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  headerExtra?: ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export const ArtDecoCard = React.forwardRef<HTMLDivElement, ArtDecoCardProps>(
  ({ 
    className,
    children,
    variant,
    animation,
    padding,
    corners,
    title,
    subtitle,
    footer,
    headerExtra,
    headerClassName,
    bodyClassName,
    footerClassName,
    ...props 
  }, ref) => {
    const hasHeader = title || subtitle || headerExtra;
    
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, animation, padding: hasHeader || footer ? "none" : padding, corners }),
          "art-deco-card",
          className
        )}
        {...props}
      >
        {/* Decorative corners */}
        {corners === "decorated" && (
          <>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500/50" />
          </>
        )}
        
        {corners === "large" && (
          <>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/50" />
          </>
        )}
        
        {hasHeader && (
          <div className={cn(
            "border-b border-gold-500/20 p-4 bg-gradient-to-r from-midnight-800 to-midnight-900",
            headerClassName
          )}>
            <div className="flex justify-between items-center">
              <div>
                {title && <h3 className="font-light text-xl tracking-wide text-gold-400">{title}</h3>}
                {subtitle && <p className="text-sm text-gold-300/70">{subtitle}</p>}
              </div>
              {headerExtra && <div>{headerExtra}</div>}
            </div>
          </div>
        )}
        
        <div className={cn(hasHeader || footer ? padding : "", bodyClassName)}>
          {children}
        </div>
        
        {footer && (
          <div className={cn(
            "border-t border-gold-500/20 p-4 mt-auto",
            footerClassName
          )}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);
ArtDecoCard.displayName = "ArtDecoCard";
