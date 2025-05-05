
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DataVisualization } from "./DataVisualization";
import { DataIntegrityBadge } from "./DataIntegrityBadge";
import { SourceInfoPanel } from "./SourceInfoPanel";

interface DataDisplayProps {
  categoryName: string;
  data: any;
  metadata: any;
  category: string;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({
  categoryName,
  data,
  metadata,
  category
}) => {
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{categoryName}</CardTitle>
        <div className="flex items-center space-x-2">
          {metadata && (
            <DataIntegrityBadge
              reliability={metadata.reliability}
              integrityVerified={metadata.integrityVerified}
              sourceSwitch={metadata.validation?.sourceSwitch}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <Switch
            id="source-info"
            checked={showSourceInfo}
            onCheckedChange={setShowSourceInfo}
          />
          <Label htmlFor="source-info">
            {showSourceInfo ? "Hide Source Info" : "Show Source Info"}
          </Label>
        </div>

        {showSourceInfo && metadata && (
          <SourceInfoPanel metadata={metadata} />
        )}

        <DataVisualization data={data} category={category} />
      </CardContent>
    </Card>
  );
};
