
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SourcesPanelProps {
  sources: {
    government: Array<{
      id: string;
      name: string;
      reliability: number;
      categories: string[];
      status: {
        available: boolean;
        integrityVerified?: boolean;
      };
    }>;
    alternative: Array<{
      id: string;
      name: string;
      reliability: number;
      categories: string[];
      status: {
        available: boolean;
      };
    }>;
    compromisedCategories: string[];
  };
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
  // Get reliability badge variant
  const getReliabilityVariant = (score: number) => {
    if (score >= 0.9) return "default"; // High reliability
    if (score >= 0.7) return "secondary"; // Medium reliability
    return "destructive"; // Low reliability
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Sources Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Government Sources</h3>
            <ul className="space-y-2">
              {sources.government.map(source => (
                <li key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{source.name}</span>
                    {!source.status.available && (
                      <Badge variant="outline" className="text-red-500 border-red-200">
                        Unavailable
                      </Badge>
                    )}
                    {source.status.integrityVerified === false && (
                      <Badge variant="outline" className="text-amber-500 border-amber-200">
                        Integrity concerns
                      </Badge>
                    )}
                  </div>
                  <Badge variant={getReliabilityVariant(source.reliability)}>
                    {Math.round(source.reliability * 100)}%
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Alternative Sources</h3>
            <ul className="space-y-2">
              {sources.alternative.map(source => (
                <li key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{source.name}</span>
                    {!source.status.available && (
                      <Badge variant="outline" className="text-red-500 border-red-200">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <Badge variant={getReliabilityVariant(source.reliability)}>
                    {Math.round(source.reliability * 100)}%
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Potentially Compromised Categories</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              The following categories may have integrity issues in government sources
              and may use alternative sources for reliability:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {sources.compromisedCategories.map(category => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
