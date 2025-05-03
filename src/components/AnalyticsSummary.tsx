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
  return <div className="flex flex-col">
      <span className="text-sm font-medium text-amber-200">{title}</span>
      <div className="flex items-baseline bg-amber-500">
        <span className="text-2xl font-bold">{value}</span>
        {change && <div className={cn("ml-2 flex items-center text-xs font-medium", change.trend === "up" && "text-green-600", change.trend === "down" && "text-red-600", change.trend === "neutral" && "text-gray-500")}>
            {change.trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
            {change.trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
            {change.value}
          </div>}
      </div>
    </div>;
}