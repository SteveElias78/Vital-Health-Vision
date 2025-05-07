
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const navItemVariants = cva(
  "relative flex items-center gap-2 text-sm px-3 py-2 font-light tracking-wide transition-all duration-300",
  {
    variants: {
      variant: {
        default: "text-gold-300 hover:text-gold-400 hover:bg-midnight-800",
        subtle: "text-gold-400/70 hover:text-gold-400 hover:bg-midnight-900/60",
        bordered: "border border-gold-500/30 text-gold-300 hover:text-gold-400 hover:border-gold-500/60",
        underlined: "border-b-2 border-transparent hover:border-gold-500/60 text-gold-300 hover:text-gold-400"
      },
      decoration: {
        none: "",
        diamond: "group",
        corners: "group",
        glow: "hover:shadow-[0_0_10px_rgba(255,199,0,0.15)]",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
      active: {
        true: "bg-midnight-800 text-gold-400 font-normal before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gold-500",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      decoration: "none",
      size: "default",
      active: false,
    },
  }
);

export interface ArtDecoNavItemProps 
  extends VariantProps<typeof navItemVariants> {
  href?: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
}

export const ArtDecoNavItem: React.FC<ArtDecoNavItemProps> = ({
  href,
  icon,
  label,
  onClick,
  className,
  variant,
  decoration,
  size,
  active,
  external
}) => {
  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      
      {decoration === "diamond" && (
        <span className="absolute left-1/2 bottom-0.5 w-1 h-1 bg-gold-500/0 group-hover:bg-gold-500/80 transform -translate-x-1/2 rotate-45 transition-all duration-300"></span>
      )}
      
      {decoration === "corners" && (
        <>
          <span className="absolute top-0 left-0 w-0 h-0 border-t border-l border-gold-500/0 group-hover:border-gold-500/60 transition-all duration-300 group-hover:w-2 group-hover:h-2"></span>
          <span className="absolute top-0 right-0 w-0 h-0 border-t border-r border-gold-500/0 group-hover:border-gold-500/60 transition-all duration-300 group-hover:w-2 group-hover:h-2"></span>
          <span className="absolute bottom-0 left-0 w-0 h-0 border-b border-l border-gold-500/0 group-hover:border-gold-500/60 transition-all duration-300 group-hover:w-2 group-hover:h-2"></span>
          <span className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-gold-500/0 group-hover:border-gold-500/60 transition-all duration-300 group-hover:w-2 group-hover:h-2"></span>
        </>
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(navItemVariants({ variant, decoration, size, active }), className)}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }
    
    return (
      <Link 
        to={href}
        className={cn(navItemVariants({ variant, decoration, size, active }), className)}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }
  
  return (
    <button 
      className={cn(navItemVariants({ variant, decoration, size, active }), className)}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
};

export default ArtDecoNavItem;
