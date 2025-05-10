
import React, { useEffect } from 'react';
import { useClaudeAnalysis } from '@/hooks/useClaudeAnalysis';
import { Loader, Lightbulb, Brain, TrendingUp, Sparkles } from 'lucide-react';

interface ClaudeAIInsightsProps {
  data: any[];
  dataSource: string;
  metric: string;
}

export const ClaudeAIInsights: React.FC<ClaudeAIInsightsProps> = ({
  data,
  dataSource,
  metric
}) => {
  const { loading, error, results, analyzeData } = useClaudeAnalysis();
  
  useEffect(() => {
    if (data && data.length > 0) {
      analyzeData(data, { 
        category: dataSource, 
        metric: metric 
      });
    }
  }, [data, dataSource, metric, analyzeData]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Brain className="h-10 w-10 text-gold-400/50 animate-pulse mb-2" />
        <div className="text-center">
          <p className="text-gold-400 font-light text-lg">Analyzing data with Claude</p>
          <p className="text-gold-300/70 text-sm">Generating insights and recommendations...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-500/30 rounded-md bg-red-900/20 text-red-300">
        <h3 className="font-medium mb-2">Analysis Error</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Lightbulb className="h-10 w-10 text-gold-400/50 mb-2" />
        <p className="text-gold-400 font-light text-lg">AI Analysis Ready</p>
        <p className="text-gold-300/70 text-sm">Select data to analyze for AI-powered insights</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* AI Analysis Header */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mr-3">
          <Brain className="h-5 w-5 text-gold-400" />
        </div>
        <div>
          <h3 className="text-lg font-light text-gold-400">Claude AI Analysis</h3>
          <p className="text-sm text-gold-300/70">Intelligent insights based on your data</p>
        </div>
      </div>
      
      {/* Insights */}
      <div className="p-4 border border-gold-500/20 rounded-md bg-midnight-900/50">
        <p className="text-gold-300/90">{results.insights}</p>
      </div>
      
      {/* Key Findings */}
      <div>
        <div className="flex items-center mb-2">
          <TrendingUp className="h-4 w-4 text-gold-400 mr-2" />
          <h4 className="text-gold-400 font-medium">Key Findings</h4>
        </div>
        <ul className="space-y-1 text-sm">
          {results.keyFindings.map((finding, index) => (
            <li key={index} className="text-gold-300/90 flex items-start">
              <span className="text-gold-400/70 mr-2">•</span>
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Recommendations */}
      <div>
        <div className="flex items-center mb-2">
          <Sparkles className="h-4 w-4 text-gold-400 mr-2" />
          <h4 className="text-gold-400 font-medium">Recommendations</h4>
        </div>
        <ul className="space-y-1 text-sm">
          {results.recommendations.map((recommendation, index) => (
            <li key={index} className="text-gold-300/90 flex items-start">
              <span className="text-gold-400/70 mr-2">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Correlations if available */}
      {results.correlations && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <svg className="h-4 w-4 text-gold-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12h20M12 2v20M22 16l-4-4 4-4M6 8l-4 4 4 4" />
            </svg>
            <h4 className="text-gold-400 font-medium">Key Correlations</h4>
          </div>
          <div className="space-y-2">
            {results.correlations.map((correlation, index) => {
              // Determine color based on correlation strength
              const strengthColor = 
                correlation.correlationStrength > 0.7 ? "text-green-400" : 
                correlation.correlationStrength > 0.5 ? "text-blue-400" :
                correlation.correlationStrength > 0.3 ? "text-yellow-400" :
                correlation.correlationStrength > 0 ? "text-orange-400" : "text-red-400";
              
              const strengthText = 
                Math.abs(correlation.correlationStrength) > 0.7 ? "Strong" :
                Math.abs(correlation.correlationStrength) > 0.5 ? "Moderate" :
                Math.abs(correlation.correlationStrength) > 0.3 ? "Weak" : "Very Weak";
              
              return (
                <div key={index} className="text-sm border border-gold-500/10 rounded bg-midnight-900/30 p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gold-300 font-medium">{correlation.metric}</span>
                    <span className={`${strengthColor} font-medium`}>
                      {strengthText} ({correlation.correlationStrength > 0 ? '+' : ''}{correlation.correlationStrength.toFixed(2)})
                    </span>
                  </div>
                  <p className="text-gold-300/70 text-xs">{correlation.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
