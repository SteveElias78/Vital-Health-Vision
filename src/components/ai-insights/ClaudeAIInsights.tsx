
import React, { useState, useEffect } from 'react';
import { claudeService, InsightType } from '@/services/ClaudeService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader, Lightbulb, TrendingUp, Zap, Activity } from 'lucide-react';
import { HealthDataCategory } from '@/data/demo/DemoDataService';
import { AIChatBox } from './AIChatBox';

interface ClaudeAIInsightsProps {
  data: any;
  dataSource: HealthDataCategory | string;
  metric?: string;
}

export const ClaudeAIInsights: React.FC<ClaudeAIInsightsProps> = ({ 
  data, 
  dataSource,
  metric = 'health'
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<InsightType, string>>({
    summary: '',
    trends: '',
    recommendations: '',
    correlations: ''
  });
  const [insightTab, setInsightTab] = useState<InsightType>('summary');
  const [showChatbox, setShowChatbox] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For demo purposes, we'll use the preset insights from the Claude service
        const insight = await claudeService.generateInsight(dataSource as HealthDataCategory, insightTab);
        
        setInsights(prev => ({
          ...prev,
          [insightTab]: insight.content
        }));
      } catch (err: any) {
        console.error('Error fetching AI insights:', err);
        setError(err.message || 'Failed to generate AI insights');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [dataSource, insightTab]);
  
  const getTabIcon = (type: InsightType) => {
    switch (type) {
      case 'summary':
        return <Lightbulb className="h-4 w-4" />;
      case 'trends':
        return <TrendingUp className="h-4 w-4" />;
      case 'recommendations':
        return <Zap className="h-4 w-4" />;
      case 'correlations':
        return <Activity className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Claude AI Insights</span>
              <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">Beta</span>
            </CardTitle>
            <CardDescription>
              AI-generated analysis from health data
            </CardDescription>
          </div>
          
          {!showChatbox && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowChatbox(true)}
              className="text-xs"
            >
              Ask Questions
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {showChatbox ? (
          <div className="space-y-2">
            <AIChatBox 
              category={dataSource as HealthDataCategory} 
              onClose={() => setShowChatbox(false)}
              metric={metric}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <Tabs value={insightTab} onValueChange={(value) => setInsightTab(value as InsightType)}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="summary" className="text-xs flex items-center gap-1">
                  {getTabIcon('summary')}
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="text-xs flex items-center gap-1">
                  {getTabIcon('trends')}
                  <span className="hidden sm:inline">Trends</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="text-xs flex items-center gap-1">
                  {getTabIcon('recommendations')}
                  <span className="hidden sm:inline">Recommendations</span>
                </TabsTrigger>
                <TabsTrigger value="correlations" className="text-xs flex items-center gap-1">
                  {getTabIcon('correlations')}
                  <span className="hidden sm:inline">Correlations</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-3 min-h-[150px] p-3 border rounded-md">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    <span>Analyzing data...</span>
                  </div>
                ) : error ? (
                  <div className="text-red-500">Error: {error}</div>
                ) : (
                  <p className="text-sm">{insights[insightTab]}</p>
                )}
              </div>
            </Tabs>
            
            <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
              <div>Powered by Claude AI</div>
              <div>Confidence Score: {insightTab === 'summary' ? '92%' : insightTab === 'trends' ? '87%' : insightTab === 'recommendations' ? '82%' : '89%'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
