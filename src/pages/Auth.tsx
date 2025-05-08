
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/home');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/home');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: 'Check your email',
        description: 'We sent you a confirmation link to complete your sign up.',
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Navigation is handled by the auth state listener
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setDemoLoading(true);

    try {
      // Use predefined demo credentials
      const demoEmail = 'demo@vitalhealthvision.org';
      const demoPassword = 'demo123456';

      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) throw error;

      toast({
        title: 'Welcome to Vital Health Vision',
        description: 'You are logged in with demo access.',
      });
      
      // Navigation is handled by the auth state listener
    } catch (error: any) {
      setError('Demo login failed. Please try again later or contact support.');
      console.error('Error with demo login:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Vital Health Vision</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to save your dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Demo Login Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-center mb-4 text-muted-foreground">
                For demonstration purposes
              </div>
              <Button 
                variant="outline" 
                className="w-full border-2 border-amber-500/50 hover:bg-amber-500/10"
                onClick={handleDemoLogin}
                disabled={demoLoading}
              >
                {demoLoading ? <Spinner size="sm" className="mr-2" /> : null}
                Demo Login (For Graders)
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <a href="/">Return to Home</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
