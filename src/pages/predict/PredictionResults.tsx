
import { useState } from "react";
import { PredictionModel } from "@/components/PredictionModel";
import { useAnalysisResults } from "@/hooks/useAnalysisResults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileChartLine, Save } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";

interface PredictionResultsProps {
  predictionResults: boolean;
  modelConfig?: any;
}

export const PredictionResults = ({ predictionResults, modelConfig }: PredictionResultsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { saveResult } = useAnalysisResults();
  
  const handleSaveResults = async () => {
    if (!modelConfig) {
      toast({
        title: "Cannot save analysis",
        description: "No model configuration available",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, you would capture actual analysis results
      // This is a simplified example
      const mockResults = {
        predictions: [
          { year: 2025, prevalence: 12.8 },
          { year: 2026, prevalence: 13.2 },
          { year: 2027, prevalence: 13.7 },
          { year: 2028, prevalence: 14.1 },
          { year: 2029, prevalence: 14.6 },
        ],
        accuracy: 0.87,
        confidence_interval: [0.82, 0.92],
        key_factors: ["BMI", "Age", "Urban Setting"]
      };
      
      await saveResult({
        analysis_type: 'time-series',
        parameters: modelConfig || {},
        results: mockResults,
      });
      
      toast({
        title: "Analysis saved",
        description: "Your analysis has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Error saving analysis",
        description: "An error occurred while saving your analysis",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>
            {predictionResults 
              ? "Analysis complete. View results below." 
              : "Configure your model parameters and run a prediction."}
          </CardDescription>
        </div>
        
        {predictionResults && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveResults}
            disabled={isSaving}
          >
            {isSaving ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Analysis
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {predictionResults ? (
          <div className="space-y-6">
            <PredictionModel />
            <div className="mt-4">
              <h4 className="font-medium mb-2">Key Insights:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Diabetes prevalence projected to increase by 12.5% over next 5 years</li>
                <li>Highest growth predicted in 45-65 age demographic</li>
                <li>Strong correlation with BMI increases in population</li>
                <li>Urban areas show faster growth rates than rural communities</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <FileChartLine className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium">No Prediction Data</h3>
            <p className="text-gray-500 max-w-md mt-2">
              Configure the model parameters and run a prediction to see results here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
