
import { useState } from "react";
import { PageLayout } from "./predict/PageLayout";
import { PredictTabs } from "./predict/PredictTabs";
import { ModelConfiguration } from "./predict/ModelConfiguration";
import { PredictionResults } from "./predict/PredictionResults";

const Predict = () => {
  const [predictionResults, setPredictionResults] = useState(false);
  
  const handleRunPrediction = () => {
    // In a real app, this would call an API or run a model
    setTimeout(() => {
      setPredictionResults(true);
    }, 1000);
  };
  
  return (
    <PageLayout 
      title="Predictive Analysis" 
      description="Build and run machine learning models to predict health outcomes"
    >
      <PredictTabs>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ModelConfiguration onRunPrediction={handleRunPrediction} />
          <PredictionResults predictionResults={predictionResults} />
        </div>
      </PredictTabs>
    </PageLayout>
  );
};

export default Predict;
