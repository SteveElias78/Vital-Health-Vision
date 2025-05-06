
import React, { useState, useEffect } from 'react';
import { ApiKeyManager, ApiKeyUtils } from '../../utils/ApiKeyManager';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Key, Check } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import SourceTab from './SourceTab';
import { dataSources, getSourceLabel } from './sourcesConfig';

const ApiKeyManagement: React.FC = () => {
  const [activeSource, setActiveSource] = useState('CDC_DATA_GOV');
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [sourceStatus, setSourceStatus] = useState<Record<string, { hasKey: boolean; isValid?: boolean }>>({
    CDC_DATA_GOV: { hasKey: false },
    WHO_GHO: { hasKey: false },
    FENWAY_INSTITUTE: { hasKey: false },
    THE_19TH_ARCHIVE: { hasKey: false }
  });
  
  const { toast } = useToast();
  
  // Initialize source status
  useEffect(() => {
    const statuses: Record<string, { hasKey: boolean; isValid?: boolean }> = {};
    
    dataSources.forEach(source => {
      statuses[source] = { 
        hasKey: ApiKeyUtils.hasAccessToSource(source),
        isValid: undefined
      };
    });
    
    setSourceStatus(statuses);
  }, []);
  
  const handleSourceChange = (source: string) => {
    setActiveSource(source);
    setApiKey('');
  };
  
  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to validate",
        variant: "destructive"
      });
      return;
    }
    
    setValidating(true);
    
    try {
      const isValid = await ApiKeyUtils.validateApiKey(activeSource, apiKey);
      
      if (isValid) {
        // Save the validated key
        ApiKeyManager.getInstance().setKey(activeSource, apiKey);
        
        // Update status
        setSourceStatus(prev => ({
          ...prev,
          [activeSource]: { hasKey: true, isValid: true }
        }));
        
        toast({
          title: "API Key Validated",
          description: `Your API key for ${activeSource} has been validated and saved.`,
          variant: "default"
        });
        
        // Clear input
        setApiKey('');
      } else {
        // Update status
        setSourceStatus(prev => ({
          ...prev,
          [activeSource]: { ...prev[activeSource], isValid: false }
        }));
        
        toast({
          title: "Invalid API Key",
          description: `The API key for ${activeSource} could not be validated.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: `An error occurred during validation: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setValidating(false);
    }
  };
  
  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Key className="mr-2" />
        API Key Management
      </h2>
      
      <p className="text-gray-600 mb-6">
        To access certain health data sources, you need to provide API keys. 
        Keys are stored securely in your browser's local storage and never sent to our servers.
      </p>
      
      <Tabs defaultValue="CDC_DATA_GOV" value={activeSource} onValueChange={handleSourceChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          {dataSources.map(source => (
            <TabsTrigger key={source} value={source} className="relative">
              {getSourceLabel(source)}
              {sourceStatus[source].hasKey && (
                <span className="absolute -top-1 -right-1">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {dataSources.map(source => (
          <SourceTab
            key={source}
            source={source}
            label={getSourceLabel(source)}
            hasKey={sourceStatus[source].hasKey}
            isValid={sourceStatus[source].isValid}
            apiKey={activeSource === source ? apiKey : ''}
            validating={validating && activeSource === source}
            onApiKeyChange={setApiKey}
            onValidate={validateAndSaveKey}
          />
        ))}
      </Tabs>
      
      <div className="mt-8 pt-4 border-t">
        <h3 className="text-lg font-semibold mb-2">About Data Source Access</h3>
        <p className="text-sm text-gray-600">
          Vital Health Vision uses a hybrid data source approach. When official data sources are 
          unavailable or require authentication, the system will automatically fall back to 
          archived datasets. For the best experience with real-time data, please configure 
          API keys for the sources you wish to access.
        </p>
      </div>
    </Card>
  );
};

export default ApiKeyManagement;
