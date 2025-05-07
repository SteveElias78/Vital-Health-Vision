
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { DatasetsList } from "@/components/datasets/DatasetsList";

const Datasets = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-midnight-900 to-midnight-950">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-light tracking-wider text-gold-400">Health Datasets</h1>
            <p className="text-gold-300/80">Discover, analyze, and manage your public health datasets</p>
          </div>
          
          <DatasetsList />
        </div>
      </main>
      
      <footer className="py-6 border-t border-gold-500/20">
        <div className="container px-4 text-center text-sm text-gold-300/70">
          © 2025 Vital Health Vision. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Datasets;
