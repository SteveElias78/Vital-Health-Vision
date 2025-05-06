
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";

interface ModelConfigurationProps {
  onRunPrediction: (config: any) => void;
}

export const ModelConfiguration = ({ onRunPrediction }: ModelConfigurationProps) => {
  const [modelType, setModelType] = useState("time-series");
  const [horizon, setHorizon] = useState(5);
  const [confidence, setConfidence] = useState(0.95);
  const [loading, setLoading] = useState(false);
  const [includeSeasonality, setIncludeSeasonality] = useState(true);
  const [datasetId, setDatasetId] = useState("");
  
  const handleRunModel = () => {
    setLoading(true);
    
    // Create configuration object
    const config = {
      model_type: modelType,
      time_horizon: horizon,
      confidence_level: confidence,
      include_seasonality: includeSeasonality,
      dataset_id: datasetId || null,
    };
    
    // Simulate API call delay
    setTimeout(() => {
      onRunPrediction(config);
      setLoading(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Configuration</CardTitle>
        <CardDescription>
          Configure your predictive model parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model-type">Model Type</Label>
            <Select
              value={modelType}
              onValueChange={setModelType}
            >
              <SelectTrigger id="model-type">
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time-series">Time Series Forecast</SelectItem>
                <SelectItem value="regression">Regression Analysis</SelectItem>
                <SelectItem value="classification">Classification Model</SelectItem>
                <SelectItem value="cluster">Cluster Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataset">Dataset (Optional)</Label>
            <Input
              id="dataset"
              placeholder="Enter dataset ID or leave blank for demo data"
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="horizon">Time Horizon (Years)</Label>
              <span className="text-sm">{horizon}</span>
            </div>
            <Slider
              id="horizon"
              min={1}
              max={10}
              step={1}
              value={[horizon]}
              onValueChange={(value) => setHorizon(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="confidence">Confidence Level</Label>
              <span className="text-sm">{confidence * 100}%</span>
            </div>
            <Slider
              id="confidence"
              min={0.8}
              max={0.99}
              step={0.01}
              value={[confidence]}
              onValueChange={(value) => setConfidence(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="seasonality">Include Seasonality</Label>
              <Switch
                id="seasonality"
                checked={includeSeasonality}
                onCheckedChange={setIncludeSeasonality}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRunModel} 
          className="w-full"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" className="mr-2" /> : null}
          Run Prediction
        </Button>
      </CardFooter>
    </Card>
  );
};
