
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-gold-500/30 pb-4">
        <h1 className="text-3xl font-light text-gold-400">
          Application <span className="font-medium">Settings</span>
        </h1>
        <p className="text-gold-300 mt-2">
          Customize your experience and configure application preferences.
        </p>
      </div>
      
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="bg-midnight-800/50 border border-gold-500/30 mb-6">
          <TabsTrigger value="user" className="text-gold-300 data-[state=active]:text-gold-400 data-[state=active]:bg-midnight-900">
            User Preferences
          </TabsTrigger>
          <TabsTrigger value="data" className="text-gold-300 data-[state=active]:text-gold-400 data-[state=active]:bg-midnight-900">
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-gold-300 data-[state=active]:text-gold-400 data-[state=active]:bg-midnight-900">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account" className="text-gold-300 data-[state=active]:text-gold-400 data-[state=active]:bg-midnight-900">
            Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <Card className="art-deco-card border-gold-300">
            <div className="art-deco-card-header p-4">
              <h2 className="art-deco-title">User Preferences</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">Default Dashboard View</label>
                  <Select defaultValue="health_metrics">
                    <SelectTrigger className="art-deco-input">
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent className="bg-midnight-800 border-gold-500/30">
                      <SelectItem value="health_metrics" className="text-gold-50">Health Metrics</SelectItem>
                      <SelectItem value="demographics" className="text-gold-50">Demographics</SelectItem>
                      <SelectItem value="geographic" className="text-gold-50">Geographic Data</SelectItem>
                      <SelectItem value="predictions" className="text-gold-50">Predictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">Data Update Frequency</label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="art-deco-input">
                      <SelectValue placeholder="Select update frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-midnight-800 border-gold-500/30">
                      <SelectItem value="realtime" className="text-gold-50">Real-time</SelectItem>
                      <SelectItem value="hourly" className="text-gold-50">Hourly</SelectItem>
                      <SelectItem value="daily" className="text-gold-50">Daily</SelectItem>
                      <SelectItem value="weekly" className="text-gold-50">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-gold-300">Enable Email Notifications</h3>
                    <p className="text-xs text-gold-300/70">Receive email updates about health trends</p>
                  </div>
                  <Switch id="email-notifications" className="bg-midnight-800 data-[state=checked]:bg-gold-500" />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-gold-300">Show Confidence Intervals</h3>
                    <p className="text-xs text-gold-300/70">Display statistical confidence in predictions</p>
                  </div>
                  <Switch id="confidence-intervals" className="bg-midnight-800 data-[state=checked]:bg-gold-500" defaultChecked />
                </div>
              </div>
              
              <div className="art-deco-divider"></div>
              
              <div className="flex justify-end">
                <Button className="art-deco-button">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card className="art-deco-card border-gold-300">
            <div className="art-deco-card-header p-4">
              <h2 className="art-deco-title">Data Sources</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">Primary Data Source</label>
                  <Select defaultValue="nhanes">
                    <SelectTrigger className="art-deco-input">
                      <SelectValue placeholder="Select primary source" />
                    </SelectTrigger>
                    <SelectContent className="bg-midnight-800 border-gold-500/30">
                      <SelectItem value="nhanes" className="text-gold-50">NHANES</SelectItem>
                      <SelectItem value="brfss" className="text-gold-50">BRFSS</SelectItem>
                      <SelectItem value="who" className="text-gold-50">WHO Database</SelectItem>
                      <SelectItem value="custom" className="text-gold-50">Custom Source</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">API Endpoint</label>
                  <Input 
                    type="url" 
                    placeholder="https://api.example.com/health-data" 
                    className="art-deco-input"
                    defaultValue="https://api.nhanes.cdc.gov/v1/data" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">API Key</label>
                  <Input 
                    type="password" 
                    placeholder="Enter API key" 
                    className="art-deco-input"
                    defaultValue="••••••••••••••••"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-gold-300">Use Fallback Sources</h3>
                    <p className="text-xs text-gold-300/70">Switch to alternate data sources when primary is unavailable</p>
                  </div>
                  <Switch id="fallback-sources" className="bg-midnight-800 data-[state=checked]:bg-gold-500" defaultChecked />
                </div>
              </div>
              
              <div className="art-deco-divider"></div>
              
              <div className="flex justify-between">
                <Button variant="outline" className="border-gold-500/30 text-gold-400">
                  Test Connection
                </Button>
                <Button className="art-deco-button">Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="art-deco-card border-gold-300">
            <div className="art-deco-card-header p-4">
              <h2 className="art-deco-title">Appearance Settings</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-midnight-800/50 border border-gold-500/30 p-4 rounded-md flex flex-col items-center cursor-pointer hover:border-gold-400 transition-all">
                    <div className="art-deco-circle mb-3"></div>
                    <h3 className="text-gold-400 text-sm">Art Deco Gold</h3>
                    <p className="text-xs text-gold-300/70 text-center">
                      Classic gold and midnight theme
                    </p>
                  </div>
                  
                  <div className="bg-midnight-800/50 border border-gold-500/30 p-4 rounded-md flex flex-col items-center cursor-pointer opacity-60 hover:opacity-80 hover:border-gold-400 transition-all">
                    <div className="art-deco-circle mb-3 border-teal-500 bg-teal-500/10"></div>
                    <h3 className="text-teal-400 text-sm">Teal Accent</h3>
                    <p className="text-xs text-gold-300/70 text-center">
                      Teal and midnight variant
                    </p>
                  </div>
                  
                  <div className="bg-midnight-800/50 border border-gold-500/30 p-4 rounded-md flex flex-col items-center cursor-pointer opacity-60 hover:opacity-80 hover:border-gold-400 transition-all">
                    <div className="art-deco-circle mb-3 border-purple-500 bg-purple-500/10"></div>
                    <h3 className="text-purple-400 text-sm">Royal Purple</h3>
                    <p className="text-xs text-gold-300/70 text-center">
                      Purple and midnight variant
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <label className="text-sm text-gold-300">Chart Style</label>
                  <Select defaultValue="art_deco">
                    <SelectTrigger className="art-deco-input">
                      <SelectValue placeholder="Select chart style" />
                    </SelectTrigger>
                    <SelectContent className="bg-midnight-800 border-gold-500/30">
                      <SelectItem value="art_deco" className="text-gold-50">Art Deco</SelectItem>
                      <SelectItem value="modern" className="text-gold-50">Modern</SelectItem>
                      <SelectItem value="minimalist" className="text-gold-50">Minimalist</SelectItem>
                      <SelectItem value="classic" className="text-gold-50">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-gold-300">Enable Animations</h3>
                    <p className="text-xs text-gold-300/70">Display animated transitions in visualizations</p>
                  </div>
                  <Switch id="animations" className="bg-midnight-800 data-[state=checked]:bg-gold-500" defaultChecked />
                </div>
              </div>
              
              <div className="art-deco-divider"></div>
              
              <div className="flex justify-end">
                <Button className="art-deco-button">Apply Theme</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="art-deco-card border-gold-300">
            <div className="art-deco-card-header p-4">
              <h2 className="art-deco-title">Account Settings</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="art-deco-input"
                    defaultValue="user@example.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gold-300">Change Password</label>
                  <Input 
                    type="password" 
                    placeholder="Current password" 
                    className="art-deco-input mb-2"
                  />
                  <Input 
                    type="password" 
                    placeholder="New password" 
                    className="art-deco-input mb-2"
                  />
                  <Input 
                    type="password" 
                    placeholder="Confirm new password" 
                    className="art-deco-input"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-gold-300">Two-Factor Authentication</h3>
                    <p className="text-xs text-gold-300/70">Enhance account security with 2FA</p>
                  </div>
                  <Switch id="twofa" className="bg-midnight-800 data-[state=checked]:bg-gold-500" defaultChecked />
                </div>
              </div>
              
              <div className="art-deco-divider"></div>
              
              <div className="flex justify-between">
                <Button variant="outline" className="border border-red-500/30 text-red-400 hover:bg-red-900/10">
                  Delete Account
                </Button>
                <Button className="art-deco-button">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
