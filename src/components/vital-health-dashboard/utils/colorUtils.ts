
/**
 * Utility functions for working with the Art Deco color palette
 */

export type ArtDecoColorScheme = 'gold' | 'midnight' | 'navy' | 'black';

export const ArtDecoColors = {
  // Primary gold palette
  gold: {
    50: '#FFF9E6',
    100: '#FFF4CC',
    200: '#FFE999',
    300: '#FFDD66',
    400: '#FFD233',
    500: '#FFC700',
    600: '#CCA000',
    700: '#997800',
    800: '#665000',
    900: '#332800',
  },
  // Midnight blues palette
  midnight: {
    50: '#E6E6E9',
    100: '#CCCED3',
    200: '#999CA7',
    300: '#666B7B',
    400: '#33394F',
    500: '#000723',
    600: '#00061C',
    700: '#000415',
    800: '#00020F',
    900: '#000108',
    950: '#000105',
  },
  // Chart/visualization specific colors
  chart: {
    primary: '#FFC700',   // Gold
    secondary: '#FFDD66', // Light Gold
    tertiary: '#000723',  // Midnight
    quaternary: '#000933', // Navy
    quinary: '#000108',   // Black
    accent1: '#CCA000',   // Dark Gold
    accent2: '#00061C',   // Dark Navy
  }
};

/**
 * Gets a color palette for charts with a specific number of data points
 */
export const getChartColorPalette = (count: number): string[] => {
  // Base color palette in order of preference
  const baseColors = [
    ArtDecoColors.chart.primary,   // Gold
    ArtDecoColors.chart.tertiary,  // Midnight
    ArtDecoColors.chart.secondary, // Light Gold
    ArtDecoColors.chart.quaternary, // Navy
    ArtDecoColors.chart.accent1,   // Dark Gold  
    ArtDecoColors.chart.quinary,   // Black
    ArtDecoColors.chart.accent2    // Dark Navy
  ];
  
  // For small datasets, just return the needed colors
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // For larger datasets, create variations
  const result = [...baseColors];
  
  // Generate more colors by adjusting opacity of base colors
  for (let i = 0; result.length < count; i++) {
    const baseColor = baseColors[i % baseColors.length];
    const opacity = 0.8 - (0.1 * Math.floor(i / baseColors.length));
    
    // For gold colors, make them more transparent
    // For dark colors, make them lighter
    if (baseColor.includes('FFC') || baseColor.includes('FFD')) {
      result.push(baseColor + Math.floor(opacity * 100).toString(16).padStart(2, '0'));
    } else {
      // Lighten the dark colors
      const lightenedColor = baseColor; // This is a simplification - in a real app you'd calculate a lighter color
      result.push(lightenedColor);
    }
  }
  
  return result.slice(0, count);
};

/**
 * Gets a color based on value (for heat maps, etc)
 */
export const getColorForValue = (value: number, min = 0, max = 100): string => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  if (percentage > 75) {
    return ArtDecoColors.gold[500]; // Bright gold
  } else if (percentage > 50) {
    return ArtDecoColors.gold[400]; // Medium gold
  } else if (percentage > 25) {
    return ArtDecoColors.gold[300]; // Light gold
  } else {
    return ArtDecoColors.gold[200]; // Very light gold
  }
};

/**
 * Get appropriate text color based on background color (for contrast)
 */
export const getTextColorForBackground = (backgroundColor: string): string => {
  // Simple check - if it's a gold color use midnight, otherwise use gold
  if (backgroundColor.includes('FF')) {
    return ArtDecoColors.midnight[900]; // Dark text for light backgrounds
  } else {
    return ArtDecoColors.gold[300]; // Light text for dark backgrounds
  }
};
