
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

  return (
    <Card className="mb-4 bg-muted/50">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Source Information</h3>
        
        {metadata.sources && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
              {metadata.sources.map((source: string) => (
                <Badge key={source} variant="outline">
                  {formatSourceName(source)}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {metadata.fetchedAt && (
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">Fetched at:</span>{" "}
            {new Date(metadata.fetchedAt).toLocaleString()}
          </div>
        )}
        
        {metadata.validation && metadata.validation.sourceSwitch && (
          <Alert className="mt-4">
            <AlertTitle>Source Switch Detected</AlertTitle>
            <AlertDescription>
              Data source was switched from {metadata.validation.sourceSwitch.from} to{" "}
              {metadata.validation.sourceSwitch.to} due to{" "}
              {metadata.validation.sourceSwitch.reason.replace(/_/g, " ")}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
