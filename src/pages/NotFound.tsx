
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 text-center px-4">
      <div className="w-24 h-24 rounded-full border border-gold-500/50 flex items-center justify-center mb-4 art-deco-pulse">
        <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center">
          <span className="text-3xl font-light text-gold-400">404</span>
        </div>
      </div>
      
      <h1 className="text-3xl font-light text-gold-400">
        Page <span className="font-medium">Not Found</span>
      </h1>
      
      <p className="text-gold-300/80 max-w-md">
        The page you are looking for does not exist or has been moved to a different location.
      </p>
      
      <div className="art-deco-divider w-40"></div>
      
      <Button className="art-deco-button" asChild>
        <Link to="/">
          Return to Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
