
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart,
  Users,
  LineChart,
  Settings,
  PieChart,
  Globe,
  BookOpen
} from 'lucide-react';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean;
}

export function MainNav({ className, isCollapsed, ...props }: MainNavProps) {
  const { pathname } = useLocation();
  const { isAuthenticated, isDemo, demoRole } = useAuth();
  
  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart,
      requireAuth: true
    },
    {
      href: '/demographics',
      label: 'Demographics',
      icon: Users,
      requireAuth: true
    },
    {
      href: '/trends',
      label: 'Trends',
      icon: LineChart,
      requireAuth: true
    },
    {
      href: '/geographic',
      label: 'Geographic',
      icon: Globe,
      requireAuth: true
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: BookOpen,
      requireAuth: true,
      adminOnly: true
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: PieChart,
      requireAuth: true,
      adminOnly: true
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      requireAuth: true
    },
  ];
  
  // Filter routes based on authentication and role
  const filteredRoutes = routes.filter(route => {
    if (route.requireAuth && !isAuthenticated) return false;
    if (route.adminOnly && demoRole !== 'administrator') return false;
    return true;
  });

  return (
    <nav
      className={cn("flex items-center space-x-1 lg:space-x-0 lg:flex-col lg:space-y-1", className)}
      {...props}
    >
      {filteredRoutes.map((route) => {
        const isActive = pathname === route.href;
        const Icon = route.icon;
        
        return isCollapsed ? (
          <Button
            key={route.href}
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-10 w-10", isActive && "bg-gold-500/10 text-gold-400")}
            asChild
          >
            <Link to={route.href} aria-label={route.label}>
              <Icon className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button
            key={route.href}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start",
              isActive && "bg-gold-500/10 text-gold-400"
            )}
            asChild
          >
            <Link to={route.href}>
              <Icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
