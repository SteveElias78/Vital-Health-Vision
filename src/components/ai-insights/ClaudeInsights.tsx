
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader, TrendingUp, ArrowUpDown, AlertTriangle, Lightbulb, Search } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface Insight {
  id: string;
  text: string;
  type: 'trend' | 'correlation' | 'outlier' | 'recommendation' | 'observation';
  timestamp: string;
}

export interface ClaudeInsightsProps {
  data: any[];
  datasetName?: string;
  visualization?: string;
  filters?: Record<string, any>;
  onInsightSelected?: (insight: Insight) => void;
}

export function ClaudeInsights({ 
  data, 
  datasetName = "health data", 
  visualization = "visualization", 
  filters = {}, 
  onInsightSelected 
}: ClaudeInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);

  // Generate prompt for Claude based on data context
  const generatePrompt = useCallback(() => {
    // Create a summary of the data for context
    const dataSize = data?.length || 0;
    const filterDescription = Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    const dataContext = `
      I'm analyzing a dataset with ${dataSize} records of ${datasetName}.
      ${filterDescription ? `The data is filtered by: ${filterDescription}.` : ''}
      ${visualization ? `I'm looking at a ${visualization} visualization of this data.` : ''}
    `;
    
    // For large datasets, include only a sample
    const sampleData = data?.slice(0, 10) || [];
    
    return {
      prompt: `${dataContext}
      
      Here's a sample of the data:
      ${JSON.stringify(sampleData, null, 2)}
      
      Please provide 3-5 insightful observations about this health data. Focus on trends, patterns, outliers, and potential correlations. When possible, suggest health implications or actionable insights.`,
      query: query || null
    };
  }, [data, datasetName, visualization, filters, query]);

  // Function to fetch insights from Claude API
  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would be replaced with your actual API implementation
      // using the Anthropic API endpoint
      const promptData = generatePrompt();
      
      // Example of an API call to Claude (implementation will vary based on your setup)
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          prompt: promptData.prompt,
          query: promptData.query
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Process Claude's response into discrete insights
      const insightText = result.completion || '';
      const insightsList = processInsightsFromText(insightText);
      
      setInsights(insightsList);
    } catch (err: any) {
      console.error('Error fetching insights from Claude:', err);
      setError('Failed to get AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [generatePrompt]);

  // Process Claude's text response into structured insights
  const processInsightsFromText = (text: string): Insight[] => {
    // Simple processing - split by numbered items or line breaks
    // In practice, you might want more sophisticated parsing
    const insightLines = text.split(/\d+\.\s+|\n\s*\n/).filter(line => line.trim().length > 0);
    
    return insightLines.map((text, index) => ({
      id: `insight-${index}`,
      text: text.trim(),
      type: detectInsightType(text),
      timestamp: new Date().toISOString(),
    }));
  };

  // Detect the type of insight (pattern, trend, outlier, etc.)
  const detectInsightType = (text: string): Insight['type'] => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('increas') || lowerText.includes('decreas') || lowerText.includes('trend')) {
      return 'trend';
    } else if (lowerText.includes('correlat') || lowerText.includes('relat') || lowerText.includes('associat')) {
      return 'correlation';
    } else if (lowerText.includes('outlier') || lowerText.includes('anomal') || lowerText.includes('unusual')) {
      return 'outlier';
    } else if (lowerText.includes('recommend') || lowerText.includes('suggest') || lowerText.includes('action')) {
      return 'recommendation';
    }
    
    return 'observation';
  };

  // Fetch insights when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      fetchInsights();
    }
  }, [data, fetchInsights]);

  // Handle user query submission
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInsights();
    setShowAskForm(false);
  };

  // Handle when user clicks on an insight
  const handleInsightClick = (insight: Insight) => {
    if (onInsightSelected) {
      onInsightSelected(insight);
    }
  };

  // Get icon for insight type
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'correlation':
        return <ArrowUpDown className="h-5 w-5 text-blue-500" />;
      case 'outlier':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Card className="border border-amber-400/30 bg-black/5">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI Insights by Claude</CardTitle>
            <CardDescription>Powered by Anthropic's Claude AI</CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20 text-amber-600"
            onClick={() => setShowAskForm(!showAskForm)}
          >
            {showAskForm ? 'Cancel' : 'Ask Claude'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {showAskForm && (
          <form onSubmit={handleQuerySubmit} className="flex space-x-2 mb-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about this data..."
              className="bg-black/5 border-amber-400/30"
            />
            <Button type="submit" className="bg-amber-400 text-black hover:bg-amber-500">
              <Search className="mr-2 h-4 w-4" />
              Ask
            </Button>
          </form>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader className="h-8 w-8 animate-spin text-amber-400" />
            <p className="text-sm text-muted-foreground">Claude is analyzing the data...</p>
          </div>
        ) : error ? (
          <div className="p-4 border border-red-500/50 rounded-md bg-red-500/10 text-center space-y-2">
            <p className="text-red-400">{error}</p>
            <Button variant="outline" onClick={fetchInsights} size="sm">Try Again</Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {insights.map((insight) => (
              <li 
                key={insight.id} 
                className="p-3 rounded-md bg-black/5 hover:bg-black/10 cursor-pointer transition-colors"
                onClick={() => handleInsightClick(insight)}
              >
                <div className="flex">
                  <div className="mr-3 mt-1">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm">{insight.text}</p>
                    <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs bg-amber-400/20 text-amber-700">
                      {capitalizeFirstLetter(insight.type)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground justify-end">
        <p>Powered by Anthropic's Claude AI</p>
      </CardFooter>
    </Card>
  );
}

export default ClaudeInsights;
