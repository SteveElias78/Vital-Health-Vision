
import React, { createContext, useContext } from 'react';

// Define the theme context type
export interface ArtDecoThemeContextType {
  intensity: 'subtle' | 'medium' | 'bold';
  setIntensity: (intensity: 'subtle' | 'medium' | 'bold') => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

// Create the context
export const ArtDecoThemeContext = createContext<ArtDecoThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useArtDecoTheme = () => {
  const context = useContext(ArtDecoThemeContext);
  if (!context) {
    throw new Error('useArtDecoTheme must be used within an ArtDecoThemeProvider');
  }
  return context;
};
