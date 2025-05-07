
import React, { useState } from 'react';
import { ArtDecoThemeContext, ArtDecoThemeContextType } from './ArtDecoThemeContext';
import { ArtDecoStyles } from './ArtDecoStyles';

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

  // Create the context value
  const contextValue: ArtDecoThemeContextType = {
    intensity,
    setIntensity,
    animationsEnabled,
    toggleAnimations
  };

  return (
    <ArtDecoThemeContext.Provider value={contextValue}>
      <div className={`art-deco-theme font-light ${!animationsEnabled ? 'reduce-motion' : ''}`}>
        <ArtDecoStyles intensity={intensity} animationsEnabled={animationsEnabled} />
        {children}
      </div>
    </ArtDecoThemeContext.Provider>
  );
};

export default ArtDecoThemeProvider;
