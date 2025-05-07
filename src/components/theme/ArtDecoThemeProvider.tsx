
import React, { createContext, useContext, useState } from 'react';

interface ArtDecoThemeContextType {
  intensity: 'subtle' | 'medium' | 'bold';
  setIntensity: (intensity: 'subtle' | 'medium' | 'bold') => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

const ArtDecoThemeContext = createContext<ArtDecoThemeContextType | undefined>(undefined);

export const useArtDecoTheme = () => {
  const context = useContext(ArtDecoThemeContext);
  if (!context) {
    throw new Error('useArtDecoTheme must be used within an ArtDecoThemeProvider');
  }
  return context;
};

interface ArtDecoThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provides global Art Deco styling classes and custom CSS variables
 * This component should wrap the entire application to ensure consistent styling
 */
export const ArtDecoThemeProvider: React.FC<ArtDecoThemeProviderProps> = ({ children }) => {
  const [intensity, setIntensity] = useState<'subtle' | 'medium' | 'bold'>('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };

  // Set CSS variables based on theme intensity
  const getIntensityVars = () => {
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

  return (
    <ArtDecoThemeContext.Provider value={{ 
      intensity, 
      setIntensity, 
      animationsEnabled, 
      toggleAnimations 
    }}>
      <div className={`art-deco-theme font-light ${!animationsEnabled ? 'reduce-motion' : ''}`}>
        <style dangerouslySetInnerHTML={{ 
          __html: `
          :root {
            --gold-100: #FFF4CC;
            --gold-200: #FFE999;
            --gold-300: #FFDD66;
            --gold-400: #FFD233;
            --gold-500: #FFC700;
            --gold-600: #CCA000;
            --gold-700: #997800;
            --midnight-700: #000415;
            --midnight-800: #00020F;
            --midnight-900: #000108;
            
            /* Intensity variables that can be adjusted */
            ${getIntensityVars()}
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
        `}} />
        {children}
      </div>
    </ArtDecoThemeContext.Provider>
  );
};

export default ArtDecoThemeProvider;
