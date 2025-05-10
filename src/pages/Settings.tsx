
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user, isDemo, demoRole, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>
        {isDemo && <DemoModeIndicator />}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {isDemo && (demoRole === 'administrator' ? 'AD' : 'RS')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {isDemo && (
                        demoRole === 'administrator' 
                          ? 'Demo Administrator' 
                          : 'Demo Researcher'
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isDemo && (
                        demoRole === 'administrator' 
                          ? 'admin@demo.vhv' 
                          : 'researcher@demo.vhv'
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={isDemo ? (demoRole === 'administrator' ? 'Demo Administrator' : 'Demo Researcher') : ''} 
                    disabled={isDemo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={isDemo ? (demoRole === 'administrator' ? 'admin@demo.vhv' : 'researcher@demo.vhv') : ''}
                    disabled={isDemo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    value={isDemo ? (demoRole === 'administrator' ? 'Administrator' : 'Researcher') : ''}
                    disabled
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                <Button onClick={handleSaveChanges} disabled={isDemo}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    disabled={isDemo}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    disabled={isDemo}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    disabled={isDemo}
                    placeholder="••••••••"
                  />
                </div>
                
                {isDemo && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm mt-4">
                    Password changes are not available in demo mode
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isDemo}>Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Visual Preferences</CardTitle>
              <CardDescription>Customize the appearance of the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Visualization Style</p>
                  <p className="text-sm text-gray-500">Choose your preferred chart style</p>
                </div>
                <Select defaultValue="modern">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Color Scheme</p>
                  <p className="text-sm text-gray-500">Select visualization color palette</p>
                </div>
                <Select defaultValue="default">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select colors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="colorblind">Colorblind Friendly</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact View</p>
                  <p className="text-sm text-gray-500">Show more data in less space</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Report Alerts</p>
                  <p className="text-sm text-gray-500">Be notified when new reports are available</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Update Notifications</p>
                  <p className="text-sm text-gray-500">Get alerted when data sources are updated</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI Insight Notifications</p>
                  <p className="text-sm text-gray-500">Be notified when new AI insights are generated</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              {isDemo && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm mt-4">
                  Notification settings are simulated in demo mode - no actual emails will be sent
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Source Configuration</CardTitle>
              <CardDescription>Manage data sources and integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CDC Data API</p>
                  <p className="text-sm text-gray-500">Centers for Disease Control and Prevention</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">NHANES Integration</p>
                  <p className="text-sm text-gray-500">National Health and Nutrition Examination Survey</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">BRFSS Data Source</p>
                  <p className="text-sm text-gray-500">Behavioral Risk Factor Surveillance System</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">WHO Health Statistics</p>
                  <p className="text-sm text-gray-500">World Health Organization global data</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Census Integration</p>
                  <p className="text-sm text-gray-500">U.S. Census Bureau demographic data</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              {isDemo && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm mt-4">
                  All data sources in demo mode use simulated data sets
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Data Source Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
