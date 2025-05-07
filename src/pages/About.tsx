import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileChartLine, Database, Filter } from "lucide-react";
const About = () => {
  return <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-health-purple to-health-teal py-12 text-white">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-yellow-500">About Vital Health Vision</h1>
              <p className="mt-6 text-lg leading-8 text-yellow-500">
                A comprehensive public health data analysis platform for evidence-based decision making
              </p>
            </div>
          </div>
        </section>
        
        {/* About the Project */}
        <section className="py-12 bg-black">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="mb-4">
                HealthTrendLens is a Public Health Data Analysis Platform designed to leverage CDC and 
                other publicly available health datasets to identify patterns in health outcomes, 
                visualize demographic trends, and predict future health scenarios.
              </p>
              <p className="mb-4">
                The platform features interactive dashboards, data exploration tools, and machine 
                learning models to support evidence-based public health decision-making.
              </p>
              <p>
                Developed as a capstone project by Steve Elias (Student #001288965), this platform demonstrates 
                both descriptive and predictive analytical methods applied to public health data.
              </p>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-12 bg-black">
          <div className="container px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 rounded-lg bg-midnight-600">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-health-purple/10">
                    <FileChartLine className="h-6 w-6 text-health-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Data Visualization</h3>
                  <p className="text-yellow-500">
                    Interactive charts, maps, and dashboards for exploring health data across 
                    demographics, time periods, and geographic regions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 bg-midnight-600 rounded-lg">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-health-teal/10">
                    <Database className="h-6 w-6 text-health-teal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Statistical Analysis</h3>
                  <p className="text-yellow-500">
                    Comprehensive statistical tools for correlation analysis, trend identification, 
                    and pattern recognition in health datasets.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 rounded-lg bg-midnight-600">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-health-orange/10">
                    <Filter className="h-6 w-6 text-health-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Predictive Models</h3>
                  <p className="text-yellow-500">
                    Machine learning models that forecast health outcomes based on historical 
                    trends and demographic factors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Technical Details */}
        <section className="py-12 bg-black">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Technologies Used</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Frontend: React, TypeScript, and Tailwind CSS for a responsive UI</li>
                  <li>Data Visualization: Recharts library for interactive data visualizations</li>
                  <li>Analytics: Integrated statistical analysis and machine learning models</li>
                  <li>Data Sources: Public health datasets from CDC, WHO, and other sources</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Analytical Methods</h3>
                <p className="mb-2">Descriptive Methods:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Correlation analysis between health factors and outcomes</li>
                  <li>Demographic breakdowns of health conditions</li>
                  <li>Geographic distribution visualization of health metrics</li>
                  <li>Time-series analysis of health trends and seasonal patterns</li>
                </ul>
                
                <p className="mb-2">Predictive Methods:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Machine learning models to predict disease prevalence</li>
                  <li>Regression analysis to forecast health outcome trends</li>
                  <li>Classification algorithms to identify high-risk population segments</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 bg-black">
          <div className="container px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Explore Health Data?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Start analyzing public health trends and gain valuable insights using our interactive tools.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="">
                Explore Dashboard
              </Button>
              <Button variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-gray-300 bg-black">
        <div className="container px-4 text-center">
          <p>© 2025 HealthTrendLens. Developed for educational purposes.</p>
          <p className="text-sm mt-2">Student Project for Computer Science Capstone (C964)</p>
        </div>
      </footer>
    </div>;
};
export default About;