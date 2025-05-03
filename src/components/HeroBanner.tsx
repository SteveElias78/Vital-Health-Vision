
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="w-full">
      <div className="relative w-full" style={{ 
        paddingTop: "50.0000%",
        backgroundColor: "#1A1F2C"
      }}>
        <iframe 
          loading="lazy" 
          style={{ 
            position: "absolute", 
            width: "100%", 
            height: "100%", 
            top: "0", 
            left: "0", 
            border: "none", 
            padding: "0",
            margin: "0" 
          }}
          src="https://www.canva.com/design/DAGmWnfOB8M/XxVkdBWOj1VwBz2W6L4ZvA/view?embed&autoplay=1&loop=1" 
          allowFullScreen
          title="Vital Health Vision Banner"
          allow="autoplay; loop"
        />
      </div>
      <div className="container mx-auto -mt-20 flex items-center justify-center gap-x-12 relative z-10 animate-fade-in">
        <Button 
          className="bg-black text-amber-400 hover:bg-black/90 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300 px-8 py-6 text-lg font-medium"
        >
          Explore Data
        </Button>
        <Button 
          variant="outline" 
          className="border-black bg-black text-amber-400 hover:bg-black/90 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300 px-8 py-6 text-lg font-medium"
        >
          Learn more
        </Button>
      </div>
    </section>
  );
}
