
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
      
      body {
        background: linear-gradient(135deg, var(--midnight-900), var(--midnight-800));
        color: var(--gold-300);
        min-height: 100vh;
      }
      
      /* Art Deco Input Styling */
      .art-deco-input {
        background-color: var(--midnight-800);
        border: 1px solid rgba(255, 199, 0, var(--gold-opacity));
        color: var(--gold-100);
      }
      
      .art-deco-input:focus {
        border-color: var(--gold-400);
        box-shadow: 0 0 0 2px rgba(255, 199, 0, 0.2);
      }
      
      /* Art Deco Button Styling */
      .art-deco-button {
        background-color: var(--gold-600);
        color: var(--midnight-900);
        border: 1px solid var(--gold-500);
        transition: all 0.2s ease;
      }
      
      .art-deco-button:hover {
        background-color: var(--gold-500);
        border-color: var(--gold-400);
        box-shadow: 0 0 var(--glow-intensity) rgba(255, 199, 0, 0.3);
      }
      
      /* Art Deco Card Styling */
      .art-deco-card {
        background: linear-gradient(to bottom right, var(--midnight-800), var(--midnight-900));
        border: 1px solid rgba(255, 199, 0, var(--gold-opacity));
        border-radius: 0.5rem;
      }
      
      .art-deco-card-header {
        border-bottom: 1px solid rgba(204, 160, 0, var(--gold-opacity));
        background: linear-gradient(to right, var(--midnight-800), var(--midnight-900));
      }
      
      /* Art Deco Decorative Elements */
      .art-deco-divider {
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255, 199, 0, var(--gold-opacity)), transparent);
        margin: 1rem 0;
      }
      
      .art-deco-circle {
        width: 2rem;
        height: 2rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 199, 0, var(--gold-opacity));
        background-color: rgba(255, 199, 0, 0.1);
      }
      
      .art-deco-pattern {
        opacity: var(--pattern-opacity);
        background-image: linear-gradient(45deg, var(--gold-500) 25%, transparent 25%), 
                          linear-gradient(-45deg, var(--gold-500) 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, var(--gold-500) 75%), 
                          linear-gradient(-45deg, transparent 75%, var(--gold-500) 75%);
        background-size: 10px 10px;
        background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
      }
      
      /* Art Deco Typography */
      .art-deco-title {
        color: var(--gold-400);
        font-weight: 300;
        letter-spacing: 0.05em;
      }
      
      .art-deco-subtitle {
        color: var(--gold-300);
        font-weight: 300;
        opacity: 0.8;
      }
      
      /* Remove animations when animations are disabled */
      .reduce-motion * {
        animation: none !important;
        transition: none !important;
      }
      
      /* Fancy separator with diamond pattern */
      .art-deco-separator {
        display: flex;
        align-items: center;
        text-align: center;
        color: var(--gold-400);
        margin: 1rem 0;
      }
      
      .art-deco-separator::before,
      .art-deco-separator::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid rgba(255, 199, 0, var(--gold-opacity));
      }
      
      .art-deco-separator::before {
        margin-right: 1rem;
      }
      
      .art-deco-separator::after {
        margin-left: 1rem;
      }
      
      /* Diamond shape for separator */
      .art-deco-diamond {
        width: 10px;
        height: 10px;
        background-color: var(--gold-500);
        transform: rotate(45deg);
        display: inline-block;
        margin: 0 5px;
      }
      
      /* Global chart colors */
      .recharts-default-tooltip {
        background-color: var(--midnight-800) !important;
        border: 1px solid rgba(255, 199, 0, var(--gold-opacity)) !important;
      }
      
      .recharts-tooltip-label,
      .recharts-tooltip-item-name,
      .recharts-tooltip-item-value {
        color: var(--gold-300) !important;
      }
      
      .recharts-cartesian-axis-tick-value {
        fill: var(--gold-300) !important;
      }
      
      /* Chart area and borders */
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke: rgba(255, 199, 0, 0.1) !important;
      }
    `}} />
  );
};
