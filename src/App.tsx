
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ArtDecoThemeProvider from "./components/theme/ArtDecoThemeProvider";
import AppLayoutWrapper from './components/layout/AppLayoutWrapper';
import { AppRoutes } from "./routes";
import DemoModeProvider from "./components/context/DemoModeProvider";
import DemoModeBanner from "./components/DemoModeBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ArtDecoThemeProvider>
        <DemoModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="art-deco-bg flex flex-col min-h-screen">
                <DemoModeBanner />
                <div className="flex-1">
                  <Routes>
                    {AppRoutes.map((route, index) => {
                      // Determine if this route should use the layout
                      const skipLayout = route.path === "/login" || 
                                      route.path === "/register" || 
                                      route.path === "/forgot-password" ||
                                      route.path === "/auth";
                      
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
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </DemoModeProvider>
      </ArtDecoThemeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
