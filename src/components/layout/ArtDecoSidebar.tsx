
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PieChart,
  Users, 
  Globe, 
  FileText, 
  Settings, 
  Info 
} from 'lucide-react';

const ArtDecoSidebar: React.FC = () => {
  const location = useLocation();
  
  // Navigation items with Art Deco styled icons
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Health Metrics', href: '/metrics', icon: PieChart },
    { name: 'Demographics', href: '/demographics', icon: Users },
    { name: 'Geographic Data', href: '/geography', icon: Globe },
    { name: 'Explore', href: '/explore', icon: PieChart },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: Info }
  ];
  
  return (
    <div className="h-screen w-64 border-r border-gold-500/30 bg-gradient-to-b from-midnight-800 to-midnight-900 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gold-500/30 px-4">
        <Link to="/" className="text-xl font-light tracking-wider text-gold-400">
          <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-midnight-800 text-gold-400'
                    : 'text-gold-300 hover:bg-midnight-800/50 hover:text-gold-400'
                }`}
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
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Art Deco decorative elements */}
      <div className="p-4 border-t border-gold-500/30">
        <div className="flex justify-center mb-4">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        </div>
        <div className="flex justify-center">
          <div className="h-8 w-8 rounded-full border border-gold-500/50 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-gold-500/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDecoSidebar;
