
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Copy, CheckCircle } from 'lucide-react';

interface DashboardSharingProps {
  createShareableLink: () => string;
  onClose: () => void;
}

export function DashboardSharing({
  createShareableLink,
  onClose
}: DashboardSharingProps) {
  const [copied, setCopied] = useState(false);
  const shareableLink = createShareableLink();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Share Dashboard</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Copy the link below to share your dashboard configuration with others.
            Anyone with this link can view your dashboard layout.
          </p>
          
          <div className="flex space-x-2">
            <Input
              value={shareableLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyToClipboard} variant="outline" className="flex-shrink-0">
              {copied ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Sharing Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.13 1.196 4.92 4.92 0 00-8.391 4.482c-4.068-.21-7.675-2.16-10.088-5.14a4.917 4.917 0 001.525 6.57 4.91 4.91 0 01-2.23-.616v.06c0 2.39 1.7 4.38 3.952 4.83-.398.11-.814.17-1.245.17-.306 0-.598-.03-.885-.086a4.935 4.935 0 004.604 3.416A9.936 9.936 0 010 19.539a14.03 14.03 0 007.548 2.212c9.059 0 14.012-7.5 14.012-14.012 0-.21 0-.42-.016-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
