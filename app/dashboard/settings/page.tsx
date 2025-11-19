"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SideNav } from "@/components/ui/SideNav";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Key, Bell, Palette, User, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen relative overflow-hidden">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[#0a0e27]" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Radial glows */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-cyan-500/25 rounded-full blur-[200px]" />
        </div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="w-full h-full bg-grid animate-grid-move" />
        </div>
        
        {/* Layout */}
        <div className="relative z-10 flex">
          <SideNav />
          <main className="flex-1 overflow-auto">
            <div className="p-8 max-w-4xl">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Settings
                  </span>
                </h1>
                <p className="text-slate-400">Manage your account preferences and integrations</p>
              </div>

              {/* User Preferences */}
              <AnalyticsCard title="User Preferences" subtitle="Account information" className="mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="makise@ops" className="mt-1" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-slate-400">Receive updates about your dashboard</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Palette className="w-5 h-5 text-slate-400" />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <Label>Theme</Label>
                        <p className="text-xs text-slate-400">Dark mode (default)</p>
                      </div>
                      <Button variant="outline" size="sm">Change Theme</Button>
                    </div>
                  </div>
                </div>
              </AnalyticsCard>

              {/* API Keys */}
              <AnalyticsCard title="API Keys & Integrations" subtitle="Manage external service connections" className="mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Key className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <Label htmlFor="supabase-key">Supabase API Key</Label>
                      <Input 
                        id="supabase-key" 
                        type="password" 
                        defaultValue="••••••••••••" 
                        className="mt-1 font-mono" 
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Key className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <Label htmlFor="gumroad-key">Gumroad API Key</Label>
                      <Input 
                        id="gumroad-key" 
                        type="password" 
                        defaultValue="••••••••••••" 
                        className="mt-1 font-mono" 
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Key className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <Label htmlFor="n8n-webhook">n8n Webhook URL</Label>
                      <Input 
                        id="n8n-webhook" 
                        defaultValue="https://n8n.example.com/webhook" 
                        className="mt-1 font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </AnalyticsCard>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

