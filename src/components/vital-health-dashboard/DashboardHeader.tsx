
import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  toggleSidebar?: () => void;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  toggleSidebar,
  className
}) => {
  return (
    <header className={cn(
      "relative bg-gradient-to-r from-midnight-900 to-midnight-950 border-b border-gold-500/30 py-3 px-4 flex items-center justify-between",
      className
    )}>
      <div className="flex items-center">
        <h1 className="text-xl font-light text-gold-400">
          Vital <span className="font-normal">Health</span>
        </h1>
      </div>

      <div className="relative mx-4 flex-1 max-w-md hidden md:block">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gold-400/50" />
        </div>
        <input
          type="text"
          placeholder="Search health data..."
          className="bg-midnight-800 border border-gold-500/30 text-gold-50 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gold-400 hover:text-gold-300 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-gold-500"></span>
        </button>

        <button className="text-gold-400 hover:text-gold-300">
          <Settings className="h-5 w-5" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/30 transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/30 cursor-pointer">
          <User className="h-4 w-4 text-gold-400" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
