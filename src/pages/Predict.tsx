
import { useState } from "react";
import { PageLayout } from "./predict/PageLayout";
import { PredictTabs } from "./predict/PredictTabs";
import { ModelConfiguration } from "./predict/ModelConfiguration";
import { PredictionResults } from "./predict/PredictionResults";
import { SavedAnalysisResults } from "@/components/prediction/SavedAnalysisResults";

const Predict = () => {
  const [predictionResults, setPredictionResults] = useState(false);
  const [modelConfig, setModelConfig] = useState(null);
  
  const handleRunPrediction = (config: any) => {
    // Save the model configuration
    setModelConfig(config);
    
    // In a real app, this would call an API or run a model
    setTimeout(() => {
      setPredictionResults(true);
    }, 1000);
  };
  
  const handleLoadSavedAnalysis = (analysis: any) => {
    // Load a saved analysis
    setModelConfig(analysis.parameters);
    setPredictionResults(true);
    
    // Notify the user
    console.log("Loaded saved analysis:", analysis);
  };
  
  return (
    <PageLayout 
      title="Predictive Analysis" 
      description="Build and run machine learning models to predict health outcomes"
    >
      <PredictTabs>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <ModelConfiguration onRunPrediction={handleRunPrediction} />
            <div className="mt-6">
              <SavedAnalysisResults onLoadAnalysis={handleLoadSavedAnalysis} />
            </div>
          </div>
          <PredictionResults 
            predictionResults={predictionResults}
            modelConfig={modelConfig}
          />
        </div>
      </PredictTabs>
    </PageLayout>
  );
};

export default Predict;
