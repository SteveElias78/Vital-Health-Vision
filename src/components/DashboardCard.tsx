
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
      <CardHeader className="pb-3">
        <CardTitle className="art-deco-title">{title}</CardTitle>
        {description && <CardDescription className="art-deco-subtitle">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 pb-0">{children}</CardContent>
      {footer && <CardFooter className="pt-3">{footer}</CardFooter>}
    </Card>
  );
}
