
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';

interface SourceInstructionsProps {
  source: string;
}

const SourceInstructions: React.FC<SourceInstructionsProps> = ({ source }) => {
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

export default SourceInstructions;
