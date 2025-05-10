import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArtDecoPageHeader, 
  ArtDecoCard, 
  ArtDecoButton,
  ArtDecoDivider
} from '@/components/artdeco';

export const DemoLogin: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = async (role: 'researcher' | 'administrator') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await demoLogin(role);
      
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-midnight-900 to-black">
      <ArtDecoCard className="w-full max-w-md px-8 py-10">
        <ArtDecoPageHeader
          title="Vital Health Vision"
          subtitle="Demo Access"
          className="text-center mb-8"
        />
        
        <div className="text-center mb-8 text-amber-100">
          <p>This is a demonstration version of the Vital Health Vision platform.</p>
          <p className="mt-2">Select a role to proceed:</p>
        </div>
        
        <ArtDecoDivider pattern="diamonds" className="mb-8" />
        
        <div className="space-y-6">
          <ArtDecoButton
            variant="primary"
            onClick={() => handleDemoLogin('researcher')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Login as Researcher'}
          </ArtDecoButton>
          
          <ArtDecoButton
            variant="secondary"
            onClick={() => handleDemoLogin('administrator')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Login as Administrator'}
          </ArtDecoButton>
        </div>
        
        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
        
        <div className="mt-8 text-sm text-center text-gray-400">
          <p>Demo Credentials:</p>
          <p>Researcher: researcher@demo.vhv / Demo2025!</p>
          <p>Administrator: admin@demo.vhv / Admin2025!</p>
        </div>
      </ArtDecoCard>
    </div>
  );
};

export default DemoLogin;
