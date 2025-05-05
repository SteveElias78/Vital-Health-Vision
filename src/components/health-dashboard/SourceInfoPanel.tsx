
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SourceInfoPanelProps {
  metadata: any;
}

export const SourceInfoPanel: React.FC<SourceInfoPanelProps> = ({ metadata }) => {
  // Format source name for display
  const formatSourceName = (source: string) => {
    return source.replace(/_/g, " ");
  };

  // Get confidence level color
  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "bg-green-500"; // High confidence
    if (score >= 0.7) return "bg-yellow-500"; // Medium confidence
    return "bg-red-500"; // Low confidence
  };

  return (
    <Card className="mb-4 bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Source Information</h3>
          {metadata.reliability && (
            <Badge className={`${getConfidenceColor(metadata.reliability)} text-white`}>
              {Math.round(metadata.reliability * 100)}% Reliable
            </Badge>
          )}
        </div>
        
        {metadata.sources && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Primary Sources</h4>
            <div className="flex flex-wrap gap-2">
              {metadata.sources.map((source: string) => (
                <Badge key={source} variant="outline" className="flex items-center gap-1">
                  {formatSourceName(source)}
                  {metadata[source]?.integrityVerified && (
                    <span className="text-green-500 ml-1">✓</span>
                  )}
                  {metadata[source]?.integrityVerified === false && (
                    <span className="text-yellow-500 ml-1">⚠️</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {metadata.validation?.sourceSwitch && (
          <Alert className="mt-4">
            <AlertTitle>Source Switch Detected</AlertTitle>
            <AlertDescription>
              Data from {formatSourceName(metadata.validation.sourceSwitch.from)} was 
              replaced with data from {formatSourceName(metadata.validation.sourceSwitch.to)} 
              due to {metadata.validation.sourceSwitch.reason.replace(/_/g, " ")}.
            </AlertDescription>
          </Alert>
        )}
        
        {metadata.validation?.discrepancies && metadata.validation.discrepancies.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Data Discrepancies</h4>
            <ul className="space-y-2 text-sm">
              {metadata.validation.discrepancies.map((discrepancy: any, index: number) => (
                <li key={index} className="border rounded-md p-2">
                  <span className="font-medium">
                    Between {formatSourceName(discrepancy.source1)} and {formatSourceName(discrepancy.source2)}:
                  </span>
                  <ul className="mt-1 pl-4 list-disc">
                    {discrepancy.discrepancies.map((d: any, i: number) => (
                      <li key={i} className="text-muted-foreground">
                        {d.type === 'value' && `${d.field}: ${d.percentDiff.toFixed(1)}% difference`}
                        {d.type === 'record_count' && `Record count: ${d.percentDiff.toFixed(1)}% difference`}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {metadata.fetchedAt && (
          <div className="text-sm text-muted-foreground mt-4">
            <span className="font-medium">Last updated:</span>{" "}
            {new Date(metadata.fetchedAt).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
