
import React from 'react';

export interface ReliabilitySource {
  name: string;
  score: number;
  color: string;
}

export interface DataSourceReliabilityProps {
  sources?: ReliabilitySource[];
}

export const DataSourceReliability: React.FC<DataSourceReliabilityProps> = ({ 
  sources = [
    { name: 'NHANES', score: 95, color: 'green' },
    { name: 'BRFSS', score: 90, color: 'green' },
    { name: 'WHO', score: 93, color: 'green' },
    { name: 'Alternative Sources', score: 75, color: 'yellow' }
  ] 
}) => {
  return (
    <div className="rounded-lg border border-gold-300 bg-gradient-to-br from-midnight-900 to-midnight-950 overflow-hidden">
      <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4">
        <h2 className="text-xl font-light text-gold-400">
          Data Source Reliability
        </h2>
        <p className="text-sm text-gold-100/70">
          Transparency in health data integrity
        </p>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.name}>
              <div className="flex justify-between">
                <span className="text-gold-300">{source.name}</span>
                <span className={`text-${source.color}-400`}>{source.score}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-midnight-800">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r from-gold-400 to-${source.color}-400`} 
                  style={{ width: `${source.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 rounded-md bg-midnight-800 p-3 text-sm text-gold-300/70">
          <p>Data reliability scores are calculated based on sample size, methodology, and cross-validation across sources.</p>
        </div>
      </div>
    </div>
  );
};
