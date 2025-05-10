
import { useAuth } from "@/hooks/useAuth";
import { DemoModeIndicator } from "@/components/demo/DemoModeIndicator";

export const DashboardHeader: React.FC = () => {
  const { isDemo } = useAuth();
  
  return (
    <header className="bg-gray-900 py-4 px-6 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-light">
            <span className="font-medium text-blue-300">Vital</span>
            Health
            <span className="font-medium text-blue-300">Vision</span>
          </h1>
          <p className="text-sm text-gray-400">Public Health Analytics Platform</p>
        </div>
        
        {isDemo && <DemoModeIndicator />}
      </div>
    </header>
  );
};
