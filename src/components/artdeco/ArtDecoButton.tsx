
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-light tracking-wider ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-b from-gold-500 to-gold-600 text-midnight-900 hover:from-gold-400 hover:to-gold-500 shadow-md hover:shadow-lg hover:shadow-gold-500/20",
        secondary: "border border-gold-500 bg-transparent text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 shadow-sm",
        subtle: "bg-midnight-800 text-gold-300 hover:bg-midnight-700 hover:text-gold-200 shadow-sm border border-gold-500/20",
        ghost: "hover:bg-gold-500/10 hover:text-gold-300 text-gold-400",
        link: "text-gold-400 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-midnight-900 bg-size-200 hover:bg-right-bottom font-light shadow-md hover:shadow-lg hover:shadow-gold-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "art-deco-pulse",
        shimmer: "art-deco-shimmer",
      },
      corners: {
        default: "",
        decorated: "art-deco-corners",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      animation: "none",
      corners: "default",
    },
  }
);

export interface ArtDecoButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ArtDecoButton = React.forwardRef<HTMLButtonElement, ArtDecoButtonProps>(
  ({ className, children, variant, size, animation, corners, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, animation, corners, className })
        )}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
        
        {corners === "decorated" && (
          <>
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-500/60"></span>
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-500/60"></span>
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-500/60"></span>
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-500/60"></span>
          </>
        )}
      </button>
    );
  }
);
ArtDecoButton.displayName = "ArtDecoButton";
