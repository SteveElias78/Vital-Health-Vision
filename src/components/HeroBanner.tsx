
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroBanner() {
  return (
    <section className="w-full">
      <div className="relative w-full bg-health-dark" style={{
        paddingTop: "50.0000%",
      }}>
        {/* Use the uploaded image as background */}
        <div
          className="absolute w-full h-full top-0 left-0 flex items-center justify-center"
          style={{
            backgroundImage: "url('/lovable-uploads/9d623e22-3d8d-4022-ac4c-b23b9d313568.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="text-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-50 mb-4">
              Vital Health Vision
            </h1>
            <p className="text-xl md:text-2xl text-indigo-50 mb-8 max-w-2xl mx-auto">
              Visualize health data insights to transform healthcare decisions
            </p>
          </div>
          {/* Add a subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>
      <div className="container mx-auto -mt-20 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-x-12 relative z-10 animate-fade-in bg-transparent">
        <Link to="/explore">
          <Button className="hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 px-8 py-6 rounded-lg bg-transparent text-lg text-pink-600 font-normal border-pink-600 border border-opacity-40 w-full md:w-auto">
            Explore Data
          </Button>
        </Link>
        <Link to="/about">
          <Button className="hover:shadow-[0_0_15px_rgba(219,39,119,0.7)] transition-all duration-300 px-8 py-6 rounded-lg bg-transparent text-lg text-pink-600 font-normal border-pink-600 border border-opacity-40 w-full md:w-auto">
            Learn more
          </Button>
        </Link>
      </div>
    </section>
  );
}
