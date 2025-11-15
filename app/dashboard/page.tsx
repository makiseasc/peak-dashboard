"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SideNav } from "@/components/ui/SideNav";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { MetricTile } from "@/components/ui/MetricTile";
import { RevenueLineChart } from "@/components/charts/RevenueLineChart";
import { PipelineFunnel } from "@/components/charts/PipelineFunnel";
import { XPLineChart } from "@/components/charts/XPLineChart";
import { OutreachDonut } from "@/components/charts/OutreachDonut";
import { SentimentPie } from "@/components/charts/SentimentPie";
import { ProductivityGauge } from "@/components/charts/ProductivityGauge";
import { TimelineFeed } from "@/components/cards/TimelineFeed";
import { DealFlowTimeline } from "@/components/cards/DealFlowTimeline";
import { HLAHeatmap } from "@/components/cards/HLAHeatmap";
import { DollarSign, TrendingUp, Zap, Target } from "lucide-react";
import { RevenueWidget } from "@/components/widgets/RevenueWidget";
import { PipelineWidget } from "@/components/widgets/PipelineWidget";
import { HLAWidget } from "@/components/widgets/HLAWidget";
import { OutreachWidget } from "@/components/widgets/OutreachWidget";

export default function DashboardPage() {
  // Sample data for charts - replace with real data from API
  const revenueData = [
    { date: 'Nov 1', amount: 0 },
    { date: 'Nov 8', amount: 0 },
    { date: 'Nov 15', amount: 0 },
  ];
  
  const pipelineData = [
    { stage: 'Discovery', count: 0 },
    { stage: 'Proposal', count: 0 },
    { stage: 'Negotiation', count: 0 },
    { stage: 'Closed', count: 0 },
  ];
  
  const xpData = [
    { date: 'Mon', xp: 30 },
    { date: 'Tue', xp: 30 },
    { date: 'Wed', xp: 30 },
  ];

  // Row 2: Advanced Analytics Data
  const outreachData = {
    positive: 5,
    neutral: 10,
    noResponse: 85,
    responseRate: 15,
  };

  const sentimentData = [
    { name: 'Positive', value: 25 },
    { name: 'Neutral', value: 50 },
    { name: 'Negative', value: 15 },
    { name: 'No Response', value: 10 },
  ];

  const productivityScore = 75; // 0-100

  // Row 3: Timeline & Heatmap Data
  const recentActivities = [
    { id: '1', type: 'hla' as const, description: 'Completed daily HLA: Content creation', timestamp: new Date().toISOString() },
    { id: '2', type: 'revenue' as const, description: 'Added revenue entry: $500', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', type: 'deal' as const, description: 'Added deal: Client ABC', timestamp: new Date(Date.now() - 7200000).toISOString() },
  ];

  const activeDeals = [
    { id: '1', client_name: 'Client ABC', stage: 'Proposal', date: new Date().toISOString() },
    { id: '2', client_name: 'Client XYZ', stage: 'Negotiation', date: new Date().toISOString() },
  ];

  const hlaHistory = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5),
    };
  });

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
                    PEAK
                  </span>
                  {" "}
                  <span className="text-white">Dashboard</span>
                </h1>
                <p className="text-slate-400">Empire Operations Command Center</p>
              </div>

              {/* Top Metrics Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricTile label="XP Today" value="30" trend={0} icon={<Zap className="w-5 h-5" />} />
                <MetricTile label="Total Revenue" value="$0" trend={0} icon={<DollarSign className="w-5 h-5" />} />
                <MetricTile label="Active Deals" value="0" icon={<Target className="w-5 h-5" />} />
                <MetricTile label="Messages Sent" value="0" icon={<TrendingUp className="w-5 h-5" />} />
              </div>

              {/* Row 1: Main Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Analytics */}
                <AnalyticsCard title="Revenue" subtitle="Last 30 days">
                  <RevenueLineChart data={revenueData} />
                </AnalyticsCard>

                {/* Pipeline Funnel */}
                <AnalyticsCard title="Pipeline" subtitle="Deal stages">
                  <PipelineFunnel data={pipelineData} />
                </AnalyticsCard>

                {/* XP Tracking */}
                <AnalyticsCard title="Execution" subtitle="XP over time">
                  <XPLineChart data={xpData} />
                </AnalyticsCard>
              </div>

              {/* Row 2: Advanced Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <AnalyticsCard title="Outreach Performance" subtitle="Response metrics">
                  <OutreachDonut data={outreachData} />
                </AnalyticsCard>

                <AnalyticsCard title="Sentiment Analysis" subtitle="Reply breakdown">
                  <SentimentPie data={sentimentData} />
                </AnalyticsCard>

                <AnalyticsCard title="Productivity Score" subtitle="Your execution rating">
                  <ProductivityGauge score={productivityScore} />
                </AnalyticsCard>
              </div>

              {/* Row 3: Timelines & Heatmaps */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <AnalyticsCard title="Activity Feed" subtitle="Recent operations">
                  <TimelineFeed activities={recentActivities} />
                </AnalyticsCard>

                <AnalyticsCard title="Deal Flow" subtitle="Pipeline progression">
                  <DealFlowTimeline deals={activeDeals} />
                </AnalyticsCard>

                <AnalyticsCard title="Execution Heatmap" subtitle="28-day activity">
                  <HLAHeatmap data={hlaHistory} />
                </AnalyticsCard>
              </div>

              {/* Row 4: Existing Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueWidget />
                <PipelineWidget />
                <div className="space-y-6">
                  <HLAWidget />
                  <OutreachWidget />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

