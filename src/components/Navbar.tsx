
import React from 'react';
import { ModeToggle } from './ModeToggle';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Vital Health Vision</span>
            </a>
            <nav className="ml-10 hidden space-x-8 md:flex">
              <a href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Home</a>
              <a href="/home" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Dashboard</a>
              <a href="/datasets" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Datasets</a>
              <a href="/explore" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Explore</a>
              <a href="/predict" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Predict</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">About</a>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
              Sign In
            </button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
