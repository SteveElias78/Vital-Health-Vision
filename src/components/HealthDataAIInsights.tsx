
import { ClaudeInsights } from './ai-insights';
import { useHealthData } from '@/hooks/useHealthData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

export function HealthDataAIInsights() {
  const { data, loading, error, dataCategory } = useHealthData();
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
        <CardDescription>Claude AI-powered insights for your health data</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center">Loading data...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">Error loading data: {error}</div>
        ) : (
          <ClaudeInsights 
            data={data || []} 
            datasetName={dataCategory} 
            visualization="health dashboard"
            filters={{}}
          />
        )}
      </CardContent>
    </Card>
  );
}
