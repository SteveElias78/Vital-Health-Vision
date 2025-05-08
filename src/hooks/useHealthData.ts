
import { useState, useEffect } from "react";
import { HybridHealthDataConnector } from "@/data/connectors/HybridHealthDataConnector";
import { useDemoMode } from "./useDemoMode";
import { 
  demoChronicDiseaseData, 
  demoMentalHealthData, 
  demoLgbtqHealthData, 
  demoDataSources 
} from "@/data/demo/demoData";

export type HealthDataCategory = "obesity" | "mental-health" | "lgbtq-health";

export const useHealthData = (initialCategory: HealthDataCategory = "obesity") => {
  const [dataCategory, setDataCategory] = useState<HealthDataCategory>(initialCategory);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  
  const { isDemoMode } = useDemoMode();
  const dataConnector = new HybridHealthDataConnector();

  useEffect(() => {
    const fetchData = async () => {
      if (isDemoMode) {
        // Use demo data when in demo mode
        setLoading(true);
        try {
          setTimeout(() => {
            // Simulate API delay
            let demoData;
            switch(dataCategory) {
              case "obesity":
                demoData = demoChronicDiseaseData.filter(item => 
                  item.category === 'Obesity' || item.category === 'Diabetes'
                );
                break;
              case "mental-health":
                demoData = demoMentalHealthData;
                break;
              case "lgbtq-health":
                demoData = demoLgbtqHealthData;
                break;
              default:
                demoData = demoChronicDiseaseData;
            }
            
            setData(demoData);
            setMetadata({
              source: "Demo Data",
              lastUpdated: new Date().toISOString(),
              confidenceScore: 0.95,
              category: dataCategory
            });
            setSources(demoDataSources);
            setError(null);
            setLoading(false);
          }, 800); // Simulate network delay
        } catch (err: any) {
          setError(err.message || "An error occurred while loading demo data");
          setLoading(false);
        }
      } else {
        // Use real data connector for non-demo mode
        setLoading(true);
        setError(null);
        
        try {
          const result = await dataConnector.getHealthData(dataCategory);
          
          if (!result.data || result.data.length === 0) {
            throw new Error(`No data available for ${dataCategory}`);
          }
          
          setData(result.data);
          setMetadata(result.metadata || null);
          setSources(dataConnector.getSourcesInfo().sources || []);
          
        } catch (err: any) {
          console.error("Error fetching health data:", err);
          setError(err.message || `Failed to fetch ${dataCategory} data`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dataCategory, isDemoMode]);

  return {
    loading,
    error,
    data,
    metadata,
    sources,
    dataCategory,
    setDataCategory,
    refresh: () => setLoading(true) // Trigger a refresh by setting loading to true
  };
};

export default useHealthData;
