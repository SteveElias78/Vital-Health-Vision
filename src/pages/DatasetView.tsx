
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { DatasetDetail } from "@/components/datasets/DatasetDetail";

const DatasetView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dataset Details</h1>
            <p className="text-gray-500">View detailed information about this health dataset</p>
          </div>
          
          <DatasetDetail />
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container px-4 text-center text-sm text-gray-500">
          © 2025 Vital Health Vision. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DatasetView;
