
import React, { useState, useEffect } from 'react';
import { ApiKeyManager, ApiKeyUtils } from '../utils/ApiKeyManager';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Check, Key, AlertTriangle, Info } from 'lucide-react';
import { useToast } from './ui/use-toast';

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
    
    Object.keys(sourceStatus).forEach(source => {
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
  
  const getSourceLabel = (source: string): string => {
    switch (source) {
      case 'CDC_DATA_GOV':
        return 'CDC Data Portal';
      case 'WHO_GHO':
        return 'WHO Global Health Observatory';
      case 'FENWAY_INSTITUTE':
        return 'Fenway Institute Health Research';
      case 'THE_19TH_ARCHIVE':
        return 'The 19th Health Archive';
      default:
        return source;
    }
  };
  
  const getSourceInstructions = (source: string): JSX.Element => {
    switch (source) {
      case 'CDC_DATA_GOV':
        return (
          <Alert className="my-4">
            <Info className="h-4 w-4" />
            <AlertTitle>How to obtain a CDC Data API key</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-4 mt-2">
                <li>Visit <a href="https://data.cdc.gov/profile/edit/developer_settings" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CDC Data Portal Developer Settings</a></li>
                <li>Create an account or sign in</li>
                <li>Under "App Tokens", create a new application</li>
                <li>Copy your App Token (API key)</li>
                <li>Paste it in the field below</li>
              </ol>
            </AlertDescription>
          </Alert>
        );
      case 'WHO_GHO':
        return (
          <Alert className="my-4">
            <Info className="h-4 w-4" />
            <AlertTitle>How to obtain a WHO GHO API key</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-4 mt-2">
                <li>Visit <a href="https://www.who.int/data/gho/info/gho-odata-api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WHO GHO API Documentation</a></li>
                <li>Register for an API key through their developer portal</li>
                <li>Copy your API key</li>
                <li>Paste it in the field below</li>
              </ol>
            </AlertDescription>
          </Alert>
        );
      case 'FENWAY_INSTITUTE':
        return (
          <Alert className="my-4">
            <Info className="h-4 w-4" />
            <AlertTitle>How to obtain a Fenway Institute API key</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-4 mt-2">
                <li>Contact the Fenway Institute at research@fenwayhealth.org</li>
                <li>Request research API access for health data analysis</li>
                <li>Complete their data use agreement</li>
                <li>Once approved, you'll receive an API key</li>
                <li>Paste it in the field below</li>
              </ol>
            </AlertDescription>
          </Alert>
        );
      case 'THE_19TH_ARCHIVE':
        return (
          <Alert className="my-4">
            <Info className="h-4 w-4" />
            <AlertTitle>How to obtain The 19th Archive credentials</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-4 mt-2">
                <li>Visit <a href="https://19tharchive.org/research/access" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">The 19th Archive Research Access</a></li>
                <li>Apply for research access credentials</li>
                <li>You'll receive both a client ID and client secret</li>
                <li>Note: For The 19th Archive you'll need to configure both client ID and secret in your environment</li>
              </ol>
            </AlertDescription>
          </Alert>
        );
      default:
        return <div>No specific instructions available for this source.</div>;
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
          {Object.keys(sourceStatus).map(source => (
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
        
        {Object.keys(sourceStatus).map(source => (
          <TabsContent key={source} value={source} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{getSourceLabel(source)}</h3>
              
              {sourceStatus[source].hasKey ? (
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle>API Key Configured</AlertTitle>
                  <AlertDescription>
                    This data source is configured and ready to use.
                  </AlertDescription>
                </Alert>
              ) : sourceStatus[source].isValid === false ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Invalid API Key</AlertTitle>
                  <AlertDescription>
                    The provided API key could not be validated. Please check and try again.
                  </AlertDescription>
                </Alert>
              ) : (
                getSourceInstructions(source)
              )}
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor={`api-key-${source}`}>API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id={`api-key-${source}`}
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={validateAndSaveKey} 
                    disabled={validating}
                  >
                    {validating ? "Validating..." : "Validate & Save"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
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
