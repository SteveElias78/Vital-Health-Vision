
import React from 'react';

interface ArtDecoThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provides global Art Deco styling classes and custom CSS variables
 * This component should wrap the entire application to ensure consistent styling
 */
export const ArtDecoThemeProvider: React.FC<ArtDecoThemeProviderProps> = ({ children }) => {
  return (
    <div className="art-deco-theme font-light">
      <style jsx global>{`
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
        }
        
        body {
          background: linear-gradient(135deg, var(--midnight-900), var(--midnight-800));
          color: var(--gold-300);
          min-height: 100vh;
        }
        
        /* Art Deco Input Styling */
        .art-deco-input {
          background-color: var(--midnight-800);
          border: 1px solid var(--gold-500);
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
        }
        
        /* Art Deco Card Styling */
        .art-deco-card {
          background: linear-gradient(to bottom right, var(--midnight-800), var(--midnight-900));
          border: 1px solid var(--gold-500);
          border-radius: 0.5rem;
        }
        
        .art-deco-card-header {
          border-bottom: 1px solid var(--gold-600);
          background: linear-gradient(to right, var(--midnight-800), var(--midnight-900));
        }
        
        /* Art Deco Decorative Elements */
        .art-deco-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--gold-500), transparent);
          margin: 1rem 0;
        }
        
        .art-deco-circle {
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          border: 1px solid var(--gold-500);
          background-color: rgba(255, 199, 0, 0.1);
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
      `}</style>
      {children}
    </div>
  );
};

export default ArtDecoThemeProvider;
