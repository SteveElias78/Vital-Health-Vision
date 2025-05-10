
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

export const PredictionModel: React.FC = () => {
  const [interventionType, setInterventionType] = useState<string>("education");
  const [modelingComplete, setModelingComplete] = useState<boolean>(true);
  
  const generatePredictionData = (interventionType: string) => {
    const baseValue = 34.5;
    const data = [];
    
    // Historical data (3 years)
    for (let i = 0; i < 3; i++) {
      data.push({
        year: 2023 + i,
        baseline: +(baseValue + (0.6 * i)).toFixed(1),
        withIntervention: null
      });
    }
    
    // Projected data (next 5 years)
    let interventionImpact = 0;
    switch (interventionType) {
      case "education":
        interventionImpact = -0.3;
        break;
      case "policy":
        interventionImpact = -0.5;
        break;
      case "healthcare":
        interventionImpact = -0.4;
        break;
      case "community":
        interventionImpact = -0.7;
        break;
      default:
        interventionImpact = -0.3;
    }
    
    const currentValue = data[data.length - 1].baseline;
    
    for (let i = 1; i <= 5; i++) {
      const baselineValue = +(currentValue + (0.6 * i)).toFixed(1);
      const interventionValue = +(currentValue + ((0.6 + interventionImpact) * i)).toFixed(1);
      
      data.push({
        year: 2025 + i,
        baseline: baselineValue,
        withIntervention: interventionValue
      });
    }
    
    return data;
  };
  
  const predictionData = generatePredictionData(interventionType);
  
  const runModel = () => {
    setModelingComplete(false);
    // Simulate model training time
    setTimeout(() => {
      setModelingComplete(true);
    }, 1500);
  };
  
  const getInterventionDescription = () => {
    switch (interventionType) {
      case "education":
        return "Health education interventions focus on improving health literacy, nutritional knowledge, and self-management skills across populations.";
      case "policy":
        return "Policy interventions include regulations on food marketing, sugar taxes, urban design requirements, and healthcare coverage mandates.";
      case "healthcare":
        return "Healthcare interventions involve provider training, preventive screenings, care coordination, and expanded treatment access.";
      case "community":
        return "Community-based interventions create supportive local environments through programs in schools, workplaces, and neighborhoods.";
      default:
        return "";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Intervention Prediction Model</CardTitle>
            <CardDescription>Projected outcomes with interventions</CardDescription>
          </div>
          <Select value={interventionType} onValueChange={setInterventionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Intervention Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">Health Education</SelectItem>
              <SelectItem value="policy">Policy Changes</SelectItem>
              <SelectItem value="healthcare">Healthcare Access</SelectItem>
              <SelectItem value="community">Community Programs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {!modelingComplete ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="loading-spinner mb-4"></div>
            <p>Running predictive model...</p>
            <p className="text-sm text-muted-foreground mt-2">Processing intervention scenarios</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={predictionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[20, 50]} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Prevalence']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="baseline"
                name="No Intervention"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="withIntervention"
                name={`With ${interventionType.charAt(0).toUpperCase() + interventionType.slice(1)} Intervention`}
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm mb-3">
          {getInterventionDescription()}
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-muted-foreground">
            Prediction confidence: {
              interventionType === "education" ? "78%" : 
              interventionType === "policy" ? "85%" : 
              interventionType === "healthcare" ? "83%" : 
              "87%"
            }
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runModel}
            disabled={!modelingComplete}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Run Model
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
