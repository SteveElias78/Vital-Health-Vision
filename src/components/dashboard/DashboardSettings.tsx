
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

interface Widget {
  id: string;
  name: string;
  component: React.ComponentType<any>;
}

interface DashboardSettingsProps {
  widgets: Widget[];
  activeWidgets: string[];
  toggleWidget: (id: string) => void;
  colorThemes: ColorTheme[];
  currentTheme: string;
  setColorTheme: (theme: string) => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
  onClose: () => void;
}

export function DashboardSettings({
  widgets,
  activeWidgets,
  toggleWidget,
  colorThemes,
  currentTheme,
  setColorTheme,
  compactMode,
  setCompactMode,
  onClose
}: DashboardSettingsProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Dashboard Settings</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Visible Widgets</h3>
            <div className="space-y-3">
              {widgets.map((widget) => (
                <div key={widget.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`widget-${widget.id}`} 
                    checked={activeWidgets.includes(widget.id)} 
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                  <Label htmlFor={`widget-${widget.id}`} className="font-medium">
                    {widget.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Color Theme</h3>
              <RadioGroup 
                value={currentTheme}
                onValueChange={setColorTheme}
                className="space-y-3"
              >
                {colorThemes.map((theme) => (
                  <div key={theme.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} />
                    <Label htmlFor={`theme-${theme.id}`} className="font-medium flex items-center">
                      <span className={`w-4 h-4 rounded-full mr-2 ${theme.primary}`}></span>
                      {theme.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Layout Options</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
                <Label htmlFor="compact-mode">Compact Layout</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
