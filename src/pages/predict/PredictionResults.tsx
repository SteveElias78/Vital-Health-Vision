
import { PredictionModel } from "@/components/PredictionModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileChartLine } from "lucide-react";

interface PredictionResultsProps {
  predictionResults: boolean;
}

export const PredictionResults = ({ predictionResults }: PredictionResultsProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
        <CardDescription>
          {predictionResults 
            ? "Analysis complete. View results below." 
            : "Configure your model parameters and run a prediction."}
        </CardDescription>
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
