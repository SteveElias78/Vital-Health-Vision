
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardFooter } from './DashboardFooter';
import { ArtDecoHeader } from '../artdeco/ArtDecoHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-midnight-900 to-midnight-950">
      <ArtDecoHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-8 art-deco-page-transition">
          <div className="art-deco-main-content">
            {children}
          </div>
        </main>
      </div>
      
      <DashboardFooter />
    </div>
  );
};
