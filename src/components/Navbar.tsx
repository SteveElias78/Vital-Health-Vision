import React from 'react';

// This component is no longer used as we've consolidated navigation to the sidebar only
// Keeping this file as a stub in case we need to revert changes or for reference
export const Navbar = () => {
  return (
    <nav className="bg-gradient-to-br from-midnight-900 to-midnight-950 border-b border-gold-500/30 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-2xl font-light text-gold-400 tracking-wider">
            Vital<span className="font-medium">Health</span>Vision
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gold-300 hover:text-gold-400 transition-colors">Home</a>
            <a href="/dashboard" className="text-gold-300 hover:text-gold-400 transition-colors">Dashboard</a>
            <a href="/datasets" className="text-gold-300 hover:text-gold-400 transition-colors">Datasets</a>
            <a href="/dataset-explorer" className="text-gold-300 hover:text-gold-400 transition-colors">Explorer</a>
            <a href="/explore" className="text-gold-300 hover:text-gold-400 transition-colors">Explore</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-midnight-800 text-gold-300 px-4 py-2 rounded-md border border-gold-500/30 hover:bg-midnight-700 transition-colors">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
