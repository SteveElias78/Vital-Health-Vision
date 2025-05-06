
import React from 'react';
import { TabsContent } from '../ui/tabs';
import SourceInstructions from './SourceInstructions';
import SourceStatusAlert from './SourceStatusAlert';
import ApiKeyInput from './ApiKeyInput';

interface SourceTabProps {
  source: string;
  label: string;
  hasKey: boolean;
  isValid?: boolean;
  apiKey: string;
  validating: boolean;
  onApiKeyChange: (value: string) => void;
  onValidate: () => void;
}

const SourceTab: React.FC<SourceTabProps> = ({
  source,
  label,
  hasKey,
  isValid,
  apiKey,
  validating,
  onApiKeyChange,
  onValidate
}) => {
  return (
    <TabsContent value={source} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{label}</h3>
        
        {/* Show status or instructions based on current state */}
        {(hasKey || isValid === false) ? (
          <SourceStatusAlert hasKey={hasKey} isValid={isValid} />
        ) : (
          <SourceInstructions source={source} />
        )}
        
        {/* API Key input */}
        <ApiKeyInput 
          source={source}
          apiKey={apiKey}
          validating={validating}
          onChange={onApiKeyChange}
          onValidate={onValidate}
        />
      </div>
    </TabsContent>
  );
};

export default SourceTab;
