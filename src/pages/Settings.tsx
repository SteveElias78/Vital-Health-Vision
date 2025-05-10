
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { demoRole } = useAuth();
  const isAdmin = demoRole === 'administrator';

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and application preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:flex">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={isAdmin ? "Administrator" : "Researcher"} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={isAdmin ? "admin@demo.vhv" : "researcher@demo.vhv"} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={isAdmin ? "Administrator" : "Researcher"} readOnly />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                This is a demo account. Editing is disabled.
              </p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" value="••••••••" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Change password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="artDeco">Art Deco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="density">Data Density</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="medium">Medium (Default)</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Interface animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Save preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data updates</p>
                    <p className="text-sm text-muted-foreground">Receive notifications when data is updated</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analysis reports</p>
                    <p className="text-sm text-muted-foreground">Receive notifications for new analysis reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System alerts</p>
                    <p className="text-sm text-muted-foreground">Critical alerts and system notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                {isAdmin && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">User activity</p>
                      <p className="text-sm text-muted-foreground">Notifications about user registrations and logins</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Update preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="admin" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Advanced settings for administrators only
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Demo Mode</p>
                      <p className="text-sm text-muted-foreground">Application is currently in demo mode</p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Source Management</p>
                      <p className="text-sm text-muted-foreground">Allow modification of data sources</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Access</p>
                      <p className="text-sm text-muted-foreground">Enable API access to health data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button disabled>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Administrator</p>
                        <p className="text-sm text-muted-foreground">admin@demo.vhv</p>
                      </div>
                      <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Researcher</p>
                        <p className="text-sm text-muted-foreground">researcher@demo.vhv</p>
                      </div>
                      <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled>Add User</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
