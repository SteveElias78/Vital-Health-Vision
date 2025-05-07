
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      // Redirect would go here in a real app
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-gold-400">
            <span className="font-medium">Vital</span>Health<span className="font-medium">Vision</span>
          </h1>
          <p className="text-gold-300 mt-2">Sign in to your account</p>
        </div>
        
        <div className="art-deco-card p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-gold-300 mb-1">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="art-deco-input w-full"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="password" className="block text-gold-300 mb-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="art-deco-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked === true)} 
                />
                <Label htmlFor="rememberMe" className="text-sm text-gold-300">
                  Remember me
                </Label>
              </div>
              
              <Link to="/forgot-password" className="text-sm text-gold-400 hover:text-gold-300">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="art-deco-button w-full mb-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center text-gold-300">
              <p>Don't have an account? <Link to="/register" className="text-gold-400 hover:underline">Register</Link></p>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="art-deco-divider w-32 mx-auto"></div>
        <Link to="/" className="text-gold-400 hover:underline mt-4 block text-center">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default Login;
