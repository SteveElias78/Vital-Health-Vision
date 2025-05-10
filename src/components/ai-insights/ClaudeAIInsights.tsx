
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { Insight, DataSourceInfo, ClaudeAIInsightsProps, ClaudeAPIResponse } from './types';

/**
 * ClaudeAIInsights component provides AI-powered analysis of health data
 */
export const ClaudeAIInsights: React.FC<ClaudeAIInsightsProps> = ({ 
  data, 
  dataSource = "Unknown",
  metric = "health", 
  onInsightGenerated = () => {} 
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dataSourceInfo, setDataSourceInfo] = useState<DataSourceInfo>({
    name: dataSource,
    reliability: "high",
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    if (data && data.length > 0) {
      generateInitialInsights();
    }
  }, [data]);

  useEffect(() => {
    setDataSourceInfo({
      name: dataSource,
      reliability: dataSource.includes("NHANES") || dataSource.includes("WHO") ? "high" : "medium",
      lastUpdated: new Date().toISOString()
    });
  }, [dataSource]);

  const generateInitialInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your backend API
      // which then calls Claude's API with your data
      const response = await mockClaudeAPICall(
        `Analyze this ${metric} health data from ${dataSource} and provide 3 key insights.`,
        data
      );
      
      if (response.insights) {
        setInsights(response.insights);
        onInsightGenerated(response.insights);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockClaudeAPICall(query, data);
      
      if (response.answer) {
        // Add the new insight to the top of the list
        const newInsight: Insight = {
          id: Date.now(),
          question: query,
          answer: response.answer,
          confidence: response.confidence,
          timestamp: new Date().toISOString()
        };
        
        const newInsights = [newInsight, ...insights];
        setInsights(newInsights);
        setQuery("");
        
        onInsightGenerated(newInsights);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process your question");
    } finally {
      setLoading(false);
    }
  };

  // Mock function - would be replaced with actual API call in production
  const mockClaudeAPICall = async (prompt: string, data: any): Promise<ClaudeAPIResponse> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // This is where you'd actually call Claude's API with your data
    // For now we'll return mock insights based on the metric
    if (Math.random() < 0.1) {
      throw new Error("API request failed");
    }
    
    if (prompt.includes("Analyze")) {
      return {
        insights: [
          {
            id: 1,
            type: "trend",
            content: `There appears to be a significant ${Math.random() > 0.5 ? "upward" : "downward"} trend in ${metric} metrics over the analyzed time period.`,
            confidence: 0.87,
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: "correlation",
            content: `The data shows a potential correlation between ${metric} and demographic factors, particularly in regions with limited healthcare access.`,
            confidence: 0.76,
            timestamp: new Date().toISOString()
          },
          {
            id: 3,
            type: "anomaly",
            content: `Several data points from ${dataSource} show unexpected values that may warrant further investigation or validation.`,
            confidence: 0.65,
            timestamp: new Date().toISOString()
          }
        ]
      };
    } else {
      return {
        answer: `Based on the ${metric} data from ${dataSource}, ${prompt.includes("compare") ? "the comparison shows varying patterns across demographics" : "the analysis suggests a complex relationship between multiple factors"}. Further data collection may help clarify these patterns.`,
        confidence: 0.82
      };
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence > 0.8) {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> High</span>;
    } else if (confidence > 0.6) {
      return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Medium</span>;
    } else {
      return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"><AlertCircle className="w-3 h-3 mr-1" /> Low</span>;
    }
  };

  const renderDataSourceInfo = () => (
    <div className="mt-2 text-xs text-muted-foreground">
      <div className="flex items-center justify-between">
        <span>Source: {dataSourceInfo.name}</span>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          dataSourceInfo.reliability === "high" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {dataSourceInfo.reliability === "high" ? "Verified Source" : "Standard Source"}
        </span>
      </div>
      <div className="mt-1">
        Last updated: {new Date(dataSourceInfo.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <Card className="border border-amber-400/30 bg-black/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Claude AI Insights
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your health data
        </CardDescription>
        {renderDataSourceInfo()}
      </CardHeader>
      
      <CardContent className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Analyzing data...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-700 rounded-lg p-3 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {error}
          </div>
        )}
        
        {!loading && !error && insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No insights available yet. Ask a question about your health data.
          </div>
        )}
        
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className="bg-black/5 border border-amber-400/20 rounded-lg p-3 hover:border-amber-400/40 transition-colors"
          >
            {insight.question && (
              <div className="mb-2 font-medium">{insight.question}</div>
            )}
            
            <div className="text-sm">
              {insight.content || insight.answer}
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div>
                {insight.confidence && getConfidenceBadge(insight.confidence)}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(insight.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="bg-black/5 border-t border-amber-400/20 p-4">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Ask about this health data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuery()}
            className="flex-grow bg-white/10"
          />
          <Button 
            onClick={handleSubmitQuery}
            disabled={loading || !query.trim()}
            className="bg-amber-400 hover:bg-amber-500 text-black"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClaudeAIInsights;
