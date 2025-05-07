
import React from 'react';

// Function to get CSS variables based on theme intensity
export const getIntensityVars = (intensity: 'subtle' | 'medium' | 'bold') => {
  switch (intensity) {
    case 'subtle':
      return `
        --gold-opacity: 0.6;
        --pattern-opacity: 0.05;
        --glow-intensity: 5px;
      `;
    case 'bold':
      return `
        --gold-opacity: 1;
        --pattern-opacity: 0.15;
        --glow-intensity: 15px;
      `;
    case 'medium':
    default:
      return `
        --gold-opacity: 0.8;
        --pattern-opacity: 0.1;
        --glow-intensity: 10px;
      `;
  }
};

// Component that renders the CSS styles
interface ArtDecoStylesProps {
  intensity: 'subtle' | 'medium' | 'bold';
  animationsEnabled: boolean;
}

export const ArtDecoStyles: React.FC<ArtDecoStylesProps> = ({ intensity, animationsEnabled }) => {
  return (
    <style dangerouslySetInnerHTML={{ 
      __html: `
      :root {
        --gold-50: #FFF9E6;
        --gold-100: #FFF4CC;
        --gold-200: #FFE999;
        --gold-300: #FFDD66;
        --gold-400: #FFD233;
        --gold-500: #FFC700;
        --gold-600: #CCA000;
        --gold-700: #997800;
        --gold-800: #665000;
        --gold-900: #332800;
        
        --midnight-50: #E6E6E9;
        --midnight-100: #CCCED3;
        --midnight-200: #999CA7;
        --midnight-300: #666B7B;
        --midnight-400: #33394F;
        --midnight-500: #000723;
        --midnight-600: #00061C;
        --midnight-700: #000415;
        --midnight-800: #00020F;
        --midnight-900: #000108;
        --midnight-950: #000105;
        
        /* Chart colors - using Art Deco colors */
        --chart-gold: #FFC700;
        --chart-gold-light: #FFDD66;
        --chart-midnight: #000723;
        --chart-navy: #000933;
        --chart-black: #000108;
        
        /* Intensity variables that can be adjusted */
        ${getIntensityVars(intensity)}
      }
      
      /* Art Deco custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--midnight-800);
      }
      
      ::-webkit-scrollbar-thumb {
        background: var(--gold-500);
        border-radius: 2px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: var(--gold-400);
      }
      
      /* Remove animations when animations are disabled */
      .reduce-motion * {
        animation: none !important;
        transition: none !important;
      }
    `}} />
  );
};
