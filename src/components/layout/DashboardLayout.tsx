
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, PieChart, BarChart3, Globe, Users, FileText, 
  Settings, Info, Menu, X, Search 
} from 'lucide-react';

import { DashboardLayoutProps, NavigationItem } from './types';
import { DashboardFooter } from './DashboardFooter';

/**
 * Art Deco styled dashboard layout component for Vital Health Vision
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();
  
  // Navigation items with Art Deco styled icons
  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Health Metrics', href: '/metrics', icon: PieChart },
    { name: 'Demographics', href: '/demographics', icon: Users },
    { name: 'Geographic Data', href: '/geography', icon: Globe },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: Info }
  ];
  
  // Toggle sidebar on small screens
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar when navigation item is clicked on small screens
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-midnight-900 to-midnight-950 text-gold-50">
      {/* Sidebar - Art Deco styled */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-midnight-800 to-midnight-900 border-r border-gold-500/30 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo with Art Deco decorative element */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-gold-500/30 relative overflow-hidden">
          <Link to="/" className="flex items-center z-10">
            <span className="text-xl font-light tracking-wider text-gold-400">
              <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
            </span>
          </Link>
          
          {/* Art Deco decorative pattern behind logo */}
          <div className="absolute top-0 right-0 w-32 h-20 art-deco-diamond-pattern opacity-5"></div>
          
          <button 
            className="rounded-full p-1 text-gold-400 hover:bg-midnight-800 lg:hidden z-10"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'bg-midnight-800/80 text-gold-400'
                    : 'text-gold-300/70 hover:bg-midnight-800/50 hover:text-gold-400'
                }`}
                onClick={handleNavClick}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    location.pathname === item.href
                      ? 'text-gold-400'
                      : 'text-gold-400/50 group-hover:text-gold-400'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Art Deco decorative elements at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6">
          <div className="flex justify-center mb-4">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full border border-gold-500/30 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-gold-500/10 flex items-center justify-center">
                <div className="h-3 w-3 rotate-45 bg-gold-500/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Simplified top bar - only contains mobile sidebar toggle and search */}
        <header className="h-16 border-b border-gold-500/30 bg-midnight-800/80 shadow-sm">
          <div className="flex h-full items-center px-4">
            <button
              className="rounded-md p-2 text-gold-400 hover:bg-midnight-700 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="ml-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gold-400/50" />
                </div>
                <input
                  type="text"
                  placeholder="Search health data..."
                  className="w-64 rounded-md border border-gold-500/30 bg-midnight-900 py-1.5 pl-10 pr-3 text-sm text-gold-50 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        
        {/* Art Deco footer */}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
