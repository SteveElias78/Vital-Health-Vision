
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return <section className="w-full">
      <div className="relative w-full bg-health-dark" style={{
      paddingTop: "50.0000%"
    }}>
        {/* Video element with autoplay, muted, loop attributes */}
        <video src="/RED WAVE.mp4" autoPlay muted loop playsInline className="absolute w-full h-full top-0 left-0 object-cover" style={{
        border: "none",
        padding: "0",
        margin: "0"
      }} />
      </div>
      <div className="container mx-auto -mt-20 flex items-center justify-center gap-x-12 relative z-10 animate-fade-in bg-transparent">
        <Button className="hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 px-8 py-6 mx-[100px] my-[10px] rounded-lg bg-transparent text-lg text-pink-600 font-normal border-pink-600 border border-opacity-40 animate-pulse">
          Explore Data
        </Button>
        <Button className="hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 px-8 py-6 mx-[100px] my-[10px] rounded-lg bg-transparent text-lg text-pink-600 text-left font-normal border-pink-600 border border-opacity-40 animate-pulse">
          Learn more
        </Button>
      </div>
    </section>;
}
