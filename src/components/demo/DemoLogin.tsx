
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArtDecoCard } from '@/components/artdeco/ArtDecoCard';
import { ArtDecoGradientDivider } from '@/components/artdeco/ArtDecoGradientDivider';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, User } from 'lucide-react';

export const DemoLogin: React.FC = () => {
  const { signInDemo } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleDemoLogin = async (role: 'researcher' | 'administrator') => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signInDemo(role);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-midnight-900 to-midnight-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-gold-400">
            <span className="font-bold text-gold-300">Demo</span>{' '}
            <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
          </h1>
          <p className="text-gold-300/80 mt-2">
            Experience the platform with pre-configured demo accounts
          </p>
        </div>
        
        <ArtDecoCard className="p-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div 
              className="p-5 border border-gold-500/30 hover:border-gold-400/50 rounded-lg bg-midnight-900/50 cursor-pointer transition-all"
              onClick={() => handleDemoLogin('researcher')}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-800/30 border border-blue-500/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-300">Researcher</h3>
                  <p className="text-sm text-blue-300/70">
                    Access to health data analysis tools and visualizations
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-300/70 flex justify-between items-center">
                <span>researcher@demo.vhv</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-900/30 border-blue-500/50 text-blue-300 hover:bg-blue-800/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoLogin('researcher');
                  }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </div>
            </div>
            
            <ArtDecoGradientDivider text="OR" pattern="diamonds" />
            
            <div 
              className="p-5 border border-gold-500/30 hover:border-gold-400/50 rounded-lg bg-midnight-900/50 cursor-pointer transition-all"
              onClick={() => handleDemoLogin('administrator')}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-800/30 border border-red-500/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <LockKeyhole className="w-6 h-6 text-red-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-300">Administrator</h3>
                  <p className="text-sm text-red-300/70">
                    Full platform access including management features
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-red-300/70 flex justify-between items-center">
                <span>admin@demo.vhv</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-red-900/30 border-red-500/50 text-red-300 hover:bg-red-800/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDemoLogin('administrator');
                  }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gold-300/70">
              This is a demo version with pre-configured accounts.<br/>
              No personal information is stored.
            </p>
          </div>
        </ArtDecoCard>
        
        <div className="mt-6 text-center">
          <p className="text-gold-300/50 text-sm">
            © 2025 Vital Health Vision • Demo Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;
