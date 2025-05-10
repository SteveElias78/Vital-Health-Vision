
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ArtDecoThemeProvider from "./components/theme/ArtDecoThemeProvider";
import router from "./routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ArtDecoThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="art-deco-bg">
            <RouterProvider router={router} />
          </div>
        </TooltipProvider>
      </ArtDecoThemeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
