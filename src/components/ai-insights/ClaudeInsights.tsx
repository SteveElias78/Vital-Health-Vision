
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, TrendingUp, ArrowUpDown, AlertTriangle, Lightbulb, Search } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { createApiClient } from '@/utils/apiClientFactory';
import { ApiKeyUtils } from '@/utils/api-keys';

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
      // Check if we have access to Anthropic API
      if (!ApiKeyUtils.hasAccessToSource('ANTHROPIC_API')) {
        toast({
          title: "API Key Missing",
          description: "Please add your Anthropic API key in settings to enable AI insights",
          variant: "destructive"
        });
        throw new Error('Anthropic API key is missing');
      }
      
      const promptData = generatePrompt();
      
      // Create an API client for the Claude API
      const client = createApiClient('/api/claude', {
        authSource: 'ANTHROPIC_API'
      });
      
      const response = await client.post('', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        prompt: promptData.prompt,
        query: promptData.query
      });
      
      // Process Claude's response into discrete insights
      const insightText = response.data.completion || '';
      const insightsList = processInsightsFromText(insightText);
      
      setInsights(insightsList);
      
      toast({
        title: "Insights Generated",
        description: `Generated ${insightsList.length} insights from your data`
      });
    } catch (err: any) {
      console.error('Error fetching insights from Claude:', err);
      setError('Failed to get AI insights. Please try again later.');
      
      toast({
        title: "Error",
        description: err.message || 'Failed to get AI insights',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [generatePrompt]);

  // Process Claude's text response into structured insights
  const processInsightsFromText = (text: string): Insight[] => {
    // Split by numbered items or line breaks
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

  return (
    <Card className="claude-insights-container border-amber-400/50">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <div>
          <CardTitle>AI Insights by Claude</CardTitle>
          <CardDescription>Powered by Anthropic's Claude AI</CardDescription>
        </div>
        <Button 
          variant="outline" 
          className="bg-amber-400 text-black hover:bg-amber-500"
          onClick={() => setShowAskForm(!showAskForm)}
        >
          {showAskForm ? 'Cancel' : 'Ask Claude'}
        </Button>
      </CardHeader>
      
      <CardContent>
        {showAskForm && (
          <form onSubmit={handleQuerySubmit} className="flex space-x-2 mb-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about this data..."
              className="bg-black/10 border-amber-400/50"
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
                className={`p-3 rounded-md border border-amber-400/30 bg-black/10 hover:bg-black/20 cursor-pointer transition-colors`}
                onClick={() => handleInsightClick(insight)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{insight.text}</p>
                    <span className="text-xs text-amber-400 mt-2 inline-block">
                      {capitalizeFirstLetter(insight.type)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            
            {insights.length === 0 && !loading && !error && (
              <div className="text-center p-6 text-muted-foreground">
                <p>No insights available. Try changing your data selection or asking a specific question.</p>
              </div>
            )}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 border-t border-amber-400/20 flex justify-between">
        <span className="text-xs text-muted-foreground">
          {insights.length > 0 ? `${insights.length} insights generated` : ''}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchInsights} 
          disabled={loading}
          className="text-xs"
        >
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to get icon for insight type
function getInsightIcon(type: string) {
  switch (type) {
    case 'trend':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'correlation':
      return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
    case 'outlier':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'recommendation':
      return <Lightbulb className="h-4 w-4 text-purple-500" />;
    default:
      return <Search className="h-4 w-4 text-gray-500" />;
  }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
