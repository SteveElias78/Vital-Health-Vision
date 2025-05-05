
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleCheck, AlertTriangle, ArrowRight, Percent } from "lucide-react";

interface DataIntegrityBadgeProps {
  reliability: number;
  integrityVerified?: boolean;
  sourceSwitch?: {
    from: string;
    to: string;
    reason: string;
  };
}

export const DataIntegrityBadge: React.FC<DataIntegrityBadgeProps> = ({
  reliability,
  integrityVerified,
  sourceSwitch
}) => {
  // Get confidence level variant
  const getConfidenceVariant = (score: number) => {
    if (score >= 0.9) return "default"; // High confidence
    if (score >= 0.7) return "secondary"; // Medium confidence
    return "destructive"; // Low confidence
  };

  // Get confidence level text
  const getConfidenceText = (score: number) => {
    if (score >= 0.9) return "High Confidence";
    if (score >= 0.7) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={getConfidenceVariant(reliability)}>
        {getConfidenceText(reliability)}
      </Badge>

      {integrityVerified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-green-600">
                <CircleCheck className="h-5 w-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data integrity verified</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {integrityVerified === false && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-amber-500">
                <AlertTriangle className="h-5 w-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data integrity concerns detected</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {sourceSwitch && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-amber-500">
                <ArrowRight className="h-5 w-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Source switched from {sourceSwitch.from} to {sourceSwitch.to} due
                to {sourceSwitch.reason.replace(/_/g, " ")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center text-xs bg-slate-200 rounded-full px-2 py-1">
              <Percent className="h-3 w-3 mr-1" />
              {Math.round(reliability * 100)}%
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Data reliability score</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
