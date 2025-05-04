
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PredictTabsProps {
  children: ReactNode;
}

export const PredictTabs = ({ children }: PredictTabsProps) => {
  return (
    <Tabs defaultValue="builder">
      <TabsList className="mb-6">
        <TabsTrigger value="builder">Prediction Builder</TabsTrigger>
        <TabsTrigger value="models">Saved Models</TabsTrigger>
        <TabsTrigger value="history">Analysis History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="builder">
        {children}
      </TabsContent>
      
      <TabsContent value="models">
        <div className="rounded-md border border-dashed p-16 text-center">
          <h3 className="text-lg font-medium mb-2">Saved Models</h3>
          <p className="text-gray-500 mb-4">Access your previously saved prediction models.</p>
          <Button>Create New Model</Button>
        </div>
      </TabsContent>
      
      <TabsContent value="history">
        <div className="rounded-md border border-dashed p-16 text-center">
          <h3 className="text-lg font-medium mb-2">Analysis History</h3>
          <p className="text-gray-500 mb-4">View your previous predictions and analysis results.</p>
          <Button>View Analysis History</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
