
export const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-3 px-6 border-t border-gray-700 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
        <div>
          © 2025 Vital Health Vision • Demo Platform
        </div>
        <div className="mt-2 sm:mt-0">
          Data sources: CDC, WHO, NHANES, BRFSS
        </div>
      </div>
    </footer>
  );
};
