"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SideNav } from "@/components/ui/SideNav";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { RevenueLineChart } from "@/components/charts/RevenueLineChart";
import { PipelineFunnel } from "@/components/charts/PipelineFunnel";
import { XPLineChart } from "@/components/charts/XPLineChart";
import { OutreachDonut } from "@/components/charts/OutreachDonut";
import { SentimentPie } from "@/components/charts/SentimentPie";
import { ProductivityGauge } from "@/components/charts/ProductivityGauge";

export default function AnalyticsPage() {
  // Sample data - would be replaced with real API calls
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

  const productivityScore = 75;

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
                    Analytics
                  </span>
                </h1>
                <p className="text-slate-400">Deep dive into your performance metrics</p>
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AnalyticsCard title="Revenue Trends" subtitle="Last 30 days">
                  <RevenueLineChart data={revenueData} />
                </AnalyticsCard>

                <AnalyticsCard title="Pipeline Distribution" subtitle="Deal stages">
                  <PipelineFunnel data={pipelineData} />
                </AnalyticsCard>

                <AnalyticsCard title="XP Progression" subtitle="Execution over time">
                  <XPLineChart data={xpData} />
                </AnalyticsCard>

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
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

