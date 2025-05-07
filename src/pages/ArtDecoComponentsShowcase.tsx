
import React from 'react';
import { AppLayoutWrapper } from '@/components/layout/AppLayoutWrapper';
import { 
  ArtDecoButton, 
  ArtDecoCard, 
  ArtDecoInput, 
  ArtDecoRadialChart,
  ArtDecoGradientDivider,
  ArtDecoNavItem,
  ArtDecoFooter
} from '@/components/artdeco';
import { GeometricDivider } from '@/components/decorative/GeometricDivider';
import { 
  Info, Settings, Download, ChevronRight, Search, 
  Heart, User, Mail, Home, Bell, BarChart3 
} from 'lucide-react';

export default function ArtDecoComponentsShowcase() {
  // Sample data for radial chart
  const chartData = [
    { id: 1, value: 35, label: "Diabetes" },
    { id: 2, value: 25, label: "Hypertension" },
    { id: 3, value: 20, label: "Obesity" },
    { id: 4, value: 15, label: "Heart Disease" },
    { id: 5, value: 5, label: "Other" }
  ];
  
  // Sample footer sections
  const footerSections = [
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api" },
        { label: "Health Data", href: "/data" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Data Usage", href: "/data-policy" }
      ]
    }
  ];

  return (
    <AppLayoutWrapper>
      <div className="container mx-auto px-4 py-8 space-y-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-wider text-gold-400 mb-2">
            Art Deco UI Components
          </h1>
          <p className="text-gold-300/80">
            A collection of custom Art Deco styled React components
          </p>
        </header>
        
        {/* Buttons Section */}
        <section>
          <ArtDecoGradientDivider text="Buttons" pattern="diamonds" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <ArtDecoCard title="Button Variants" padding="lg">
              <div className="flex flex-wrap gap-4">
                <ArtDecoButton variant="primary">Primary</ArtDecoButton>
                <ArtDecoButton variant="secondary">Secondary</ArtDecoButton>
                <ArtDecoButton variant="subtle">Subtle</ArtDecoButton>
                <ArtDecoButton variant="ghost">Ghost</ArtDecoButton>
                <ArtDecoButton variant="link">Link</ArtDecoButton>
                <ArtDecoButton variant="gradient">Gradient</ArtDecoButton>
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Button with Icons" padding="lg">
              <div className="flex flex-wrap gap-4">
                <ArtDecoButton variant="primary" leftIcon={<Info />}>With Icon</ArtDecoButton>
                <ArtDecoButton variant="secondary" rightIcon={<ChevronRight />}>Next Step</ArtDecoButton>
                <ArtDecoButton variant="subtle" leftIcon={<Download />}>Download</ArtDecoButton>
                <ArtDecoButton variant="gradient" leftIcon={<Settings />}>Settings</ArtDecoButton>
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Button Sizes" padding="lg">
              <div className="flex items-center gap-4">
                <ArtDecoButton size="sm">Small</ArtDecoButton>
                <ArtDecoButton size="default">Default</ArtDecoButton>
                <ArtDecoButton size="lg">Large</ArtDecoButton>
                <ArtDecoButton size="icon" variant="primary"><Heart /></ArtDecoButton>
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Button Decorations" padding="lg">
              <div className="flex flex-wrap gap-4">
                <ArtDecoButton corners="decorated">With Corners</ArtDecoButton>
                <ArtDecoButton animation="pulse" variant="secondary">Pulse Effect</ArtDecoButton>
                <ArtDecoButton animation="shimmer" variant="gradient">Shimmer Effect</ArtDecoButton>
              </div>
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Cards Section */}
        <section>
          <ArtDecoGradientDivider text="Cards" pattern="diamonds" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <ArtDecoCard 
              variant="default" 
              title="Default Card" 
              subtitle="With header and content"
              padding="md"
            >
              <p className="text-gold-300/80 mb-4">
                This is a standard Art Deco card with a header and content area.
                It uses the default styling.
              </p>
              <ArtDecoButton size="sm">Card Action</ArtDecoButton>
            </ArtDecoCard>
            
            <ArtDecoCard 
              variant="accent" 
              corners="decorated"
              title="Decorated Card" 
              subtitle="With corner decorations"
              padding="md"
            >
              <p className="text-gold-300/80">
                This card has decorative Art Deco corners and uses the accent variant
                for more prominent border styling.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard 
              variant="gradient" 
              animation="glow"
              title="Interactive Card" 
              subtitle="With hover animation"
              padding="md"
            >
              <p className="text-gold-300/80">
                This card has a subtle gradient background and glows on hover with
                a soft golden highlight animation.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard 
              variant="default"
              title="Card with Footer" 
              subtitle="And additional content area"
              padding="md"
              footer={
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs text-gold-300/60">Last updated: May 2025</span>
                  <ArtDecoButton variant="ghost" size="sm">Details</ArtDecoButton>
                </div>
              }
            >
              <p className="text-gold-300/80">
                This card features a footer area for additional information or
                actions, separated by a subtle border.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard 
              variant="minimal" 
              corners="large"
              title="Large Corners" 
              subtitle="Minimal styling variant"
              padding="md"
            >
              <p className="text-gold-300/80">
                A card with larger decorative corners and minimal styling
                for more subdued presentations.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard 
              variant="default"
              title="Header Extras" 
              headerExtra={<ArtDecoButton variant="subtle" size="sm">Edit</ArtDecoButton>}
              padding="md"
            >
              <p className="text-gold-300/80">
                This card shows a header with additional action element
                positioned on the right side.
              </p>
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Inputs Section */}
        <section>
          <ArtDecoGradientDivider text="Inputs" pattern="diamonds" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <ArtDecoCard title="Input Variants" padding="lg">
              <div className="space-y-4">
                <ArtDecoInput 
                  label="Default Input"
                  placeholder="Enter text..."
                  variant="default"
                />
                
                <ArtDecoInput 
                  label="Filled Input"
                  placeholder="Enter text..."
                  variant="filled"
                />
                
                <ArtDecoInput 
                  label="Minimal Input"
                  placeholder="Enter text..."
                  variant="minimal"
                />
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Input States" padding="lg">
              <div className="space-y-4">
                <ArtDecoInput 
                  label="With Helper Text"
                  placeholder="Enter your email"
                  helperText="We'll never share your email"
                />
                
                <ArtDecoInput 
                  label="Error State"
                  placeholder="Enter password"
                  type="password"
                  value="pass"
                  error="Password must be at least 8 characters"
                  variant="error"
                />
                
                <ArtDecoInput 
                  label="Success State"
                  placeholder="Enter username"
                  value="healthvision"
                  variant="success"
                  helperText="Username is available"
                />
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Input with Icons" padding="lg">
              <div className="space-y-4">
                <ArtDecoInput 
                  label="Left Icon"
                  placeholder="Search..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
                
                <ArtDecoInput 
                  label="Right Icon"
                  placeholder="Enter your name"
                  rightIcon={<User className="h-4 w-4" />}
                />
                
                <ArtDecoInput 
                  label="Both Icons"
                  placeholder="Enter your email"
                  leftIcon={<Mail className="h-4 w-4" />}
                  rightIcon={<Info className="h-4 w-4" />}
                />
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Input Decorations" padding="lg">
              <div className="space-y-4">
                <ArtDecoInput 
                  label="Animated Underline"
                  placeholder="Type here..."
                  decoration="animated"
                />
                
                <ArtDecoInput 
                  label="Underlined Style"
                  placeholder="Type here..."
                  decoration="underlined"
                />
              </div>
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Chart Section */}
        <section>
          <ArtDecoGradientDivider text="Radial Chart" pattern="diamonds" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <ArtDecoCard title="Basic Radial Chart" padding="lg" className="flex justify-center">
              <ArtDecoRadialChart 
                data={chartData}
                width={300}
                height={300}
              />
            </ArtDecoCard>
            
            <ArtDecoCard title="With Center Content" padding="lg" className="flex justify-center">
              <ArtDecoRadialChart 
                data={chartData}
                width={300}
                height={300}
                innerRadius={80}
                centerContent={
                  <div className="text-center">
                    <div className="text-gold-400 text-2xl font-light">100%</div>
                    <div className="text-gold-300/70 text-xs">Total Responses</div>
                  </div>
                }
              />
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Dividers Section */}
        <section>
          <ArtDecoGradientDivider text="Dividers" pattern="diamonds" />
          
          <div className="grid grid-cols-1 gap-8 mt-6">
            <ArtDecoCard title="Gradient Dividers" padding="lg">
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Simple Gradient</p>
                  <ArtDecoGradientDivider />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">With Text</p>
                  <ArtDecoGradientDivider text="Section Divider" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">With Diamonds</p>
                  <ArtDecoGradientDivider pattern="diamonds" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">With Zigzag</p>
                  <ArtDecoGradientDivider pattern="zigzag" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">With Dots</p>
                  <ArtDecoGradientDivider pattern="dots" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Combined</p>
                  <ArtDecoGradientDivider text="Art Deco Style" pattern="diamonds" />
                </div>
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Geometric Dividers" padding="lg">
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Diamonds</p>
                  <GeometricDivider pattern="diamonds" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Zigzag</p>
                  <GeometricDivider pattern="zigzag" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Dots</p>
                  <GeometricDivider pattern="dots" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Triangles</p>
                  <GeometricDivider pattern="triangles" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Squares</p>
                  <GeometricDivider pattern="squares" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Chevron</p>
                  <GeometricDivider pattern="chevron" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Small Size</p>
                  <GeometricDivider pattern="diamonds" size="sm" />
                </div>
                
                <div>
                  <p className="mb-2 text-sm text-gold-300/70">Large Size</p>
                  <GeometricDivider pattern="diamonds" size="lg" />
                </div>
              </div>
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Nav Items Section */}
        <section>
          <ArtDecoGradientDivider text="Navigation Items" pattern="diamonds" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <ArtDecoCard title="Navigation Variants" padding="lg">
              <div className="space-y-4 flex flex-col">
                <ArtDecoNavItem 
                  href="#"
                  icon={<Home className="w-4 h-4" />}
                  label="Default Navigation Item"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<Bell className="w-4 h-4" />}
                  label="Subtle Style"
                  variant="subtle"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Bordered Style"
                  variant="bordered"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<User className="w-4 h-4" />}
                  label="Underlined Style"
                  variant="underlined"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<Settings className="w-4 h-4" />}
                  label="Active State"
                  active={true}
                />
              </div>
            </ArtDecoCard>
            
            <ArtDecoCard title="Navigation Decorations" padding="lg">
              <div className="space-y-4 flex flex-col">
                <ArtDecoNavItem 
                  href="#"
                  icon={<Home className="w-4 h-4" />}
                  label="Diamond Indicator"
                  decoration="diamond"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<Bell className="w-4 h-4" />}
                  label="Corner Decoration"
                  decoration="corners"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Glow Effect"
                  decoration="glow"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<User className="w-4 h-4" />}
                  label="Small Size"
                  size="sm"
                />
                
                <ArtDecoNavItem 
                  href="#"
                  icon={<Settings className="w-4 h-4" />}
                  label="Large Size"
                  size="lg"
                />
              </div>
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Footer showcase */}
        <section>
          <ArtDecoGradientDivider text="Footer" pattern="diamonds" />
          
          <div className="mt-6">
            <ArtDecoCard title="Footer Component" padding="none">
              <ArtDecoFooter 
                brandName="Vital Health Vision"
                tagline="Advanced health metrics visualization platform"
                sections={footerSections}
                socialLinks={[
                  { icon: <Mail className="w-4 h-4" />, href: "#", label: "Email" },
                  { icon: <Bell className="w-4 h-4" />, href: "#", label: "Notifications" },
                  { icon: <User className="w-4 h-4" />, href: "#", label: "Profile" },
                ]}
              />
            </ArtDecoCard>
          </div>
        </section>
      </div>
      
      {/* Show the footer component outside the container */}
      <ArtDecoFooter 
        pattern="geometric"
        brandName="Vital Health Vision"
        tagline="Exploring public health trends with advanced data visualization"
        sections={footerSections}
        socialLinks={[
          { icon: <Mail className="w-4 h-4" />, href: "#", label: "Email" },
          { icon: <Bell className="w-4 h-4" />, href: "#", label: "Notifications" },
          { icon: <User className="w-4 h-4" />, href: "#", label: "Profile" },
        ]}
      />
    </AppLayoutWrapper>
  );
}
