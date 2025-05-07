
import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-midnight-900 border-b border-gold-500/30 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2 text-gold-400 hover:bg-gold-500/10"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex items-center">
          <h1 className="text-xl font-light text-gold-400">Vital Health <span className="font-medium">Vision</span></h1>
        </div>
      </div>

      <div className="flex-1 mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold-500/70" />
          <Input 
            placeholder="Search health metrics..."
            className="pl-8 bg-midnight-800 border-gold-500/30 text-gold-300 focus:border-gold-400 w-full max-w-md"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost"
          size="icon"
          className="text-gold-400 hover:bg-gold-500/10"
        >
          <Search className="h-5 w-5 md:hidden" />
        </Button>

        <Button 
          variant="ghost"
          size="icon"
          className="relative text-gold-400 hover:bg-gold-500/10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-gold-600"></span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
            <span className="text-gold-400 text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};
