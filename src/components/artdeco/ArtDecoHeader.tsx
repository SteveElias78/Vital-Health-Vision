
import React, { useState } from 'react';
import { Bell, Menu, Search, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArtDecoInput } from './ArtDecoInput';
import { ArtDecoButton } from './ArtDecoButton';
import { useNavigate } from 'react-router-dom';

export interface ArtDecoHeaderProps {
  toggleSidebar: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
}

export const ArtDecoHeader: React.FC<ArtDecoHeaderProps> = ({
  toggleSidebar,
  title = 'Vital Health',
  subtitle = 'Vision',
  className,
  showSearch = true,
  showNotifications = true,
  showProfile = true,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log('Search for:', searchValue);
      // Add search functionality here
    }
  };

  return (
    <header 
      className={cn(
        "relative bg-gradient-to-r from-midnight-900 to-midnight-950 border-b border-gold-500/30 py-3 px-4 flex items-center justify-between",
        className
      )}
    >
      {/* Art Deco decorative patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 199, 0, 0.05) 0%, transparent 8%),
            radial-gradient(circle at 80% 50%, rgba(255, 199, 0, 0.05) 0%, transparent 8%)
          `,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="flex items-center z-10">
        <ArtDecoButton 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2 text-gold-400 hover:bg-gold-500/10"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </ArtDecoButton>
        
        <div className="flex items-center">
          <div className="mr-3 hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600">
            <span className="text-midnight-900 font-semibold text-sm">VH</span>
          </div>
          <div>
            <h1 className="text-xl font-light text-gold-400">
              {title} <span className="font-normal">{subtitle}</span>
            </h1>
          </div>
        </div>
      </div>

      {showSearch && (
        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 mx-8 hidden md:block z-10"
        >
          <ArtDecoInput
            placeholder="Search health metrics..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-md w-full"
          />
        </form>
      )}

      <div className="flex items-center space-x-3 z-10">
        {showSearch && (
          <ArtDecoButton 
            variant="ghost"
            size="icon"
            className="text-gold-400 hover:bg-gold-500/10 md:hidden"
            onClick={() => {/* Open mobile search */}}
          >
            <Search className="h-5 w-5" />
          </ArtDecoButton>
        )}

        {showNotifications && (
          <div className="relative">
            <ArtDecoButton 
              variant="ghost"
              size="icon"
              className="relative text-gold-400 hover:bg-gold-500/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gold-500"></span>
            </ArtDecoButton>
          </div>
        )}

        <div className="h-5 border-r border-gold-500/30 mx-1"></div>

        {showProfile && (
          <div className="flex items-center">
            <ArtDecoButton
              variant="ghost"
              size="icon"
              className="relative text-gold-400 hover:bg-gold-500/10"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </ArtDecoButton>
            
            <div className="ml-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/30 transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/30 cursor-pointer">
                <User className="h-4 w-4 text-gold-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Art Deco bottom border accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent"></div>
    </header>
  );
};

export default ArtDecoHeader;
