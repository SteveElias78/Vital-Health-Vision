
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { Download, Filter, PlusCircle } from 'lucide-react';

// Reports page - admin only
const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('health-outcomes');
  const [timeFrame, setTimeFrame] = useState<string>('monthly');
  const { isDemo, demoRole } = useAuth();
  
  const reports = [
    { id: 1, name: 'National Health Status Summary', type: 'health-outcomes', date: '2025-04-01', status: 'Generated' },
    { id: 2, name: 'Demographic Health Disparities Analysis', type: 'demographic', date: '2025-04-01', status: 'Generated' },
    { id: 3, name: 'Regional Health Metrics Comparison', type: 'geographic', date: '2025-03-01', status: 'Generated' },
    { id: 4, name: 'Preventive Care Utilization Patterns', type: 'health-outcomes', date: '2025-03-01', status: 'Generated' },
    { id: 5, name: 'Healthcare Access Metrics by Region', type: 'geographic', date: '2025-02-01', status: 'Generated' }
  ];
  
  const templates = [
    { id: 1, name: 'Health Outcomes Overview', category: 'health-outcomes', frequency: 'Monthly' },
    { id: 2, name: 'Demographic Analysis Template', category: 'demographic', frequency: 'Quarterly' },
    { id: 3, name: 'Geographic Distribution Report', category: 'geographic', frequency: 'Monthly' },
    { id: 4, name: 'Annual Health Trends Summary', category: 'health-outcomes', frequency: 'Yearly' },
    { id: 5, name: 'Health Equity Dashboard', category: 'demographic', frequency: 'Monthly' }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Report Management</h1>
          <p className="text-gray-500">Administrator reporting tools</p>
        </div>
        <div className="flex items-center gap-4">
          {isDemo && <DemoModeIndicator />}
        </div>
      </div>

      <Tabs defaultValue="reports">
        <TabsList className="mb-6">
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduler">Report Scheduler</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>Download or share generated reports</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="health-outcomes">Health Outcomes</SelectItem>
                      <SelectItem value="demographic">Demographic</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => reportType === 'all' || report.type === reportType)
                    .map(report => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell className="capitalize">{report.type.replace('-', ' ')}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Templates</CardTitle>
                  <CardDescription>Manage and create report templates</CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default Frequency</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map(template => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="capitalize">{template.category.replace('-', ' ')}</TableCell>
                      <TableCell>{template.frequency}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Generate Now</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduler">
          <Card>
            <CardHeader>
              <CardTitle>Report Scheduler</CardTitle>
              <CardDescription>Configure automatic report generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reportTemplate">Report Template</Label>
                      <Select defaultValue="health-outcomes-overview">
                        <SelectTrigger id="reportTemplate">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health-outcomes-overview">Health Outcomes Overview</SelectItem>
                          <SelectItem value="demographic-analysis">Demographic Analysis Template</SelectItem>
                          <SelectItem value="geographic-distribution">Geographic Distribution Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={timeFrame} onValueChange={setTimeFrame}>
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery-day">
                        {timeFrame === 'weekly' ? 'Day of Week' : 
                         timeFrame === 'monthly' ? 'Day of Month' : 
                         timeFrame === 'quarterly' ? 'Month of Quarter' : 
                         'Month of Year'}
                      </Label>
                      <Select defaultValue="1">
                        <SelectTrigger id="delivery-day">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeFrame === 'weekly' ? (
                            <>
                              <SelectItem value="1">Monday</SelectItem>
                              <SelectItem value="2">Tuesday</SelectItem>
                              <SelectItem value="3">Wednesday</SelectItem>
                              <SelectItem value="4">Thursday</SelectItem>
                              <SelectItem value="5">Friday</SelectItem>
                            </>
                          ) : timeFrame === 'monthly' ? (
                            <>
                              <SelectItem value="1">1st</SelectItem>
                              <SelectItem value="5">5th</SelectItem>
                              <SelectItem value="10">10th</SelectItem>
                              <SelectItem value="15">15th</SelectItem>
                              <SelectItem value="20">20th</SelectItem>
                              <SelectItem value="25">25th</SelectItem>
                              <SelectItem value="last">Last day</SelectItem>
                            </>
                          ) : timeFrame === 'quarterly' ? (
                            <>
                              <SelectItem value="1">First month</SelectItem>
                              <SelectItem value="2">Second month</SelectItem>
                              <SelectItem value="3">Third month</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="1">January</SelectItem>
                              <SelectItem value="4">April</SelectItem>
                              <SelectItem value="7">July</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="report-name">Report Name Format</Label>
                      <Input 
                        id="report-name" 
                        placeholder="[Template Name] - [Date]" 
                        defaultValue="[Template Name] - [Date]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery-method">Delivery Method</Label>
                      <Select defaultValue="email">
                        <SelectTrigger id="delivery-method">
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="dashboard">Dashboard Only</SelectItem>
                          <SelectItem value="both">Email & Dashboard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 pt-4">
                      <Label htmlFor="auto-archive" className="flex flex-1 items-center gap-2">
                        <span>Auto-archive older reports</span>
                      </Label>
                      <Switch id="auto-archive" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
