
import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, RefreshCw, MessageSquare, BarChart4, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthInsight, InsightType, claudeService } from '@/services/ClaudeService';
import { HealthDataCategory } from '@/data/demo/DemoDataService';

interface ClaudeAIInsightsProps {
  data: any[];
  dataSource: HealthDataCategory;
  metric: string;
}

export const ClaudeAIInsights: React.FC<ClaudeAIInsightsProps> = ({ 
  data, 
  dataSource, 
  metric 
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [activeTab, setActiveTab] = useState<InsightType>('summary');
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatQuery, setChatQuery] = useState<string>('');
  const [chatResponse, setChatResponse] = useState<string>('');
  const [processingChat, setProcessingChat] = useState<boolean>(false);
  const [queryHistory, setQueryHistory] = useState<{query: string, response: string}[]>([]);

  // Fetch insights when data source changes
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const insightsData = await claudeService.generateDashboardInsights(dataSource);
        setInsights(insightsData);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to generate insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [dataSource]);

  // Fetch a specific insight type
  const fetchInsightType = async (type: InsightType) => {
    if (insights.some(i => i.insightType === type)) {
      setActiveTab(type);
      return;
    }
    
    setLoading(true);
    try {
      const insight = await claudeService.generateInsight(dataSource, type);
      setInsights(prev => [...prev.filter(i => i.insightType !== type), insight]);
      setActiveTab(type);
    } catch (err) {
      console.error('Error fetching specific insight:', err);
      setError(`Failed to generate ${type} insight. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle chat query
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatQuery.trim()) return;
    
    setProcessingChat(true);
    try {
      const response = await claudeService.processQuery(chatQuery, { category: dataSource });
      setChatResponse(response);
      setQueryHistory(prev => [...prev, { query: chatQuery, response }]);
      setChatQuery('');
    } catch (err) {
      console.error('Error processing query:', err);
      setChatResponse('Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setProcessingChat(false);
    }
  };

  // Get current insight based on active tab
  const currentInsight = insights.find(i => i.insightType === activeTab);

  // Render loading state
  if (loading && insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>Generating insights from your health data</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gold-400 mb-2" />
            <p className="text-gold-300">Claude AI is analyzing your data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error && insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>Claude AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => fetchInsightType('summary')}
            className="w-full"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-midnight-900 border-b border-gold-500/30">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-gold-400">Claude AI Analysis</CardTitle>
            <CardDescription className="text-gold-300/70">
              AI-powered insights for {dataSource.replace('-', ' ')} data
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant={chatOpen ? "default" : "outline"}
            onClick={() => setChatOpen(!chatOpen)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask Claude
          </Button>
        </div>
      </CardHeader>
      
      {!chatOpen ? (
        <>
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => fetchInsightType(value as InsightType)}
            className="w-full"
          >
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
                <TabsTrigger value="trends" className="text-xs">Trends</TabsTrigger>
                <TabsTrigger value="recommendations" className="text-xs">Recommendations</TabsTrigger>
              </TabsList>
            </div>
            
            {currentInsight && (
              <TabsContent value={currentInsight.insightType} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gold-400">{currentInsight.title}</h4>
                    <div className="flex items-center">
                      {currentInsight.insightType === 'trends' && <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />}
                      {currentInsight.insightType === 'recommendations' && <Check className="h-4 w-4 text-green-400 mr-1" />}
                      {currentInsight.insightType === 'correlations' && <BarChart4 className="h-4 w-4 text-purple-400 mr-1" />}
                      <span className="text-xs opacity-70">
                        {currentInsight.confidenceScore ? `${(currentInsight.confidenceScore * 100).toFixed(0)}% confidence` : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{currentInsight.content}</p>
                  
                  {currentInsight.sources && currentInsight.sources.length > 0 && (
                    <div className="mt-4 pt-2 border-t border-gold-500/20">
                      <p className="text-xs opacity-70">
                        Sources: {currentInsight.sources.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          <CardFooter className="pt-0 px-6 pb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={() => fetchInsightType('correlations')}
            >
              <BarChart4 className="h-4 w-4 mr-2" />
              View Correlations
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="p-4">
          <div className="rounded-lg border bg-card p-3 h-[300px] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-3 space-y-4 p-1">
              {queryHistory.length > 0 ? (
                queryHistory.map((entry, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-primary-foreground p-2 rounded-lg ml-auto max-w-[80%] text-sm">
                      {entry.query}
                    </div>
                    <div className="bg-muted p-3 rounded-lg mr-auto max-w-[80%] text-sm">
                      {entry.response}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-6">
                  <MessageSquare className="h-10 w-10 mb-2 mx-auto opacity-50" />
                  <p>Ask Claude about the health data</p>
                  <p className="text-xs mt-1 max-w-[80%] mx-auto">
                    Try questions like "What trends do you see?" or "What factors correlate with obesity rates?"
                  </p>
                </div>
              )}
              
              {chatResponse && (
                <div className="space-y-2">
                  <div className="bg-primary-foreground p-2 rounded-lg ml-auto max-w-[80%] text-sm">
                    {chatQuery}
                  </div>
                  <div className="bg-muted p-3 rounded-lg mr-auto max-w-[80%] text-sm">
                    {chatResponse}
                  </div>
                </div>
              )}
              
              {processingChat && (
                <div className="flex items-center justify-center py-2">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-xs">Claude is thinking...</span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask about this health data..."
                className="flex-1 min-w-0 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={processingChat}
              />
              <Button type="submit" size="sm" disabled={processingChat || !chatQuery.trim()}>
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
