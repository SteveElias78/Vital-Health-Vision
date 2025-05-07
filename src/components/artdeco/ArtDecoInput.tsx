
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "flex w-full rounded-md border bg-midnight-800 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gold-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-gold-500/30 text-gold-300 focus-visible:shadow-[0_0_10px_rgba(255,199,0,0.3)]",
        filled: "border-gold-500/40 bg-midnight-700 text-gold-200 focus-visible:shadow-[0_0_10px_rgba(255,199,0,0.3)]",
        minimal: "border-gold-500/20 bg-midnight-900/70 text-gold-300",
        error: "border-red-500/50 text-red-50 focus-visible:ring-red-500/40",
        success: "border-emerald-500/50 text-emerald-50 focus-visible:ring-emerald-500/40",
      },
      decoration: {
        none: "",
        animated: "art-deco-input-animated",
        underlined: "rounded-none border-0 border-b-2 bg-transparent px-0 focus-visible:shadow-none",
      }
    },
    defaultVariants: {
      variant: "default",
      decoration: "none",
    }
  }
);

export interface ArtDecoInputProps 
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const ArtDecoInput = React.forwardRef<HTMLInputElement, ArtDecoInputProps>(
  ({
    className,
    variant,
    decoration,
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    wrapperClassName,
    type,
    ...props
  }, ref) => {
    const id = React.useId();
    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-light text-gold-300 tracking-wide"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/70 pointer-events-none">
              {leftIcon}
            </span>
          )}
          
          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              inputVariants({ variant, decoration }),
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400/70 pointer-events-none">
              {rightIcon}
            </span>
          )}
          
          {decoration === "animated" && (
            <div className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gold-500 transition-all duration-300 group-focus-within:w-full"></div>
          )}
        </div>
        
        {(helperText || error) && (
          <p className={cn(
            "text-xs",
            error ? "text-red-400" : "text-gold-400/70"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
ArtDecoInput.displayName = "ArtDecoInput";
