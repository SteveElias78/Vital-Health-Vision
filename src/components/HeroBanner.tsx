
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export function HeroBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video loads and plays correctly
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.playsInline = true;
      
      const playVideo = () => {
        videoElement.play().catch(error => {
          console.error("Video playback failed:", error);
        });
      };
      
      // Try to play when loaded
      if (videoElement.readyState >= 2) {
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo);
      }
      
      return () => {
        videoElement.removeEventListener('loadeddata', playVideo);
      };
    }
  }, []);

  return (
    <section className="w-full">
      <div className="relative w-full bg-health-dark" style={{
        paddingTop: "50.0000%"
      }}>
        {/* Video element with improved loading */}
        <video 
          ref={videoRef}
          src="/RED WAVE.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          className="absolute w-full h-full top-0 left-0 object-cover" 
          style={{
            border: "none",
            padding: "0",
            margin: "0"
          }} 
        />
      </div>
      <div className="container mx-auto -mt-20 flex items-center justify-center gap-x-12 relative z-10 animate-fade-in bg-transparent">
        <Button className="hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 px-8 py-6 mx-[100px] my-[10px] rounded-lg bg-transparent text-lg text-pink-600 font-normal border-pink-600 border border-opacity-40">
          Explore Data
        </Button>
        <Button className="hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 px-8 py-6 mx-[100px] my-[10px] rounded-lg bg-transparent text-lg text-pink-600 text-left font-normal border-pink-600 border border-opacity-40">
          Learn more
        </Button>
      </div>
    </section>
  );
}
