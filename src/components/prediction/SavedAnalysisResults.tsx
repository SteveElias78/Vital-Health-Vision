
import React from 'react';
import { format } from 'date-fns';
import { useAnalysisResults } from '@/hooks/useAnalysisResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash, BarChart2, FileText } from 'lucide-react';

interface SavedAnalysisResultsProps {
  onLoadAnalysis?: (analysis: any) => void;
}

export function SavedAnalysisResults({ onLoadAnalysis }: SavedAnalysisResultsProps) {
  const { analysisResults, isLoading, deleteResult } = useAnalysisResults();

  const handleLoadAnalysis = (analysis: any) => {
    if (onLoadAnalysis) {
      onLoadAnalysis(analysis);
    }
  };

  const getAnalysisTypeName = (type: string) => {
    const types: Record<string, string> = {
      'time-series': 'Time Series Forecast',
      'correlation': 'Correlation Analysis',
      'regression': 'Regression Analysis',
      'classification': 'Classification Model',
      'cluster': 'Cluster Analysis'
    };
    
    return types[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Analyses</CardTitle>
        <CardDescription>
          View and load your previously saved analyses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : analysisResults && analysisResults.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {analysisResults.map((analysis) => (
                <div key={analysis.id} className="flex flex-col p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        {getAnalysisTypeName(analysis.analysis_type)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.created_at && format(new Date(analysis.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => analysis.id && deleteResult(analysis.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                  
                  <div className="text-sm mt-2">
                    <p className="font-medium text-xs uppercase text-muted-foreground">Parameters</p>
                    <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(analysis.parameters, null, 2).substring(0, 100)}
                      {JSON.stringify(analysis.parameters, null, 2).length > 100 ? '...' : ''}
                    </pre>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 self-start"
                    onClick={() => handleLoadAnalysis(analysis)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Load Analysis
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p>No saved analyses found</p>
            <p className="text-sm mt-1">Run and save an analysis to see it here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
