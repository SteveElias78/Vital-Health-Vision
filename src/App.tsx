
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppRoutes } from "./routes";
import ArtDecoThemeProvider from "./components/theme/ArtDecoThemeProvider";

const queryClient = new QueryClient();

// Create a Router component to use useRoutes hook
const Router = () => {
  return useRoutes(AppRoutes);
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ArtDecoThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="art-deco-bg">
              <Router />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ArtDecoThemeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
