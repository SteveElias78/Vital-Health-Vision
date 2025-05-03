
import { DashboardCard } from "@/components/DashboardCard";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";

export function KeyMetricsSection() {
  return (
    <section className="w-full mt-12">
      <div className="w-full">
        <DashboardCard title="KEY METRICS" className="bg-transparent shadow-lg border-0">
          <div className="relative w-full overflow-hidden" style={{ 
            backgroundImage: "url('/lovable-uploads/b1936081-317f-417a-bfba-2085deed7cfe.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "0.5rem",
            minHeight: "220px"
          }}>
            <div className="absolute inset-0 bg-gradient-to-r from-health-dark/80 via-health-dark/60 to-transparent"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 relative z-10">
              <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                <AnalyticsSummary
                  title="Neural Networks"
                  value="24"
                  change={{ value: "ACTIVE", trend: "up" }}
                />
              </div>
              <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                <AnalyticsSummary
                  title="Quantum Analysis"
                  value="99.8%"
                  change={{ value: "OPTIMAL", trend: "up" }}
                />
              </div>
              <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                <AnalyticsSummary
                  title="Predictive Score"
                  value="A+"
                  change={{ value: "+2.4%", trend: "up" }}
                />
              </div>
              <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                <AnalyticsSummary
                  title="Global Reach"
                  value="192"
                  change={{ value: "NATIONS", trend: "neutral" }}
                />
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}
