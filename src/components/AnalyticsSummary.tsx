
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsSummaryProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
}

export function AnalyticsSummary({
  title,
  value,
  change
}: AnalyticsSummaryProps) {
  // Get the proper color based on trend
  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-indigo-50";
  };

  return <div className="flex flex-col">
      <span className="text-sm font-medium text-indigo-50">{title}</span>
      <div className="flex items-baseline bg-pink-600">
        <span className="text-2xl font-bold">{value}</span>
        {change && <div className={cn("ml-2 flex items-center text-xs font-medium", getTrendColor(change.trend))}>
            {change.trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
            {change.trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
            <span style={{ color: 'rgb(238, 242, 255)' }}>{change.value}</span>
          </div>}
      </div>
    </div>;
}
