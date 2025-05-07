
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Art Deco styled card wrapper - use this to wrap existing cards
 */
export const ArtDecoCard = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950",
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Art Deco styled card header
 */
export const ArtDecoCardHeader = ({ 
  title, 
  description, 
  className = '' 
}: { 
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4",
      className
    )}>
      {title && <h3 className="text-xl font-light text-gold-400">{title}</h3>}
      {description && <p className="text-sm text-gold-300/70">{description}</p>}
    </div>
  );
};

/**
 * Art Deco styled button
 */
export const ArtDecoButton = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    primary?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  }
>(({ children, primary = false, className = '', leftIcon, rightIcon, ...props }, ref) => {
  const baseClasses = primary 
    ? "bg-gradient-to-r from-gold-600 to-gold-500 text-midnight-900 font-medium"
    : "bg-midnight-800 hover:bg-midnight-700 text-gold-400 border border-gold-500/30";
    
  return (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded transition-colors flex items-center justify-center",
        baseClasses,
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});
ArtDecoButton.displayName = "ArtDecoButton";

/**
 * Art Deco styled input
 */
export const ArtDecoInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  }
>(({ className = '', leftIcon, rightIcon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "bg-midnight-800 border border-gold-500/30 text-gold-50 rounded-md px-4 py-2 w-full focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-500",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );
});
ArtDecoInput.displayName = "ArtDecoInput";

/**
 * Art Deco decorative divider
 */
export const ArtDecoDivider = ({ 
  centered = false,
  className = ''
}: { 
  centered?: boolean;
  className?: string;
}) => {
  if (centered) {
    return (
      <div className={cn("flex items-center justify-center my-4", className)}>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
        <div className="mx-2 w-4 h-4 rounded-full border border-gold-500/50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gold-500/20"></div>
        </div>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className={cn("h-px w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent my-4", className)}></div>
  );
};

/**
 * Art Deco page header
 */
export const ArtDecoPageHeader = ({ 
  title, 
  subtitle, 
  className = '' 
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("border-b border-gold-500/30 pb-4 mb-6", className)}>
      <h1 className="text-3xl font-light text-gold-400">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-gold-300/70">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Art Deco badge component
 */
export const ArtDecoBadge = ({
  children,
  variant = 'default',
  className = ''
}: {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'subtle';
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
    outline: 'bg-transparent border border-gold-500/50 text-gold-400',
    subtle: 'bg-midnight-800 text-gold-300 border border-gold-500/20'
  };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-light tracking-wide",
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
};
