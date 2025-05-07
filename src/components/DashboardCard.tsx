
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DashboardCard({
  title,
  description,
  footer,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("art-deco-card overflow-hidden", className)}>
      <CardHeader className="art-deco-card-header relative pb-3">
        <CardTitle className="art-deco-title">{title}</CardTitle>
        {description && <CardDescription className="art-deco-subtitle">{description}</CardDescription>}
        
        {/* Art Deco corner decorations - Top */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-500/50"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-500/50"></div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0 pb-0">{children}</CardContent>
      
      {footer && (
        <CardFooter className="pt-3 pb-4 border-t border-gold-500/20 mt-3">
          {footer}
        </CardFooter>
      )}
      
      {/* Art Deco corner decorations - Bottom */}
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-500/50"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-500/50"></div>
    </Card>
  );
}
