
import { Database, FileChartLine, Filter, Shield } from "lucide-react";
import { GOVERNMENT_SOURCES, ALTERNATIVE_SOURCES } from "@/config/dataSourceConfig";

export function DataSourcesSection() {
  // Calculate the total number of data sources
  const totalSources = Object.keys(GOVERNMENT_SOURCES).length + Object.keys(ALTERNATIVE_SOURCES).length;
  
  return (
    <section className="bg-white py-12">
      <div className="container px-4">
        <h2 className="mb-8 text-2xl font-bold text-center">Data Sources & Analysis Methods</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-purple/10">
              <Database className="h-6 w-6 text-health-purple" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Public Health Datasets</h3>
            <p className="mt-2 text-gray-600">
              {totalSources} health data sources including CDC, WHO, and specialist health research institutes.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-teal/10">
              <FileChartLine className="h-6 w-6 text-health-teal" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Statistical Analysis</h3>
            <p className="mt-2 text-gray-600">
              Advanced statistical methods to identify patterns, correlations, and trends in health data.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-orange/10">
              <Filter className="h-6 w-6 text-health-orange" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Predictive Modeling</h3>
            <p className="mt-2 text-gray-600">
              Machine learning models to forecast health trends and identify at-risk populations.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-red/10">
              <Shield className="h-6 w-6 text-health-red" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Data Integrity</h3>
            <p className="mt-2 text-gray-600">
              Alternative data sources for potentially compromised categories to ensure research validity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
