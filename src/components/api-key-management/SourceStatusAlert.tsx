
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Check, AlertTriangle } from 'lucide-react';

interface SourceStatusAlertProps {
  hasKey: boolean;
  isValid?: boolean;
}

const SourceStatusAlert: React.FC<SourceStatusAlertProps> = ({ hasKey, isValid }) => {
  if (hasKey) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle>API Key Configured</AlertTitle>
        <AlertDescription>
          This data source is configured and ready to use.
        </AlertDescription>
      </Alert>
    );
  } else if (isValid === false) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Invalid API Key</AlertTitle>
        <AlertDescription>
          The provided API key could not be validated. Please check and try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default SourceStatusAlert;
