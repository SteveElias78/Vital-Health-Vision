
import { Database, FileChartLine, Filter } from "lucide-react";

export function DataSourcesSection() {
  return (
    <section className="bg-white py-12">
      <div className="container px-4">
        <h2 className="mb-8 text-2xl font-bold text-center">Data Sources & Analysis Methods</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-purple/10">
              <Database className="h-6 w-6 text-health-purple" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Public Health Datasets</h3>
            <p className="mt-2 text-gray-600">
              Leveraging CDC, WHO, and other public health data sources to provide comprehensive insights.
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
        </div>
      </div>
    </section>
  );
}
