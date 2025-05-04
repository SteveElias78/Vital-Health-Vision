
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";

interface ModelConfigurationProps {
  onRunPrediction: () => void;
}

export const ModelConfiguration = ({ onRunPrediction }: ModelConfigurationProps) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const handleFeatureSelect = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Model Configuration</CardTitle>
        <CardDescription>Select parameters for your prediction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Health Condition</FormLabel>
          <Select defaultValue="diabetes">
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diabetes">Diabetes</SelectItem>
              <SelectItem value="heart-disease">Heart Disease</SelectItem>
              <SelectItem value="obesity">Obesity</SelectItem>
              <SelectItem value="hypertension">Hypertension</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <FormLabel>Prediction Timeframe</FormLabel>
          <Select defaultValue="5">
            <SelectTrigger>
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <FormLabel>Model Type</FormLabel>
          <Select defaultValue="regression">
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regression">Linear Regression</SelectItem>
              <SelectItem value="random-forest">Random Forest</SelectItem>
              <SelectItem value="neural-network">Neural Network</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <FormLabel>Confidence Interval</FormLabel>
          <Slider
            defaultValue={[95]}
            max={99}
            min={80}
            step={1}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <div>80%</div>
            <div>95%</div>
            <div>99%</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <FormLabel>Feature Selection</FormLabel>
          <div className="flex flex-wrap gap-2">
            {["Age", "Gender", "BMI", "Income", "Location", "Smoking", "Exercise", "Diet"].map((feature) => (
              <Button
                key={feature}
                variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureSelect(feature)}
              >
                {feature}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onRunPrediction}>
          Run Prediction
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
