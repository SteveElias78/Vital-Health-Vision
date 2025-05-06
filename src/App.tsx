
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayoutWrapper } from "@/components/layout";

// Import pages
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

// Create pages that will be needed based on the router
import Dashboard from "./pages/Dashboard";
import HealthMetrics from "./pages/HealthMetrics";
import Demographics from "./pages/Demographics";
import Geography from "./pages/Geography";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication pages - no layout */}
            <Route 
              path="/login" 
              element={
                <AppLayoutWrapper skipLayout>
                  <Login />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/register" 
              element={
                <AppLayoutWrapper skipLayout>
                  <Register />
                </AppLayoutWrapper>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            
            {/* Main application pages - with Art Deco layout */}
            <Route 
              path="/" 
              element={
                <AppLayoutWrapper>
                  <Index />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/home" 
              element={
                <AppLayoutWrapper>
                  <Home />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <AppLayoutWrapper>
                  <Dashboard />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/metrics" 
              element={
                <AppLayoutWrapper>
                  <HealthMetrics />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/demographics" 
              element={
                <AppLayoutWrapper>
                  <Demographics />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/geography" 
              element={
                <AppLayoutWrapper>
                  <Geography />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <AppLayoutWrapper>
                  <Reports />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/explore" 
              element={
                <AppLayoutWrapper>
                  <Explore />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/predict" 
              element={
                <AppLayoutWrapper>
                  <Predict />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AppLayoutWrapper>
                  <Settings />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/about" 
              element={
                <AppLayoutWrapper>
                  <About />
                </AppLayoutWrapper>
              } 
            />
            
            {/* Dataset routes */}
            <Route 
              path="/datasets" 
              element={
                <AppLayoutWrapper>
                  <Datasets />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/datasets/new" 
              element={
                <AppLayoutWrapper>
                  <NewDataset />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/datasets/edit/:id" 
              element={
                <AppLayoutWrapper>
                  <EditDataset />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/datasets/:id" 
              element={
                <AppLayoutWrapper>
                  <DatasetView />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/datasets/:id/fields" 
              element={
                <AppLayoutWrapper>
                  <DatasetFields />
                </AppLayoutWrapper>
              } 
            />
            <Route 
              path="/datasets/:id/data" 
              element={
                <AppLayoutWrapper>
                  <DatasetDataView />
                </AppLayoutWrapper>
              } 
            />
            
            {/* 404 page */}
            <Route 
              path="*" 
              element={
                <AppLayoutWrapper>
                  <NotFound />
                </AppLayoutWrapper>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
