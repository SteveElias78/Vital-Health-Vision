
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppRoutes } from "./routes";
import ArtDecoThemeProvider from "./components/theme/ArtDecoThemeProvider";
import { AppLayoutWrapper } from "./components/layout/AppLayoutWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ArtDecoThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="art-deco-bg">
              <Routes>
                {AppRoutes.map((route, index) => {
                  // Determine if this route should use the layout
                  const skipLayout = route.path === "/login" || 
                                    route.path === "/register" || 
                                    route.path === "/forgot-password";
                  
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <AppLayoutWrapper skipLayout={skipLayout}>
                          {route.element}
                        </AppLayoutWrapper>
                      }
                    />
                  );
                })}
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ArtDecoThemeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
