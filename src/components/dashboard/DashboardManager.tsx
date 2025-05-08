
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Save, Trash2, Edit, Eye, EyeOff, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserDashboards, DashboardConfig, SavedDashboard } from '@/hooks/useUserDashboards';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

interface DashboardManagerProps {
  layouts: any;
  activeWidgets: string[];
  colorTheme: string;
  compactMode: boolean;
  onClose: () => void;
  onLoadDashboard: (config: any) => void;
}

export function DashboardManager({
  layouts,
  activeWidgets,
  colorTheme,
  compactMode,
  onClose,
  onLoadDashboard
}: DashboardManagerProps) {
  const { 
    dashboards, 
    publicDashboards, 
    loading: isLoading, 
    saveDashboard, 
    updateDashboard, 
    deleteDashboard 
  } = useUserDashboards();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<SavedDashboard | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [session, setSession] = useState<any>(null);

  React.useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    saveDashboard(
      name, 
      {
        layouts,
        activeWidgets,
        colorTheme,
        compactMode
      }, 
      description, 
      isPublic
    );
    
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  const handleUpdate = () => {
    if (!selectedDashboard || !name.trim()) {
      return;
    }

    const updatedConfig: Partial<SavedDashboard> = {
      name,
      description: description || null,
      is_public: isPublic,
      layout: {
        layouts,
        activeWidgets,
        colorTheme,
        compactMode
      }
    };

    updateDashboard(selectedDashboard.id, updatedConfig);
    setSelectedDashboard(null);
    setEditMode(false);
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  const handleDelete = () => {
    if (selectedDashboard) {
      deleteDashboard(selectedDashboard.id);
      setSelectedDashboard(null);
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = (dashboard: SavedDashboard) => {
    setSelectedDashboard(dashboard);
    setName(dashboard.name);
    setDescription(dashboard.description || '');
    setIsPublic(dashboard.is_public || false);
    setEditMode(true);
  };

  const handleLoad = (dashboard: SavedDashboard) => {
    onLoadDashboard(dashboard.layout);
  };

  const handleCancel = () => {
    setSelectedDashboard(null);
    setEditMode(false);
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  const isAuthenticated = !!session;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Dashboard Manager</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <div className="space-y-6">
            {/* Save or Update Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{editMode ? 'Update Dashboard' : 'Save Current Dashboard'}</h3>
              <div className="space-y-2">
                <Label htmlFor="dashboard-name">Dashboard Name</Label>
                <Input
                  id="dashboard-name"
                  placeholder="My Dashboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dashboard-description">Description (Optional)</Label>
                <Textarea
                  id="dashboard-description"
                  placeholder="A brief description of this dashboard layout"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="is-public">Make Public</Label>
              </div>
              <div className="pt-2 flex space-x-2">
                {editMode ? (
                  <>
                    <Button onClick={handleUpdate}>
                      <Save className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* My Dashboards */}
            <div>
              <h3 className="text-lg font-medium mb-3">My Dashboards</h3>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Spinner />
                </div>
              ) : dashboards && dashboards.length > 0 ? (
                <div className="space-y-2">
                  {dashboards.map((dashboard) => (
                    <div 
                      key={dashboard.id} 
                      className="border rounded-md p-3 flex items-center justify-between hover:bg-accent/10"
                    >
                      <div>
                        <h4 className="font-medium">{dashboard.name}</h4>
                        {dashboard.description && (
                          <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                        )}
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <span>
                            {new Date(dashboard.created_at).toLocaleDateString()}
                          </span>
                          {dashboard.is_public && (
                            <span className="ml-2 flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleLoad(dashboard)}
                          title="Load Dashboard"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(dashboard)}
                          title="Edit Dashboard"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog open={showDeleteDialog && selectedDashboard?.id === dashboard.id} onOpenChange={setShowDeleteDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedDashboard(dashboard)}
                              title="Delete Dashboard"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{dashboard.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground p-4">
                  You haven't saved any dashboards yet.
                </p>
              )}
            </div>

            <Separator />
            
            {/* Public Dashboards */}
            <div>
              <h3 className="text-lg font-medium mb-3">Public Dashboards</h3>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Spinner />
                </div>
              ) : publicDashboards && publicDashboards.length > 0 ? (
                <div className="space-y-2">
                  {publicDashboards.map((dashboard) => (
                    <div 
                      key={dashboard.id} 
                      className="border rounded-md p-3 flex items-center justify-between hover:bg-accent/10"
                    >
                      <div>
                        <h4 className="font-medium">{dashboard.name}</h4>
                        {dashboard.description && (
                          <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                        )}
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <span>
                            {new Date(dashboard.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleLoad(dashboard)}
                        title="Load Dashboard"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground p-4">
                  No public dashboards available.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="mb-4">You need to be logged in to save and manage dashboards.</p>
            <Button asChild>
              <a href="/auth">Login or Sign Up</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
