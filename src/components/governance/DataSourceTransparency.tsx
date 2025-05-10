
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { faker } from '@faker-js/faker';

interface DataSource {
  id: string;
  name: string;
  organization: string;
  description: string;
  lastUpdated: string;
  qualityScore: number;
  completeness: number;
  documentation: number;
  transparency: number;
  methodology: string;
  limitations: string[];
  url?: string;
}

interface DataSourceTransparencyProps {
  dataSources: DataSource[];
}

export const DataSourceTransparency: React.FC<DataSourceTransparencyProps> = ({
  dataSources
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(dataSources[0]?.id || '');
  
  const selectedSource = dataSources.find(source => source.id === selectedSourceId);
  
  // Helper to render quality score with appropriate color
  const renderQualityScore = (score: number) => {
    let color;
    if (score >= 90) color = 'bg-emerald-500';
    else if (score >= 80) color = 'bg-green-500';
    else if (score >= 70) color = 'bg-yellow-500';
    else if (score >= 60) color = 'bg-amber-500';
    else color = 'bg-red-500';
    
    return (
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full ${color} mr-2`}></div>
        <span>{score}</span>
      </div>
    );
  };
  
  return (
    <Card className="art-deco-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-gold-400">Data Governance Transparency</CardTitle>
        <CardDescription className="text-gold-300/70">
          Detailed information about data sources, quality metrics, and governance policies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="art-deco-tabs">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
            <TabsTrigger value="policies">Governance Policies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="border border-gold-500/30 rounded-lg overflow-hidden">
                  <div className="bg-midnight-800 p-3 border-b border-gold-500/30">
                    <h3 className="text-gold-400 font-medium">Data Sources</h3>
                  </div>
                  <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                    {dataSources.map(source => (
                      <div 
                        key={source.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedSourceId === source.id 
                            ? 'bg-gold-500/20 border border-gold-500/50' 
                            : 'hover:bg-midnight-800 border border-transparent'
                        }`}
                        onClick={() => setSelectedSourceId(source.id)}
                      >
                        <div className="text-gold-400 font-medium">{source.name}</div>
                        <div className="text-gold-300/70 text-sm truncate">{source.organization}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                {selectedSource ? (
                  <div className="border border-gold-500/30 rounded-lg overflow-hidden">
                    <div className="bg-midnight-800 p-3 border-b border-gold-500/30 flex items-center justify-between">
                      <h3 className="text-gold-400 font-medium">{selectedSource.name}</h3>
                      {renderQualityScore(selectedSource.qualityScore)}
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-gold-300 font-medium mb-1">Description</div>
                        <p className="text-gold-300/80">{selectedSource.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-gold-300 font-medium mb-1">Organization</div>
                          <p className="text-gold-300/80">{selectedSource.organization}</p>
                        </div>
                        <div>
                          <div className="text-gold-300 font-medium mb-1">Last Updated</div>
                          <p className="text-gold-300/80">{selectedSource.lastUpdated}</p>
                        </div>
                        <div>
                          <div className="text-gold-300 font-medium mb-1">Documentation</div>
                          <div className="w-full bg-midnight-800 rounded-full h-2">
                            <div 
                              className="bg-gold-500 h-2 rounded-full"
                              style={{ width: `${selectedSource.documentation}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gold-300 font-medium mb-1">Methodology</div>
                        <p className="text-gold-300/80">{selectedSource.methodology}</p>
                      </div>
                      
                      <div>
                        <div className="text-gold-300 font-medium mb-1">Known Limitations</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedSource.limitations.map((limitation, index) => (
                            <li key={index} className="text-gold-300/80">{limitation}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedSource.url && (
                        <div>
                          <div className="text-gold-300 font-medium mb-1">Source URL</div>
                          <a 
                            href={selectedSource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gold-400 hover:underline"
                          >
                            {selectedSource.url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border border-gold-500/30 rounded-lg p-8 text-center">
                    <p className="text-gold-300/70">Select a data source to view details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-6">
            <Table>
              <TableCaption>Comprehensive data quality assessment for all sources</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Name</TableHead>
                  <TableHead>Quality Score</TableHead>
                  <TableHead>Completeness</TableHead>
                  <TableHead>Documentation</TableHead>
                  <TableHead>Transparency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.map(source => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium text-gold-300">{source.name}</TableCell>
                    <TableCell>{renderQualityScore(source.qualityScore)}</TableCell>
                    <TableCell>
                      <div className="w-full bg-midnight-800 rounded-full h-2">
                        <div 
                          className="bg-gold-500 h-2 rounded-full"
                          style={{ width: `${source.completeness}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1 text-gold-300/70">{source.completeness}%</div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-midnight-800 rounded-full h-2">
                        <div 
                          className="bg-gold-500 h-2 rounded-full"
                          style={{ width: `${source.documentation}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1 text-gold-300/70">{source.documentation}%</div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-midnight-800 rounded-full h-2">
                        <div 
                          className="bg-gold-500 h-2 rounded-full"
                          style={{ width: `${source.transparency}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1 text-gold-300/70">{source.transparency}%</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={source.qualityScore >= 75 ? "outline" : "destructive"} className="bg-midnight-800">
                        {source.qualityScore >= 90 ? 'Excellent' : 
                          source.qualityScore >= 80 ? 'Good' : 
                          source.qualityScore >= 70 ? 'Acceptable' : 
                          source.qualityScore >= 60 ? 'Limited' : 'Poor'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
              <h3 className="text-gold-400 mb-2 text-lg">Quality Assurance Process</h3>
              <p className="text-gold-300/80">
                All data sources undergo a rigorous quality assurance process before being integrated into the platform.
                This includes verification of methodologies, assessment of completeness, validation of data collection
                practices, and evaluation of documentation quality. Sources below a quality threshold of 60 are excluded
                from analysis features.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="policies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gold-500/30 rounded-lg p-4">
                <h3 className="text-gold-400 mb-2 text-lg">Data Privacy</h3>
                <ul className="space-y-2 text-gold-300/80">
                  <li>• All patient-level data is anonymized and aggregated</li>
                  <li>• No personally identifiable information (PII) is stored</li>
                  <li>• Geographic data is limited to county-level or higher</li>
                  <li>• Strict access controls for sensitive health information</li>
                  <li>• Regular privacy impact assessments conducted</li>
                </ul>
              </div>
              
              <div className="border border-gold-500/30 rounded-lg p-4">
                <h3 className="text-gold-400 mb-2 text-lg">Data Attribution</h3>
                <ul className="space-y-2 text-gold-300/80">
                  <li>• All data sources are properly cited and attributed</li>
                  <li>• Usage complies with original data source terms</li>
                  <li>• Derivative works clearly indicate source data</li>
                  <li>• Data lineage is tracked and documented</li>
                  <li>• Contributors are acknowledged where appropriate</li>
                </ul>
              </div>
              
              <div className="border border-gold-500/30 rounded-lg p-4">
                <h3 className="text-gold-400 mb-2 text-lg">Quality Standards</h3>
                <ul className="space-y-2 text-gold-300/80">
                  <li>• Minimum quality threshold for inclusion (60+ score)</li>
                  <li>• Regular data quality assessments</li>
                  <li>• Clearly documented limitations and caveats</li>
                  <li>• Validation against multiple sources when possible</li>
                  <li>• Periodic review of outdated information</li>
                </ul>
              </div>
              
              <div className="border border-gold-500/30 rounded-lg p-4">
                <h3 className="text-gold-400 mb-2 text-lg">Transparency</h3>
                <ul className="space-y-2 text-gold-300/80">
                  <li>• All methodologies are publicly documented</li>
                  <li>• Known limitations are explicitly stated</li>
                  <li>• Data processing steps are recorded</li>
                  <li>• Clear indication of statistical confidence</li>
                  <li>• Separation of factual data and interpretations</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
              <h3 className="text-gold-400 mb-2 text-lg">Governance Framework</h3>
              <p className="text-gold-300/80">
                The Vital Health Vision platform follows a comprehensive data governance framework
                designed to ensure data quality, privacy, and ethical use of health information.
                Our policies are reviewed quarterly and updated to reflect best practices in
                health data management and comply with relevant regulations including HIPAA and GDPR.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Mock data generator for demo purposes
export const generateDataSources = (): DataSource[] => {
  return [
    {
      id: 'cdc',
      name: 'Centers for Disease Control and Prevention',
      organization: 'CDC',
      description: 'Comprehensive public health data from the CDC, including BRFSS and NHANES surveys covering a wide range of health indicators across the United States.',
      lastUpdated: '2025-03-15',
      qualityScore: 95,
      completeness: 92,
      documentation: 95,
      transparency: 90,
      methodology: 'Multiple nationwide surveys using standardized methodologies, including both self-reported and clinically measured data points. Rigorous statistical analysis with demographic weighting.',
      limitations: [
        'Some demographic groups may be underrepresented',
        'Self-reported data subject to recall bias',
        'Limited granularity below county level'
      ],
      url: 'https://data.cdc.gov/'
    },
    {
      id: 'who',
      name: 'World Health Organization Global Health Observatory',
      organization: 'WHO',
      description: 'Global health data covering 194 member states with standardized health indicators and metrics for international comparison.',
      lastUpdated: '2024-12-10',
      qualityScore: 91,
      completeness: 86,
      documentation: 94,
      transparency: 88,
      methodology: 'Aggregation of national health statistics, supplemented with WHO surveys and modeling for countries with incomplete data. Standardized definitions across countries.',
      limitations: [
        'Data quality varies by country and region',
        'Some metrics rely on country self-reporting',
        'Delays in data collection and reporting in some regions'
      ],
      url: 'https://www.who.int/data/gho'
    },
    {
      id: 'hhs',
      name: 'US Department of Health & Human Services',
      organization: 'HHS',
      description: 'Comprehensive health data from various US federal agencies including CMS, FDA, NIH, and HRSA.',
      lastUpdated: '2025-02-28',
      qualityScore: 88,
      completeness: 90,
      documentation: 85,
      transparency: 82,
      methodology: 'Combined administrative data, claims data, and surveys across multiple federal programs. Healthcare utilization and cost data from Medicare and Medicaid claims processing.',
      limitations: [
        'Some datasets have restrictive access requirements',
        'Administrative data may lack clinical detail',
        'Complex data structures require significant processing'
      ],
      url: 'https://www.healthdata.gov/'
    },
    {
      id: 'ihme',
      name: 'Institute for Health Metrics and Evaluation',
      organization: 'University of Washington',
      description: 'Independent research organization providing global health metrics and analysis with sophisticated modeling capabilities.',
      lastUpdated: '2025-01-25',
      qualityScore: 89,
      completeness: 84,
      documentation: 93,
      transparency: 91,
      methodology: 'Bayesian statistical modeling and meta-regression to synthesize data from multiple sources. Advanced techniques for handling missing data and uncertainty quantification.',
      limitations: [
        'Complex modeling assumptions may impact results',
        'Some metrics rely on derived estimates rather than direct measurement',
        'Models update with new data which can change historical estimates'
      ],
      url: 'http://www.healthdata.org/'
    },
    {
      id: 'fenway',
      name: 'Fenway Institute LGBTQ+ Health Data',
      organization: 'Fenway Health',
      description: 'Specialized health data focused on LGBTQ+ populations, health disparities, and targeted health interventions.',
      lastUpdated: '2025-01-10',
      qualityScore: 82,
      completeness: 75,
      documentation: 88,
      transparency: 90,
      methodology: 'Targeted sampling and community-based participatory research with LGBTQ+ communities. Uses both quantitative and qualitative methods for comprehensive understanding.',
      limitations: [
        'Sample sizes smaller than general population surveys',
        'May not represent all geographic regions equally',
        'Limited longitudinal data available'
      ],
      url: 'https://fenwayhealth.org/the-fenway-institute/'
    }
  ];
};
