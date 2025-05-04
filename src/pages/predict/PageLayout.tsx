
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-gray-500">{description}</p>
          </div>
          
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container px-4 text-center text-sm text-gray-500">
          © 2025 HealthTrendLens. All data provided for educational purposes only.
        </div>
      </footer>
    </div>
  );
};
