
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ComposableMap, Geographies, Geography, ZoomableGroup } from 'recharts';
import { HealthDataCategory } from '@/data/demo/DemoDataService';
import { Skeleton } from '@/components/ui/skeleton';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface HealthMapProps {
  category: HealthDataCategory | string;
  view?: string;
}

export const HealthMap: React.FC<HealthMapProps> = ({ category, view = 'national' }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Generate fake data for map
  useEffect(() => {
    const generateMapData = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Create data mapping for US states
        const baseValues: Record<string, number> = {
          'obesity': 34.5,
          'mental-health': 18.5,
          'lgbtq-health': 76.3,
          'chronic-disease': 10.8
        };
        
        // Use coherent patterns by region
        const regionalPatterns: Record<string, Record<string, number>> = {
          'South': {
            'obesity': 38.2,
            'mental-health': 17.8,
            'lgbtq-health': 68.5,
            'chronic-disease': 12.5
          },
          'Midwest': {
            'obesity': 35.7,
            'mental-health': 19.3,
            'lgbtq-health': 72.1,
            'chronic-disease': 11.2
          },
          'West': {
            'obesity': 30.3,
            'mental-health': 21.5,
            'lgbtq-health': 82.7,
            'chronic-disease': 9.8
          },
          'Northeast': {
            'obesity': 32.1,
            'mental-health': 20.2,
            'lgbtq-health': 84.3,
            'chronic-disease': 10.1
          }
        };
        
        // Map regions to states
        const regions: Record<string, string[]> = {
          'South': ['AL', 'AR', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'WV'],
          'Midwest': ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'],
          'West': ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NM', 'NV', 'OR', 'UT', 'WA', 'WY'],
          'Northeast': ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT']
        };
        
        // States with special values
        const specialStates: Record<string, Record<string, number>> = {
          'CA': {
            'obesity': 26.2,
            'mental-health': 20.8,
            'lgbtq-health': 85.2,
            'chronic-disease': 9.5
          },
          'CO': {
            'obesity': 24.2,
            'mental-health': 21.2,
            'lgbtq-health': 83.5,
            'chronic-disease': 8.6
          },
          'WV': {
            'obesity': 39.7,
            'mental-health': 18.1,
            'lgbtq-health': 65.2,
            'chronic-disease': 14.8
          },
          'MS': {
            'obesity': 40.8,
            'mental-health': 17.5,
            'lgbtq-health': 62.3,
            'chronic-disease': 14.2
          }
        };
        
        const baseValue = baseValues[category as HealthDataCategory] || 25;
        const variance = 10; // Maximum variance
        
        // Generate data for all states
        const stateData: any[] = [];
        
        Object.keys(regions).forEach(region => {
          regions[region].forEach(stateCode => {
            // Get regional pattern value
            const regionalBaseValue = regionalPatterns[region][category as HealthDataCategory] || baseValue;
            
            // Check if it's a special state with its own value
            const stateValue = specialStates[stateCode]?.[category as HealthDataCategory] || 
              (regionalBaseValue + (Math.random() * 4 - 2)); // Add some variance
            
            stateData.push({
              id: stateCode,
              state: stateCode,
              value: +stateValue.toFixed(1),
              fillColor: getColorForValue(
                stateValue, 
                category as HealthDataCategory
              )
            });
          });
        });
        
        setData(stateData);
        setLoading(false);
      }, 500);
    };
    
    generateMapData();
  }, [category, view]);
  
  // Get color based on value and health category
  const getColorForValue = (value: number, category: HealthDataCategory): string => {
    // Color schemes based on category and meaning
    if (category === 'obesity' || category === 'chronic-disease') {
      // Higher values are worse (reds)
      if (value >= 38) return '#ef4444';
      if (value >= 35) return '#f87171';
      if (value >= 32) return '#fca5a5';
      if (value >= 29) return '#fecaca';
      return '#fee2e2';
    } else if (category === 'mental-health') {
      // Higher values are worse for mental health conditions
      if (value >= 22) return '#7f1d1d';
      if (value >= 19) return '#991b1b';
      if (value >= 16) return '#b91c1c';
      if (value >= 13) return '#dc2626';
      return '#ef4444';
    } else {
      // For LGBTQ+ health, higher values are better (greens)
      // Since these are "access scores" where higher is better
      if (value >= 85) return '#15803d';
      if (value >= 80) return '#16a34a';
      if (value >= 75) return '#22c55e';
      if (value >= 70) return '#4ade80';
      return '#86efac';
    }
  };
  
  const handleMouseEnter = (geo: any, evt: any) => {
    const cur = data.find(s => s.id === geo.id);
    if (cur) {
      setTooltipPosition({ x: evt.clientX, y: evt.clientY });
      
      let tooltipText = `${geo.properties.name}: ${cur.value}`;
      
      if (category === 'obesity' || category === 'chronic-disease') {
        tooltipText += '%';
      } else if (category === 'mental-health') {
        tooltipText += '% prevalence';
      } else {
        tooltipText += ' access score';
      }
      
      setTooltipContent(tooltipText);
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipContent(null);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const cur = data.find(s => s.id === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={cur ? cur.fillColor : "#EEE"}
                      stroke="#FFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#666" },
                        pressed: { outline: "none", fill: "#666" }
                      }}
                      onMouseEnter={evt => handleMouseEnter(geo, evt)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </ResponsiveContainer>
      
      {/* Legend for the map */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded border">
        <h4 className="text-xs font-medium mb-1">
          {category === 'obesity' ? 'Obesity Rate (%)' : 
           category === 'mental-health' ? 'Mental Health Prevalence (%)' : 
           category === 'lgbtq-health' ? 'Healthcare Access Score' : 'Disease Prevalence (%)'}
        </h4>
        <div className="flex items-center space-x-1">
          {category === 'obesity' || category === 'chronic-disease' || category === 'mental-health' ? (
            <>
              <div className="w-3 h-3" style={{ backgroundColor: '#fee2e2' }}></div>
              <span className="text-xs">Lower</span>
              <div className="flex space-x-0.5">
                <div className="w-3 h-3" style={{ backgroundColor: '#fecaca' }}></div>
                <div className="w-3 h-3" style={{ backgroundColor: '#fca5a5' }}></div>
                <div className="w-3 h-3" style={{ backgroundColor: '#f87171' }}></div>
                <div className="w-3 h-3" style={{ backgroundColor: '#ef4444' }}></div>
              </div>
              <span className="text-xs">Higher</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3" style={{ backgroundColor: '#86efac' }}></div>
              <span className="text-xs">Lower</span>
              <div className="flex space-x-0.5">
                <div className="w-3 h-3" style={{ backgroundColor: '#4ade80' }}></div>
                <div className="w-3 h-3" style={{ backgroundColor: '#22c55e' }}></div>
                <div className="w-3 h-3" style={{ backgroundColor: '#16a34a' }}></div>
                <div className="w-3 h-3" style={{ backgroundColor: '#15803d' }}></div>
              </div>
              <span className="text-xs">Higher</span>
            </>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltipContent && (
        <div 
          className="absolute bg-background/90 backdrop-blur-sm px-2 py-1 rounded border shadow-lg pointer-events-none z-50"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y - 50,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <p className="text-sm font-medium">{tooltipContent}</p>
        </div>
      )}
    </div>
  );
};
