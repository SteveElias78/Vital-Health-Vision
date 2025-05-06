
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
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
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gold-300 mb-1">Email</label>
              <Input
                id="email"
                type="email"
                className="art-deco-input w-full"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gold-300 mb-1">Password</label>
              <Input
                id="password"
                type="password"
                className="art-deco-input w-full"
                placeholder="Enter your password"
              />
            </div>
            
            <Button className="art-deco-button w-full mb-4">
              Sign In
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
