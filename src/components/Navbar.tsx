
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, Database, Settings, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <ChartBar className="h-8 w-8 text-health-purple" />
            <span className="ml-2 text-xl font-bold tracking-tight text-health-dark">
              HealthTrendLens
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            to="/explore"
            className="text-gray-700 hover:text-health-purple transition-colors"
          >
            Explore Data
          </Link>
          <Link
            to="/predict"
            className="text-gray-700 hover:text-health-purple transition-colors"
          >
            Predictions
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-health-purple transition-colors"
          >
            About
          </Link>
          <Button variant="outline" size="icon" className="ml-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white p-4 md:hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col space-y-4 mt-8">
          <Link
            to="/"
            className="text-xl font-medium text-gray-800"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/explore"
            className="text-xl font-medium text-gray-800"
            onClick={toggleMenu}
          >
            Explore Data
          </Link>
          <Link
            to="/predict"
            className="text-xl font-medium text-gray-800"
            onClick={toggleMenu}
          >
            Predictions
          </Link>
          <Link
            to="/about"
            className="text-xl font-medium text-gray-800"
            onClick={toggleMenu}
          >
            About
          </Link>
          <div className="pt-4">
            <Button className="w-full" variant="default">
              <Search className="mr-2 h-4 w-4" />
              Search Data
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
