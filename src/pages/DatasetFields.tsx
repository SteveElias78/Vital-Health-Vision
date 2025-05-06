
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { DatasetFieldsList } from "@/components/datasets/DatasetFieldsList";

const DatasetFields = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dataset Fields</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage the structure of your dataset</p>
          </div>
          
          <DatasetFieldsList />
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t dark:bg-gray-900 dark:border-gray-800">
        <div className="container px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 Vital Health Vision. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DatasetFields;
