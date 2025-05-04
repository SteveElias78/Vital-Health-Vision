
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";

export function DashboardFeaturesSection() {
  return (
    <section className="container px-4 py-8 bg-transparent">
      <h2 className="mb-6 text-2xl font-bold">Analysis Dashboard</h2>
      <CustomizableDashboard />
    </section>
  );
}
