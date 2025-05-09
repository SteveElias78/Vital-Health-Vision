import "@testing-library/jest-dom";
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import { ArtDecoThemeProvider } from './components/theme'
import './index.css'

const root = createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <ArtDecoThemeProvider>
      <App />
    </ArtDecoThemeProvider>
  </React.StrictMode>
);
