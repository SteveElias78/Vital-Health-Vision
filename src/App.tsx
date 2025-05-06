
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
