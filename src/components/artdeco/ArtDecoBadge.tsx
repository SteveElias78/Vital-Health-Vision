
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 rounded text-xs font-light tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-gold-500/20 text-gold-400 border border-gold-500/30",
        outline: "bg-transparent border border-gold-500/50 text-gold-400",
        subtle: "bg-midnight-800 text-gold-300 border border-gold-500/20",
        success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        danger: "bg-red-500/20 text-red-300 border border-red-500/30",
        info: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface ArtDecoBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ArtDecoBadge = React.forwardRef<HTMLSpanElement, ArtDecoBadgeProps>(
  ({ className, variant, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </span>
    );
  }
);
ArtDecoBadge.displayName = "ArtDecoBadge";
