
import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MainNav } from './MainNav';
import { UserAccountNav } from './UserAccountNav';
import { ModeToggle } from './ModeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isDemo } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for larger screens */}
      <Sidebar className="hidden lg:block">
        <div className="mb-8">
          <h2 className="text-2xl font-light tracking-wider px-4 pt-4 pb-2 text-gold-400">
            <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
          </h2>
          {isDemo && (
            <div className="px-4">
              <DemoModeIndicator />
            </div>
          )}
        </div>
        <MainNav />
      </Sidebar>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 border-r bg-background shadow-lg">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-light tracking-wider text-gold-400">
                <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {isDemo && (
              <div className="px-4">
                <DemoModeIndicator />
              </div>
            )}
            <div className="p-4">
              <MainNav />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {isAuthenticated && <UserAccountNav />}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
