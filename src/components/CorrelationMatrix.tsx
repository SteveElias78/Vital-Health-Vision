
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CorrelationMatrix() {
  // This would normally be implemented with more advanced visualization libraries
  // For now, we'll just create a placeholder grid
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>Relationships between health factors</CardDescription>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select factors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factors</SelectItem>
            <SelectItem value="lifestyle">Lifestyle Factors</SelectItem>
            <SelectItem value="environmental">Environmental</SelectItem>
            <SelectItem value="demographic">Demographic</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-1 text-xs font-medium">
          <div className="p-2"></div>
          <div className="rounded bg-gray-100 p-2 text-center">Obesity</div>
          <div className="rounded bg-gray-100 p-2 text-center">Smoking</div>
          <div className="rounded bg-gray-100 p-2 text-center">Exercise</div>
          <div className="rounded bg-gray-100 p-2 text-center">Diet</div>
          
          <div className="rounded bg-gray-100 p-2">Heart Disease</div>
          <div className="rounded bg-health-purple/20 p-2 text-center">0.68</div>
          <div className="rounded bg-health-purple/30 p-2 text-center">0.72</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.54</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.49</div>
          
          <div className="rounded bg-gray-100 p-2">Diabetes</div>
          <div className="rounded bg-health-purple/30 p-2 text-center">0.75</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">0.42</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.58</div>
          <div className="rounded bg-health-purple/20 p-2 text-center">-0.63</div>
          
          <div className="rounded bg-gray-100 p-2">Hypertension</div>
          <div className="rounded bg-health-purple/20 p-2 text-center">0.62</div>
          <div className="rounded bg-health-purple/20 p-2 text-center">0.59</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.48</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.51</div>
          
          <div className="rounded bg-gray-100 p-2">Stroke</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">0.45</div>
          <div className="rounded bg-health-purple/20 p-2 text-center">0.67</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.39</div>
          <div className="rounded bg-health-purple/10 p-2 text-center">-0.41</div>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Correlation strength: darker colors indicate stronger correlation</p>
        </div>
      </CardContent>
    </Card>
  );
}
