
import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, signOut, isDemo } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold text-primary">
            Vital Health Vision
            {isDemo && <span className="ml-2 text-sm text-primary/70">(Demo)</span>}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/semantic-dashboard" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            Semantic Dashboard
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            Explore Data
          </Link>
          <Link to="/predict" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            Predictions
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          {isDemo && (
            <DemoModeIndicator />
          )}
          
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-1" /> 
              Sign Out
            </Button>
          )}
          
          <Link to="/settings" className="text-sm px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
            Settings
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
