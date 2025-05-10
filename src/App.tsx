
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Loader } from "lucide-react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vitalhealth-theme">
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Loader className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
