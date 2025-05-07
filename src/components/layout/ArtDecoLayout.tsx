
import React, { useState } from 'react';
import ArtDecoSidebar from './ArtDecoSidebar';
import { ArtDecoHeader } from '../artdeco/ArtDecoHeader';
import { ArtDecoFooter } from '../artdeco/ArtDecoFooter';

interface ArtDecoLayoutProps {
  children: React.ReactNode;
}

export const ArtDecoLayout: React.FC<ArtDecoLayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-midnight-900 to-midnight-950 text-gold-50">
      {/* Sidebar */}
      {sidebarVisible && <ArtDecoSidebar />}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ArtDecoHeader toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 art-deco-page-transition">
          {children}
        </main>
        
        {/* Footer */}
        <ArtDecoFooter />
      </div>
    </div>
  );
};

export default ArtDecoLayout;
