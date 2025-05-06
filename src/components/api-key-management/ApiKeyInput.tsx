
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ApiKeyInputProps {
  source: string;
  apiKey: string;
  validating: boolean;
  onChange: (value: string) => void;
  onValidate: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  source, 
  apiKey, 
  validating, 
  onChange, 
  onValidate 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={`api-key-${source}`}>API Key</Label>
      <div className="flex space-x-2">
        <Input
          id={`api-key-${source}`}
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={onValidate} 
          disabled={validating}
        >
          {validating ? "Validating..." : "Validate & Save"}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
