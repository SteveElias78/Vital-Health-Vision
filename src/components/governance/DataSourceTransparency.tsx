
import React, { useState } from 'react';
import { ArtDecoCard } from '@/components/artdeco/ArtDecoCard';
import { ArtDecoCardHeader } from '@/components/artdeco/ArtDecoCardHeader';
import { ArtDecoDivider } from '@/components/artdeco/ArtDecoDivider';
import { Shield, AlertTriangle, Check, Info, Eye } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'government' | 'academic' | 'alternative' | 'third-party';
  reliability: number;
  lastVerified: string;
  hasAnomaly: boolean;
  anomalyDetails?: string;
  sensitiveData: boolean;
  dataPoints: number;
  categories: string[];
}

interface DataGovernanceProps {
  title?: string;
  subtitle?: string;
  dataSources: DataSource[];
  currentSource?: string;
  onSourceSelect?: (sourceId: string) => void;
}

export const DataSourceTransparency: React.FC<DataGovernanceProps> = ({
  title = "Data Source Transparency",
  subtitle = "Ethical data governance and source verification",
  dataSources,
  currentSource,
  onSourceSelect
}) => {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  
  const handleSourceClick = (sourceId: string) => {
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
    if (onSourceSelect) {
      onSourceSelect(sourceId);
    }
  };
  
  // Calculate overall reliability score
  const overallReliability = dataSources.length > 0 
    ? dataSources.reduce((sum, source) => sum + source.reliability, 0) / dataSources.length
    : 0;
    
  // Count anomalies
  const anomalyCount = dataSources.filter(source => source.hasAnomaly).length;
  
  // Group sources by type
  const governmentSources = dataSources.filter(source => source.type === 'government');
  const academicSources = dataSources.filter(source => source.type === 'academic');
  const alternativeSources = dataSources.filter(source => source.type === 'alternative' || source.type === 'third-party');
  
  return (
    <ArtDecoCard className="w-full">
      <ArtDecoCardHeader title={title} subtitle={subtitle} />
      
      <div className="p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-midnight-800 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300/70 text-sm">Overall Reliability</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-light text-gold-400">{(overallReliability * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="bg-midnight-800 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gold-400" />
              <span className="text-gold-300/70 text-sm">Data Sources</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-light text-gold-400">{dataSources.length}</span>
            </div>
          </div>
          
          <div className="bg-midnight-800 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="text-gold-300/70 text-sm">Anomalies Detected</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-light text-amber-500">{anomalyCount}</span>
            </div>
          </div>
        </div>
        
        <ArtDecoDivider className="my-4" />
        
        {/* Government Sources */}
        {governmentSources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gold-400 text-lg font-medium mb-3">Government Sources</h3>
            <div className="space-y-2">
              {governmentSources.map(source => renderSourceCard(source))}
            </div>
          </div>
        )}
        
        {/* Academic Sources */}
        {academicSources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gold-400 text-lg font-medium mb-3">Academic Sources</h3>
            <div className="space-y-2">
              {academicSources.map(source => renderSourceCard(source))}
            </div>
          </div>
        )}
        
        {/* Alternative Sources */}
        {alternativeSources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gold-400 text-lg font-medium mb-3">Alternative Sources</h3>
            <div className="space-y-2">
              {alternativeSources.map(source => renderSourceCard(source))}
            </div>
          </div>
        )}
        
        {/* Ethics and Governance Statement */}
        <div className="mt-6 p-4 bg-midnight-800 rounded-lg border border-gold-500/20">
          <h3 className="text-gold-400 text-base font-medium">Data Ethics Statement</h3>
          <p className="text-gold-300/70 text-sm mt-2">
            Vital Health Vision is committed to transparency in data sourcing and analysis. We regularly audit our 
            data sources for reliability and accuracy. All personal health information has been anonymized, and
            we follow HIPAA guidelines for sensitive health data handling.
          </p>
        </div>
      </div>
    </ArtDecoCard>
  );
  
  function renderSourceCard(source: DataSource) {
    const isExpanded = expandedSource === source.id;
    const isSelected = currentSource === source.id;
    const reliabilityColor = source.reliability > 0.9 
      ? 'text-green-400' 
      : source.reliability > 0.7 
        ? 'text-gold-400' 
        : 'text-red-400';
        
    return (
      <div 
        key={source.id}
        className={`bg-midnight-900 rounded-lg p-4 transition-all duration-200 ${
          isExpanded ? 'border-2 border-gold-400/50' : 'border border-gold-500/20'
        } ${isSelected ? 'bg-midnight-800' : ''}`}
        onClick={() => handleSourceClick(source.id)}
        role="button"
        tabIndex={0}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {source.type === 'government' && <Shield className="w-4 h-4 text-gold-400" />}
            {source.type === 'academic' && <Info className="w-4 h-4 text-blue-400" />}
            {source.type === 'alternative' && <Eye className="w-4 h-4 text-purple-400" />}
            <h4 className="text-gold-400 font-medium">{source.name}</h4>
            {source.hasAnomaly && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className={`font-medium ${reliabilityColor}`}>
            {(source.reliability * 100).toFixed(0)}%
          </div>
        </div>
        
        {/* Basic info - always visible */}
        <div className="flex justify-between mt-2 text-xs text-gold-300/70">
          <span>Type: {source.type}</span>
          <span>Last verified: {source.lastVerified}</span>
        </div>
        
        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 space-y-3">
            <ArtDecoDivider />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gold-300/70">Data Points</p>
                <p className="text-sm text-gold-400">{source.dataPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gold-300/70">Sensitive Data</p>
                <p className="text-sm flex items-center gap-1">
                  {source.sensitiveData ? (
                    <>
                      <span className="text-amber-500">Yes</span>
                      <Shield className="w-3 h-3 text-amber-500" />
                    </>
                  ) : (
                    <>
                      <span className="text-green-500">No</span>
                      <Check className="w-3 h-3 text-green-500" />
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {source.hasAnomaly && source.anomalyDetails && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-md p-2">
                <p className="text-xs text-red-400 font-medium">Anomaly Detected</p>
                <p className="text-xs text-gold-300/70 mt-1">{source.anomalyDetails}</p>
              </div>
            )}
            
            <div className="mt-2">
              <p className="text-xs text-gold-300/70">Categories</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {source.categories.map((category, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-midnight-800 text-gold-300 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

// Sample data generator for testing
export const generateDataSources = (): DataSource[] => [
  {
    id: 'nhanes',
    name: 'NHANES Dataset 2023',
    type: 'government',
    reliability: 0.95,
    lastVerified: '2025-04-15',
    hasAnomaly: false,
    sensitiveData: true,
    dataPoints: 186500,
    categories: ['obesity', 'diabetes', 'cardiovascular']
  },
  {
    id: 'brfss',
    name: 'BRFSS Survey Data',
    type: 'government',
    reliability: 0.92,
    lastVerified: '2025-03-22',
    hasAnomaly: false,
    sensitiveData: true,
    dataPoints: 324750,
    categories: ['mental-health', 'substance-use', 'preventative-care']
  },
  {
    id: 'fenway',
    name: 'Fenway Institute LGBTQ+ Health',
    type: 'academic',
    reliability: 0.88,
    lastVerified: '2025-05-01',
    hasAnomaly: false,
    sensitiveData: true,
    dataPoints: 45200,
    categories: ['lgbtq-health', 'mental-health']
  },
  {
    id: 'govhealth',
    name: 'Government Health Records',
    type: 'government',
    reliability: 0.78,
    lastVerified: '2025-01-10',
    hasAnomaly: true,
    anomalyDetails: 'Inconsistencies detected in mental health metrics from Mar 2025 dataset',
    sensitiveData: true,
    dataPoints: 520000,
    categories: ['mental-health', 'substance-use']
  },
  {
    id: 'alt-health',
    name: 'Alternative Health Research',
    type: 'alternative',
    reliability: 0.85,
    lastVerified: '2025-04-22',
    hasAnomaly: false,
    sensitiveData: false,
    dataPoints: 28400,
    categories: ['mental-health', 'holistic-health']
  }
];
