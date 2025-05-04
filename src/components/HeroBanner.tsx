
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="w-full">
      <div 
        className="relative w-full bg-health-dark" 
        style={{
          paddingTop: "50.0000%",
        }}
      >
        {/* Replace the GIF with the video element */}
        <video 
          src="/RED WAVE.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full top-0 left-0 object-cover"
          style={{
            border: "none",
            padding: "0",
            margin: "0"
          }}
        />
      </div>
      <div className="container mx-auto -mt-20 flex items-center justify-center gap-x-12 relative z-10 animate-fade-in">
        <Button className="hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300 px-8 py-6 mx-[100px] my-[10px] rounded-lg bg-transparent font-medium text-lg text-amber-400">
          Explore Data
        </Button>
        <Button variant="outline" className="border-black text-amber-400 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300 px-8 py-6 text-lg font-medium mx-[100px] my-[10px] bg-transparent rounded-lg">
          Learn more
        </Button>
      </div>
    </section>
  );
}
