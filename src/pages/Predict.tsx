import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { PredictionModel } from "@/components/PredictionModel";
import { ArrowRight, FileChartLine } from "lucide-react";

const Predict = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [predictionResults, setPredictionResults] = useState(false);
  
  const handleFeatureSelect = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  const handleRunPrediction = () => {
    // In a real app, this would call an API or run a model
    setTimeout(() => {
      setPredictionResults(true);
    }, 1000);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Predictive Analysis</h1>
            <p className="text-gray-500">Build and run machine learning models to predict health outcomes</p>
          </div>
          
          <Tabs defaultValue="builder">
            <TabsList className="mb-6">
              <TabsTrigger value="builder">Prediction Builder</TabsTrigger>
              <TabsTrigger value="models">Saved Models</TabsTrigger>
              <TabsTrigger value="history">Analysis History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Model configuration panel */}
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
                    <Button className="w-full" onClick={handleRunPrediction}>
                      Run Prediction
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Results panel */}
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
              </div>
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
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container px-4 text-center text-sm text-gray-500">
          © 2025 HealthTrendLens. All data provided for educational purposes only.
        </div>
      </footer>
    </div>
  );
};

export default Predict;
