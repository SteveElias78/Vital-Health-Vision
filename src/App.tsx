
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Predict from "./pages/Predict";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Datasets from "./pages/Datasets";
import NewDataset from "./pages/NewDataset";
import EditDataset from "./pages/EditDataset";
import DatasetView from "./pages/DatasetView";
import DatasetFields from "./pages/DatasetFields";
import DatasetDataView from "./pages/DatasetDataView";
import Auth from "./pages/Auth";
import React from "react"; // Make sure React is imported

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/about" element={<About />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/datasets/new" element={<NewDataset />} />
              <Route path="/datasets/edit/:id" element={<EditDataset />} />
              <Route path="/datasets/:id" element={<DatasetView />} />
              <Route path="/datasets/:id/fields" element={<DatasetFields />} />
              <Route path="/datasets/:id/data" element={<DatasetDataView />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
