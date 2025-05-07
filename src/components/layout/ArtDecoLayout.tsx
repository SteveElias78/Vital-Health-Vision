import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Database, Globe, Users, LineChart, Settings, Info, Menu, X, Search, Bell, User, ChevronDown } from 'lucide-react';
interface ArtDecoLayoutProps {
  children: React.ReactNode;
}
export const ArtDecoLayout: React.FC<ArtDecoLayoutProps> = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items
  const navigationItems = [{
    name: 'Dashboard',
    href: '/',
    icon: Home
  }, {
    name: 'Health Metrics',
    href: '/metrics',
    icon: PieChart
  }, {
    name: 'Datasets',
    href: '/datasets',
    icon: Database
  }, {
    name: 'Demographics',
    href: '/demographics',
    icon: Users
  }, {
    name: 'Geographic Data',
    href: '/geography',
    icon: Globe
  }, {
    name: 'Prediction',
    href: '/predict',
    icon: LineChart
  }, {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }, {
    name: 'About',
    href: '/about',
    icon: Info
  }];

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
  return <div className="flex h-screen bg-gradient-to-br from-midnight-900 to-midnight-950 text-gold-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gold-500/30 bg-midnight-900 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gold-500/30">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-light tracking-wider text-gold-400">
              <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
            </span>
          </Link>
          <button className="rounded-full p-1 text-gold-400 hover:bg-midnight-800 lg:hidden" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigationItems.map(item => <Link key={item.name} to={item.href} className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${location.pathname === item.href ? 'bg-midnight-800 text-gold-400' : 'text-gold-300 hover:bg-midnight-800 hover:text-gold-400'}`} onClick={handleNavClick}>
                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${location.pathname === item.href ? 'text-gold-400' : 'text-gold-400/50 group-hover:text-gold-400'}`} />
                {item.name}
              </Link>)}
          </div>
        </nav>
        
        {/* Art Deco decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
          <div className="flex justify-between">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="h-8 w-8 rounded-full border border-gold-500/50 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-gold-500/20"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="h-16 border-b border-gold-500/30 bg-midnight-800 shadow-sm">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center">
              <button className="rounded-md p-2 text-gold-400 hover:bg-midnight-700 lg:hidden" onClick={toggleSidebar}>
                <Menu size={20} />
              </button>
              
              {/* Search */}
              <div className="ml-4 hidden md:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gold-400/50" />
                  </div>
                  <input type="text" placeholder="Search health data..." className="w-64 rounded-md border border-gold-500/30 bg-midnight-900 py-1.5 pl-10 pr-3 text-sm text-gold-50 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="rounded-full p-1 text-gold-400 hover:bg-midnight-700">
                <Bell size={20} />
              </button>
              
              {/* User menu */}
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center space-x-2 rounded-full p-1 hover:bg-midnight-700 text-gold-500">
                  <div className="h-8 w-8 rounded-full border border-gold-500/50 bg-midnight-700 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden md:block text-sm">Steve Elias</span>
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User dropdown */}
                {userMenuOpen && <div className="absolute right-0 mt-2 w-48 rounded-md border border-gold-500/30 bg-midnight-800 shadow-lg">
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gold-300 hover:bg-midnight-700" onClick={() => setUserMenuOpen(false)}>
                        Your Profile
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gold-300 hover:bg-midnight-700" onClick={() => setUserMenuOpen(false)}>
                        Settings
                      </Link>
                      <Link to="/logout" className="block px-4 py-2 text-sm text-gold-300 hover:bg-midnight-700" onClick={() => setUserMenuOpen(false)}>
                        Sign out
                      </Link>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        
        {/* Art Deco footer */}
        <footer className="border-t border-gold-500/30 bg-midnight-900 py-2 text-center text-xs text-gold-300/70">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
            <span>Vital Health Vision • The Art of Health Analytics</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
          </div>
        </footer>
      </div>
    </div>;
};
export default ArtDecoLayout;