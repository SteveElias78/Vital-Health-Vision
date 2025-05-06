
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { DatasetForm } from "@/components/datasets/DatasetForm";

const NewDataset = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Create New Dataset</h1>
            <p className="text-gray-500">Add a new health dataset to your collection</p>
          </div>
          
          <DatasetForm />
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

export default NewDataset;
