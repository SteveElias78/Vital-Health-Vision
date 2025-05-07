
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArtDecoButton, 
  ArtDecoCard, 
  ArtDecoInput, 
  ArtDecoRadialChart,
  ArtDecoGradientDivider,
  ArtDecoNavItem,
  ArtDecoFooter
} from '@/components/artdeco';
import { ArtDecoStyles } from '@/components/theme/ArtDecoStyles';
import { Calendar, ChevronRight, Home, Mail, Search, Settings, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const ArtDecoComponentsShowcase: React.FC = () => {
  const [intensity, setIntensity] = useState<'subtle' | 'medium' | 'bold'>('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ArtDecoStyles intensity={intensity} animationsEnabled={animationsEnabled} />
        
        <div>
          <h1 className="text-3xl font-light text-gold-400 mb-2">Art Deco Components</h1>
          <p className="text-gold-300/70 mb-6">Showcase of custom Art Deco styled components for Vital Health Vision</p>
          
          <ArtDecoGradientDivider text="Theme Controls" pattern="diamonds" />
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="space-y-2">
              <p className="text-sm text-gold-300">Art Deco Intensity</p>
              <div className="flex gap-2">
                <Button 
                  variant={intensity === 'subtle' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setIntensity('subtle')}
                  className="text-xs"
                >
                  Subtle
                </Button>
                <Button 
                  variant={intensity === 'medium' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setIntensity('medium')}
                  className="text-xs"
                >
                  Medium
                </Button>
                <Button 
                  variant={intensity === 'bold' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setIntensity('bold')}
                  className="text-xs"
                >
                  Bold
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gold-300">Animations</p>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="animations" 
                  checked={animationsEnabled} 
                  onCheckedChange={(checked) => setAnimationsEnabled(checked as boolean)} 
                />
                <label 
                  htmlFor="animations" 
                  className="text-sm text-gold-300 cursor-pointer"
                >
                  Enable animations
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Buttons</h2>
          <ArtDecoGradientDivider />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Button Variants</CardTitle>
                <CardDescription>Main action buttons with different styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <ArtDecoButton>Default Button</ArtDecoButton>
                  <ArtDecoButton variant="secondary">Secondary</ArtDecoButton>
                  <ArtDecoButton variant="subtle">Subtle</ArtDecoButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ArtDecoButton variant="ghost">Ghost</ArtDecoButton>
                  <ArtDecoButton variant="link">Link Button</ArtDecoButton>
                  <ArtDecoButton variant="gradient">Gradient</ArtDecoButton>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Size Variations</CardTitle>
                <CardDescription>Different button sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center flex-wrap gap-2">
                  <ArtDecoButton size="sm">Small</ArtDecoButton>
                  <ArtDecoButton>Default</ArtDecoButton>
                  <ArtDecoButton size="lg">Large</ArtDecoButton>
                </div>
                
                <div className="flex items-center flex-wrap gap-2">
                  <ArtDecoButton size="icon" aria-label="Settings">
                    <Settings className="h-4 w-4" />
                  </ArtDecoButton>
                  <ArtDecoButton size="icon" variant="secondary" aria-label="User">
                    <User className="h-4 w-4" />
                  </ArtDecoButton>
                  <ArtDecoButton size="icon" variant="ghost" aria-label="Search">
                    <Search className="h-4 w-4" />
                  </ArtDecoButton>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Button with Decorations</CardTitle>
                <CardDescription>Buttons with decorative elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <ArtDecoButton corners="decorated">With Corners</ArtDecoButton>
                  <ArtDecoButton animation="pulse" variant="secondary">Pulse Effect</ArtDecoButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ArtDecoButton leftIcon={<Mail />}>With Icon</ArtDecoButton>
                  <ArtDecoButton rightIcon={<ChevronRight />} variant="secondary">Next</ArtDecoButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Cards</h2>
          <ArtDecoGradientDivider />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArtDecoCard
              title="Standard Card"
              subtitle="With header and footer"
              footer={<div className="flex justify-end">
                <ArtDecoButton size="sm">Action</ArtDecoButton>
              </div>}
            >
              <p className="text-sm">
                This is a standard Art Deco card with header, body content and footer.
                The styling is consistent with the Vital Health Vision design language.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard
              variant="accent"
              title="Accent Card"
              headerExtra={<Settings className="h-4 w-4 text-gold-400" />}
            >
              <p className="text-sm">
                This accent card variant has a stronger border and more prominent styling.
                It can be used to highlight important information.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard
              variant="minimal"
              corners="decorated"
              animation="glow"
            >
              <div className="p-4">
                <h3 className="font-light text-lg mb-2 text-gold-400">Minimal Style</h3>
                <p className="text-sm">
                  This is a minimal card without a header or footer, but with decorative corners
                  and a subtle glow effect on hover.
                </p>
              </div>
            </ArtDecoCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ArtDecoCard 
              variant="gradient"
              corners="large"
              padding="lg"
            >
              <h3 className="font-light text-xl mb-3 text-gold-400">Gradient Background</h3>
              <p className="text-sm">
                This card features a gradient background and large decorated corners.
                The padding is also larger to provide more space for content.
              </p>
            </ArtDecoCard>
            
            <ArtDecoCard padding="none">
              <img 
                src="https://images.unsplash.com/photo-1580982326217-c31bedba6fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80" 
                alt="Health Data Visualization" 
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-light text-lg mb-1 text-gold-400">Cards with Media</h3>
                <p className="text-sm">Cards can contain media like images or videos.</p>
              </div>
            </ArtDecoCard>
          </div>
        </section>
        
        {/* Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Form Inputs</h2>
          <ArtDecoGradientDivider />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Variants</CardTitle>
                <CardDescription>Different input styles and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ArtDecoInput 
                  label="Default Input"
                  placeholder="Enter text here"
                />
                
                <ArtDecoInput 
                  label="Filled Input"
                  placeholder="Enter text here"
                  variant="filled"
                />
                
                <ArtDecoInput 
                  label="Minimal Input"
                  placeholder="Enter text here"
                  variant="minimal"
                />
                
                <ArtDecoInput 
                  label="With Helper Text"
                  placeholder="Enter text here"
                  helperText="This is some helpful instruction"
                />
                
                <ArtDecoInput 
                  label="Error State"
                  placeholder="Enter text here"
                  variant="error"
                  error="This field is required"
                />
                
                <ArtDecoInput 
                  label="Success State"
                  placeholder="Enter text here"
                  variant="success"
                  helperText="Input is valid"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Input Decorations</CardTitle>
                <CardDescription>Inputs with icons and decorative elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ArtDecoInput 
                  label="With Left Icon"
                  placeholder="Search..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
                
                <ArtDecoInput 
                  label="With Right Icon"
                  placeholder="Enter your name"
                  rightIcon={<User className="h-4 w-4" />}
                />
                
                <ArtDecoInput 
                  label="Animated Underline"
                  placeholder="Type something"
                  decoration="animated"
                />
                
                <ArtDecoInput 
                  label="Underlined Style"
                  placeholder="Minimal underlined input"
                  decoration="underlined"
                />
                
                <ArtDecoInput 
                  label="Disabled Input"
                  placeholder="You cannot edit this"
                  disabled
                />
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Charts Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Data Visualizations</h2>
          <ArtDecoGradientDivider />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-light text-gold-400 mb-4">Radial Chart</h3>
              <ArtDecoRadialChart
                data={[
                  { name: "Cardiovascular", value: 35, color: "#FFC700" },
                  { name: "Respiratory", value: 25, color: "#FFDD66" },
                  { name: "Nutrition", value: 18, color: "#33394F" },
                  { name: "Fitness", value: 22, color: "#000723" },
                ]}
                className="max-w-md mx-auto"
                centerLabel="Overall Health"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-light text-gold-400 mb-4">Multi-Segment Chart</h3>
              <ArtDecoRadialChart
                data={[
                  { name: "Age 20-30", value: 15, color: "#FFC700" },
                  { name: "Age 31-40", value: 22, color: "#FFDD66" },
                  { name: "Age 41-50", value: 28, color: "#CCA000" },
                  { name: "Age 51-60", value: 18, color: "#33394F" },
                  { name: "Age 61+", value: 17, color: "#000723" },
                ]}
                className="max-w-md mx-auto"
                centerLabel="Demographics"
              />
            </div>
          </div>
        </section>
        
        {/* Navigation Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Navigation Components</h2>
          <ArtDecoGradientDivider />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Items</CardTitle>
                <CardDescription>Different styles and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 border border-gold-500/20 rounded-md p-4">
                <div className="space-y-1">
                  <ArtDecoNavItem
                    icon={<Home className="h-4 w-4" />}
                    label="Dashboard"
                    href="#"
                    active
                  />
                  <ArtDecoNavItem
                    icon={<User className="h-4 w-4" />}
                    label="Profile"
                    href="#"
                  />
                  <ArtDecoNavItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Calendar"
                    href="#"
                  />
                  <ArtDecoNavItem
                    icon={<Settings className="h-4 w-4" />}
                    label="Settings"
                    href="#"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Navigation Variants</CardTitle>
                <CardDescription>Different visual styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 border border-gold-500/20 rounded-md p-4">
                <div className="space-y-2">
                  <ArtDecoNavItem
                    label="Default Style"
                    href="#"
                    variant="default"
                  />
                  <ArtDecoNavItem
                    label="Subtle Style"
                    href="#"
                    variant="subtle"
                  />
                  <ArtDecoNavItem
                    label="Bordered Style"
                    href="#"
                    variant="bordered"
                  />
                  <ArtDecoNavItem
                    label="Underlined Style"
                    href="#"
                    variant="underlined"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Navigation Decorations</CardTitle>
                <CardDescription>Items with decorative elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gold-500/20 rounded-md p-4">
                    <h4 className="text-sm text-gold-300 mb-2">Diamond Decoration</h4>
                    <div className="space-y-1">
                      <ArtDecoNavItem
                        label="Home"
                        href="#"
                        decoration="diamond"
                      />
                      <ArtDecoNavItem
                        label="Analytics"
                        href="#"
                        decoration="diamond"
                      />
                      <ArtDecoNavItem
                        label="Reports"
                        href="#"
                        decoration="diamond"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-gold-500/20 rounded-md p-4">
                    <h4 className="text-sm text-gold-300 mb-2">Corner Decoration</h4>
                    <div className="space-y-1">
                      <ArtDecoNavItem
                        label="Home"
                        href="#"
                        decoration="corners"
                      />
                      <ArtDecoNavItem
                        label="Analytics"
                        href="#"
                        decoration="corners"
                      />
                      <ArtDecoNavItem
                        label="Reports"
                        href="#"
                        decoration="corners"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-gold-500/20 rounded-md p-4">
                    <h4 className="text-sm text-gold-300 mb-2">Glow Effect</h4>
                    <div className="space-y-1">
                      <ArtDecoNavItem
                        label="Home"
                        href="#"
                        decoration="glow"
                      />
                      <ArtDecoNavItem
                        label="Analytics"
                        href="#"
                        decoration="glow"
                      />
                      <ArtDecoNavItem
                        label="Reports"
                        href="#"
                        decoration="glow"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Dividers Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Dividers</h2>
          
          <div className="space-y-8">
            <ArtDecoGradientDivider text="Simple Divider" />
            
            <ArtDecoGradientDivider text="With Diamonds" pattern="diamonds" />
            
            <ArtDecoGradientDivider text="With Zigzag" pattern="zigzag" />
            
            <ArtDecoGradientDivider text="With Dots" pattern="dots" />
            
            <ArtDecoGradientDivider />
          </div>
        </section>
        
        {/* Footer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-light text-gold-400">Footer</h2>
          <ArtDecoGradientDivider />
          
          <Card>
            <CardHeader>
              <CardTitle>Footer Component</CardTitle>
              <CardDescription>Sample footer implementations</CardDescription>
            </CardHeader>
            <CardContent className="border border-gold-500/20 rounded-md">
              <ArtDecoFooter 
                brandName="Vital Health Vision"
                tagline="The Art of Health Analytics"
                pattern="diamond"
                sections={[
                  {
                    title: "Resources",
                    links: [
                      { label: "Documentation", href: "#" },
                      { label: "API Reference", href: "#" },
                      { label: "Guides", href: "#" }
                    ]
                  },
                  {
                    title: "Company",
                    links: [
                      { label: "About Us", href: "#" },
                      { label: "Careers", href: "#" },
                      { label: "Contact", href: "#" }
                    ]
                  },
                  {
                    title: "Legal",
                    links: [
                      { label: "Privacy", href: "#" },
                      { label: "Terms", href: "#" },
                      { label: "Data Policy", href: "#" }
                    ]
                  }
                ]}
                socialLinks={[
                  { 
                    icon: <Mail className="h-4 w-4" />, 
                    href: "#", 
                    label: "Email" 
                  }
                ]}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ArtDecoComponentsShowcase;
