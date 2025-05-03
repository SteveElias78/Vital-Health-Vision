
import { DataTrends } from "@/components/DataTrends";
import { DemographicsBreakdown } from "@/components/DemographicsBreakdown";
import { CorrelationMatrix } from "@/components/CorrelationMatrix";
import { HealthMap } from "@/components/HealthMap";
import { PredictionModel } from "@/components/PredictionModel";

export function DashboardFeaturesSection() {
  return (
    <section className="container px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold">Analysis Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <DataTrends />
        <DemographicsBreakdown />
        <CorrelationMatrix />
        <HealthMap />
        <PredictionModel />
      </div>
    </section>
  );
}
