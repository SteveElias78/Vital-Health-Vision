
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ArtDecoGradientDivider } from './ArtDecoGradientDivider';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface ArtDecoFooterProps {
  brandName?: string;
  logo?: React.ReactNode;
  tagline?: string;
  sections?: FooterSection[];
  copyright?: string;
  className?: string;
  socialLinks?: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  pattern?: 'none' | 'geometric' | 'diamond';
}

export const ArtDecoFooter: React.FC<ArtDecoFooterProps> = ({
  brandName = 'Vital Health Vision',
  logo,
  tagline,
  sections = [],
  copyright = `© ${new Date().getFullYear()} Vital Health Vision. All rights reserved.`,
  className,
  socialLinks = [],
  pattern = 'none'
}) => {
  const renderPattern = () => {
    switch (pattern) {
      case 'geometric':
        return (
          <div className="absolute top-0 left-0 w-full h-8 overflow-hidden opacity-20 pointer-events-none">
            <div className="flex justify-between">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 border-2 border-gold-500/60 transform rotate-45 -translate-y-3"
                ></div>
              ))}
            </div>
          </div>
        );
      case 'diamond':
        return (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="w-8 h-8 bg-midnight-900 border border-gold-500/60 rotate-45"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className={cn(
      "relative border-t border-gold-500/30 bg-gradient-to-b from-midnight-900 to-midnight-950 text-gold-300/90 py-8 mt-auto",
      className
    )}>
      {renderPattern()}
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center">
                {logo && <div className="mr-3">{logo}</div>}
                <h3 className="text-xl font-light tracking-wider text-gold-400">{brandName}</h3>
              </div>
              
              {tagline && (
                <p className="text-sm text-gold-300/70">{tagline}</p>
              )}
              
              {socialLinks.length > 0 && (
                <div className="flex space-x-4 mt-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:text-gold-300 transition-colors art-deco-circle w-8 h-8 flex items-center justify-center border border-gold-500/50 hover:border-gold-500"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Link sections */}
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="md:col-span-1">
              <h4 className="font-light text-gold-400 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gold-300/90 hover:text-gold-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        className="text-sm text-gold-300/90 hover:text-gold-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <ArtDecoGradientDivider className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gold-300/60 text-center md:text-left">
            {copyright}
          </p>
          
          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="text-xs text-gold-300/60 hover:text-gold-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-gold-300/60 hover:text-gold-400">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-xs text-gold-300/60 hover:text-gold-400">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
