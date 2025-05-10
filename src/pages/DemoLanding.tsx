
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const DemoLanding: React.FC = () => {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();
  
  const handleSignIn = async (role: 'researcher' | 'administrator') => {
    try {
      await signInDemo(role);
      toast({
        title: `Signed in as ${role}`,
        description: `You now have access to the ${role} demo view`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication error',
        description: 'Could not sign you in. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-midnight-900 to-midnight-950 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-wider text-gold-400">
            <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
          </h1>
          <p className="text-gold-300 mt-2">
            Public Health Analytics & Visualization Platform
          </p>
        </div>
        
        <Card className="mb-6 bg-midnight-900/60 border-gold-500/30">
          <CardHeader className="border-b border-gold-500/20">
            <CardTitle className="text-gold-400">Welcome to the Vital Health Vision Demo</CardTitle>
            <CardDescription className="text-gold-300/80">
              This is a demonstration version of the Vital Health Vision platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-6">
              Vital Health Vision is a comprehensive health data analysis platform designed to visualize public health trends, 
              provide statistical analysis, and generate predictions using CDC and other public health datasets.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <CardTitle className="text-blue-300">Researcher Account</CardTitle>
                      <CardDescription className="text-blue-200/60">
                        Standard data access
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-200/80 text-sm">
                    <li>• Access to all health visualization tools</li>
                    <li>• Demographics and trend analysis</li>
                    <li>• AI-powered data insights</li>
                    <li>• Geographic health data visualization</li>
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-blue-500/20 pt-4">
                  <div className="text-xs text-blue-200/60">
                    <p>Email: researcher@demo.vhv</p>
                    <p>Password: Demo2025!</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-blue-400/30 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                    onClick={() => handleSignIn('researcher')}
                  >
                    Sign In as Researcher
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                      <Lock className="h-6 w-6 text-red-300" />
                    </div>
                    <div>
                      <CardTitle className="text-red-300">Administrator Account</CardTitle>
                      <CardDescription className="text-red-200/60">
                        Full platform access
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-red-200/80 text-sm">
                    <li>• All researcher features</li>
                    <li>• Administrative controls</li>
                    <li>• Advanced reporting tools</li>
                    <li>• Data management capabilities</li>
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-red-500/20 pt-4">
                  <div className="text-xs text-red-200/60">
                    <p>Email: admin@demo.vhv</p>
                    <p>Password: Admin2025!</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-red-400/30 text-red-300 hover:bg-red-900/30 hover:text-red-200"
                    onClick={() => handleSignIn('administrator')}
                  >
                    Sign In as Administrator
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gold-500/20 pt-4">
            <p className="text-xs text-gold-300/60 text-center w-full">
              This is a demonstration version with pre-filled data. No personal information is collected or stored.
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center">
          <Button variant="link" asChild className="text-gold-400 hover:text-gold-300">
            <Link to="/">Return to Homepage</Link>
          </Button>
          <p className="mt-6 text-sm text-gold-300/50">
            © 2025 Vital Health Vision • Demo Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoLanding;
