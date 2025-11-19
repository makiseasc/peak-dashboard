"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SideNav } from "@/components/ui/SideNav";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Settings, ExternalLink } from "lucide-react";

export default function AutomationsPage() {
  const automations = [
    { 
      id: "1",
      name: "Daily Report Generator", 
      status: "Active", 
      lastRun: "2h ago",
      description: "Generates daily performance reports and sends to email",
      webhook: "https://n8n.example.com/webhook/daily-report"
    },
    { 
      id: "2",
      name: "Revenue Sync", 
      status: "Active", 
      lastRun: "5m ago",
      description: "Syncs revenue data from Gumroad to dashboard",
      webhook: "https://n8n.example.com/webhook/revenue-sync"
    },
    { 
      id: "3",
      name: "HLA Reminder", 
      status: "Idle", 
      lastRun: "Yesterday",
      description: "Sends daily reminders for High-Leverage Activities",
      webhook: "https://n8n.example.com/webhook/hla-reminder"
    },
    { 
      id: "4",
      name: "Pipeline Update", 
      status: "Active", 
      lastRun: "1h ago",
      description: "Updates pipeline stages based on deal progression",
      webhook: "https://n8n.example.com/webhook/pipeline-update"
    },
  ];

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
            <div className="p-8">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Automations
                  </span>
                </h1>
                <p className="text-slate-400">Manage your n8n workflows and webhooks</p>
              </div>

              {/* Automations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {automations.map((auto) => (
                  <AnalyticsCard key={auto.id} title={auto.name} subtitle={auto.description}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={auto.status === "Active" ? "default" : "secondary"}
                          className={auto.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                        >
                          {auto.status}
                        </Badge>
                        <span className="text-xs text-slate-400">Last run: {auto.lastRun}</span>
                      </div>
                      
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Webhook URL</p>
                        <p className="text-sm text-slate-300 font-mono truncate">{auto.webhook}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          {auto.status === "Active" ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(auto.webhook, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </AnalyticsCard>
                ))}
              </div>

              {/* Add New Automation */}
              <div className="mt-8">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white">
                  + Create New Automation
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
