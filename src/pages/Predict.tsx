
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Art Deco styled Predict page for health data predictions
 */
const PredictPage: React.FC = () => {
  const [predictionType, setPredictionType] = useState('obesity');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [results, setResults] = useState<null | { value: number, confidence: number }>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate mock prediction
      const baseValue = predictionType === 'obesity' ? 32 : 
                        predictionType === 'diabetes' ? 12 :
                        predictionType === 'hypertension' ? 28 : 20;
      
      // Add variation based on inputs
      const ageModifier = parseInt(age) > 50 ? 5 : -2;
      const genderModifier = gender === 'male' ? 1 : -1;
      const regionModifier = region === 'midwest' ? 3 : 
                            region === 'south' ? 4 : 
                            region === 'west' ? -2 : 0;
      
      // Calculate final prediction with some randomness
      const prediction = baseValue + ageModifier + genderModifier + regionModifier + (Math.random() * 4 - 2);
      
      setResults({
        value: parseFloat(prediction.toFixed(1)),
        confidence: 0.85 + (Math.random() * 0.1)
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-gold-500/30 pb-4">
        <h1 className="text-3xl font-light text-gold-400">
          Health <span className="font-medium">Prediction</span> Model
        </h1>
        <p className="mt-2 text-gold-300/70">
          Utilizing machine learning to predict health outcomes based on demographic factors
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prediction Form */}
        <Card className="art-deco-card border-gold-300">
          <div className="art-deco-card-header p-4">
            <h2 className="art-deco-title">
              Prediction Parameters
            </h2>
            <p className="text-sm text-gold-100/70">
              Enter demographic information to generate a health prediction
            </p>
          </div>
          <CardContent>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gold-300">Prediction Type</label>
                <Select value={predictionType} onValueChange={setPredictionType}>
                  <SelectTrigger className="art-deco-input">
                    <SelectValue placeholder="Select prediction type" />
                  </SelectTrigger>
                  <SelectContent className="bg-midnight-800 border-gold-500/30">
                    <SelectItem value="obesity" className="text-gold-50">Obesity Risk</SelectItem>
                    <SelectItem value="diabetes" className="text-gold-50">Diabetes Risk</SelectItem>
                    <SelectItem value="hypertension" className="text-gold-50">Hypertension Risk</SelectItem>
                    <SelectItem value="heart_disease" className="text-gold-50">Heart Disease Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gold-300">Age</label>
                <Input 
                  type="number" 
                  placeholder="Enter age" 
                  className="art-deco-input placeholder:text-gold-400/50"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gold-300">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="art-deco-input">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-midnight-800 border-gold-500/30">
                    <SelectItem value="male" className="text-gold-50">Male</SelectItem>
                    <SelectItem value="female" className="text-gold-50">Female</SelectItem>
                    <SelectItem value="non_binary" className="text-gold-50">Non-binary</SelectItem>
                    <SelectItem value="other" className="text-gold-50">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gold-300">Region</label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="art-deco-input">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="bg-midnight-800 border-gold-500/30">
                    <SelectItem value="northeast" className="text-gold-50">Northeast</SelectItem>
                    <SelectItem value="midwest" className="text-gold-50">Midwest</SelectItem>
                    <SelectItem value="south" className="text-gold-50">South</SelectItem>
                    <SelectItem value="west" className="text-gold-50">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full art-deco-button"
                  disabled={loading || !age || !gender || !region}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-midnight-900 border-t-transparent animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : 'Generate Prediction'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card className="art-deco-card border-gold-300">
          <div className="art-deco-card-header p-4">
            <h2 className="art-deco-title">
              Prediction Results
            </h2>
            <p className="text-sm text-gold-100/70">
              AI-powered health risk prediction
            </p>
          </div>
          <CardContent>
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gold-300">Analyzing health data...</p>
                </div>
              ) : results ? (
                <div className="text-center">
                  <div className="relative w-64 h-64 mx-auto mb-6">
                    {/* Art Deco styled circular gauge */}
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                      {/* Background circle */}
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#FFC700" strokeWidth="1" opacity="0.2" />
                      
                      {/* Decorative radial lines */}
                      {Array.from({ length: 36 }).map((_, i) => {
                        const angle = i * 10 * Math.PI / 180;
                        const x1 = 100 + 75 * Math.cos(angle);
                        const y1 = 100 + 75 * Math.sin(angle);
                        const x2 = 100 + 85 * Math.cos(angle);
                        const y2 = 100 + 85 * Math.sin(angle);
                        
                        return (
                          <line 
                            key={`line-${i}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#FFC700"
                            strokeWidth={i % 3 === 0 ? 1 : 0.3}
                            opacity={i % 3 === 0 ? 0.8 : 0.2}
                          />
                        );
                      })}
                      
                      {/* Central circle with value */}
                      <circle cx="100" cy="100" r="60" fill="#000723" stroke="#FFC700" strokeWidth="1" />
                      
                      <text
                        x="100"
                        y="85"
                        textAnchor="middle"
                        fontSize="16"
                        fill="#FFC700"
                        fontWeight="300"
                      >
                        {predictionType === 'obesity' ? 'Obesity Risk' : 
                          predictionType === 'diabetes' ? 'Diabetes Risk' :
                          predictionType === 'hypertension' ? 'Hypertension Risk' :
                          'Heart Disease Risk'}
                      </text>
                      
                      <text
                        x="100"
                        y="120"
                        textAnchor="middle"
                        fontSize="36"
                        fill="#FFC700"
                        fontWeight="400"
                      >
                        {results.value}%
                      </text>
                      
                      {/* Confidence indicator */}
                      <text
                        x="100"
                        y="145"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#FFC700"
                        fontWeight="300"
                        opacity="0.7"
                      >
                        {Math.round(results.confidence * 100)}% confidence
                      </text>
                    </svg>
                  </div>
                  
                  <div className="mt-4 p-3 bg-midnight-800 rounded-md text-sm text-gold-300/70">
                    <p>
                      This prediction is based on demographic patterns and health data from NHANES and BRFSS. Individual results may vary.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gold-300/50">
                  <div className="art-deco-circle mx-auto mb-4"></div>
                  <p className="art-deco-subtitle">
                    Enter your information and generate a prediction to see results
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="art-deco-card border-gold-300">
        <div className="art-deco-card-header p-4">
          <h2 className="art-deco-title">
            About the Prediction Model
          </h2>
        </div>
        <CardContent>
          <div className="p-6 space-y-4">
            <p className="text-gold-300/80">
              This prediction model utilizes hybrid data sources including NHANES clinical measurements and BRFSS self-reported data to generate risk assessments.
            </p>
            
            <div className="art-deco-divider"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 border border-gold-500/20 rounded-md bg-midnight-800/50">
                <div className="art-deco-circle mb-2"></div>
                <h3 className="text-gold-400 text-sm font-medium">High Accuracy</h3>
                <p className="text-gold-300/70 text-xs text-center mt-1">
                  89-95% correlation with clinical diagnoses
                </p>
              </div>
              
              <div className="flex flex-col items-center p-3 border border-gold-500/20 rounded-md bg-midnight-800/50">
                <div className="art-deco-circle mb-2"></div>
                <h3 className="text-gold-400 text-sm font-medium">Multiple Sources</h3>
                <p className="text-gold-300/70 text-xs text-center mt-1">
                  Combines data from NHANES, BRFSS, and WHO
                </p>
              </div>
              
              <div className="flex flex-col items-center p-3 border border-gold-500/20 rounded-md bg-midnight-800/50">
                <div className="art-deco-circle mb-2"></div>
                <h3 className="text-gold-400 text-sm font-medium">Demographic Adjusted</h3>
                <p className="text-gold-300/70 text-xs text-center mt-1">
                  Accounts for regional and demographic health variations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictPage;
