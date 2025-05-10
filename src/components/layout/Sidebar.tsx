
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  LineChart, 
  Settings, 
  TrendingUp, 
  Users,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, text: 'Dashboard', link: '/' },
    { icon: BarChart3, text: 'Demographics', link: '/demographics' },
    { icon: LineChart, text: 'Data Trends', link: '/trends' },
    { icon: TrendingUp, text: 'Predictions', link: '/predict' },
    { icon: Users, text: 'Population Health', link: '/population' },
    { icon: Settings, text: 'Settings', link: '/settings' }
  ];

  return (
    <div className={cn(
      "fixed top-0 left-0 h-full w-64 bg-midnight-900 text-gold-300 shadow-lg border-r border-gold-500/30 art-deco-bg transition-all duration-300 z-40",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      "md:relative md:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-gold-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gold-600 flex items-center justify-center">
              <span className="text-midnight-900 font-medium">VH</span>
            </div>
            <h2 className="ml-3 text-lg font-light tracking-wider text-gold-400">Vital Health</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gold-400 hover:bg-gold-500/10"
            onClick={toggleSidebar}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.link}
                className="group flex items-center p-2 text-sm font-light hover:bg-gold-500/10 rounded-md transition-colors duration-200"
              >
                <item.icon className="h-5 w-5 mr-3 text-gold-500" />
                <span className="text-gold-300 group-hover:text-gold-200">{item.text}</span>
              </Link>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-1">
            <div className="p-2 text-xs text-gold-300/70">Health Metrics</div>
            {['Obesity', 'Diabetes', 'Hypertension', 'LGBTQ+ Health'].map((metric) => (
              <div
                key={metric}
                className="flex items-center p-2 text-sm font-light hover:bg-gold-500/10 rounded-md transition-colors duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-gold-600 mr-3"></span>
                <span className="text-gold-300 hover:text-gold-200">{metric}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gold-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
              <span className="text-gold-400 text-sm">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gold-400">John Doe</p>
              <p className="text-xs text-gold-300/70">Data Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
