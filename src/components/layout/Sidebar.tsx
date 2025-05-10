
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "h-screen w-64 border-r bg-background flex flex-col overflow-y-auto",
      className
    )}>
      {children}
    </div>
  );
};

export default Sidebar;
