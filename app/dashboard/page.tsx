"use client";

import { useState, useEffect, useCallback } from "react";
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

interface Metrics {
  xpToday: number;
  totalRevenue: number;
  activeDeals: number;
  messagesSent: number;
}

export default function DashboardPage() {
  // Centralized state
  const [metrics, setMetrics] = useState<Metrics>({
    xpToday: 0,
    totalRevenue: 0,
    activeDeals: 0,
    messagesSent: 0,
  });

  const [revenueData, setRevenueData] = useState<Array<{ date: string; amount: number }>>([]);
  const [pipelineData, setPipelineData] = useState<Array<{ stage: string; count: number }>>([]);
  const [xpData, setXpData] = useState<Array<{ date: string; xp: number }>>([]);
  const [outreachData, setOutreachData] = useState({
    positive: 0,
    neutral: 0,
    noResponse: 0,
    responseRate: 0,
  });
  const [sentimentData, setSentimentData] = useState<Array<{ name: string; value: number }>>([]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [recentActivities, setRecentActivities] = useState<Array<{ id: string; type: 'hla' | 'revenue' | 'deal'; description: string; timestamp: string }>>([]);
  const [activeDeals, setActiveDeals] = useState<Array<{ id: string; client_name: string; stage: string; date: string }>>([]);
  const [hlaHistory, setHlaHistory] = useState<Array<{ date: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch HLAs for today
      const hlaRes = await fetch(`/api/hla?date=${today}`);
      const hlaData = await hlaRes.json();
      const todayHLAs = hlaData.today || [];
      
      // Calculate XP today
      const xpToday = todayHLAs.reduce((sum: number, hla: any) => sum + (hla.xp || 0), 0);

      // Fetch revenue (last 30 days)
      const revRes = await fetch('/api/revenue?days=30');
      const revData = await revRes.json();
      const revenueEntries = revData.revenue || [];
      
      // Calculate total revenue
      const totalRevenue = revenueEntries.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

      // Transform revenue data for chart (group by date)
      const revenueByDate = revenueEntries.reduce((acc: Record<string, number>, entry: any) => {
        const date = entry.date || today;
        acc[date] = (acc[date] || 0) + (entry.amount || 0);
        return acc;
      }, {});
      
      const revenueChartData = Object.entries(revenueByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
        .map(([date, amount]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: amount as number,
        }));

      // Fetch pipeline
      const pipRes = await fetch('/api/pipeline?activeOnly=false');
      const pipData = await pipRes.json();
      const pipelineDeals = pipData.deals || [];
      
      // Count active deals (not closed or lost)
      const activeDeals = pipelineDeals.filter((d: any) => 
        d.stage && !['closed', 'lost'].includes(d.stage.toLowerCase())
      );
      
      // Transform pipeline data for chart
      const pipelineByStage = pipelineDeals.reduce((acc: Record<string, number>, deal: any) => {
        const stage = deal.stage || 'unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});
      
      const pipelineChartData = [
        { stage: 'Discovery', count: pipelineByStage['discovery'] || 0 },
        { stage: 'Proposal', count: pipelineByStage['proposal'] || 0 },
        { stage: 'Negotiation', count: pipelineByStage['negotiation'] || 0 },
        { stage: 'Closed', count: pipelineByStage['closed'] || 0 },
      ];

      // Fetch XP data (last 7 days)
      const xpHistory: Array<{ date: string; xp: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayRes = await fetch(`/api/hla?date=${dateStr}`);
        const dayData = await dayRes.json();
        const dayHLAs = dayData.today || [];
        const dayXP = dayHLAs.reduce((sum: number, hla: any) => sum + (hla.xp || 0), 0);
        xpHistory.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          xp: dayXP,
        });
      }

      // Fetch outreach (last 30 days)
      const outRes = await fetch('/api/outreach?days=30');
      const outData = await outRes.json();
      const outreachEntries = outData.outreach || [];
      
      // Calculate messages sent
      const messagesSent = outreachEntries.reduce((sum: number, o: any) => sum + (o.messages_sent || 0), 0);
      
      // Calculate outreach metrics
      const totalSent = messagesSent;
      const totalReplies = outreachEntries.reduce((sum: number, o: any) => sum + (o.replies || 0), 0);
      const totalPositive = outreachEntries.reduce((sum: number, o: any) => sum + (o.positive_replies || 0), 0);
      const responseRate = totalSent > 0 ? Math.round((totalReplies / totalSent) * 100) : 0;
      
      const outreachChartData = {
        positive: totalPositive,
        neutral: totalReplies - totalPositive,
        noResponse: totalSent - totalReplies,
        responseRate,
      };

      // Calculate sentiment (placeholder - would need actual sentiment analysis)
      const sentimentChartData = [
        { name: 'Positive', value: totalPositive },
        { name: 'Neutral', value: totalReplies - totalPositive },
        { name: 'Negative', value: 0 },
        { name: 'No Response', value: totalSent - totalReplies },
      ];

      // Calculate productivity score (placeholder - would need actual calculation)
      const productivity = Math.min(100, Math.round((xpToday / 150) * 100));

      // Generate recent activities
      const activities = [];
      if (todayHLAs.length > 0) {
        activities.push({
          id: 'hla-1',
          type: 'hla' as const,
          description: `Completed ${todayHLAs.filter((h: any) => h.completed).length} HLAs today`,
          timestamp: new Date().toISOString(),
        });
      }
      if (revenueEntries.length > 0) {
        const latest = revenueEntries[revenueEntries.length - 1];
        activities.push({
          id: 'rev-1',
          type: 'revenue' as const,
          description: `Added revenue: $${latest.amount}`,
          timestamp: latest.date || new Date().toISOString(),
        });
      }
      if (activeDeals.length > 0) {
        activities.push({
          id: 'deal-1',
          type: 'deal' as const,
          description: `${activeDeals.length} active deals in pipeline`,
          timestamp: new Date().toISOString(),
        });
      }

      // Generate HLA heatmap (last 28 days)
      const heatmapData = [];
      for (let i = 27; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayRes = await fetch(`/api/hla?date=${dateStr}`);
        const dayData = await dayRes.json();
        const dayHLAs = dayData.today || [];
        heatmapData.push({
          date: dateStr,
          count: dayHLAs.length,
        });
      }

      // Update all state
      setMetrics({
        xpToday,
        totalRevenue,
        activeDeals: activeDeals.length,
        messagesSent,
      });

      setRevenueData(revenueChartData);
      setPipelineData(pipelineChartData);
      setXpData(xpHistory);
      setOutreachData(outreachChartData);
      setSentimentData(sentimentChartData);
      setProductivityScore(productivity);
      setRecentActivities(activities);
      setActiveDeals(activeDeals.map((d: any) => ({
        id: d.id,
        client_name: d.client_name || 'Unknown',
        stage: d.stage || 'unknown',
        date: d.date || today,
      })));
      setHlaHistory(heatmapData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh function to pass to widgets
  const handleDataUpdate = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

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
                <MetricTile label="XP Today" value={metrics.xpToday} trend={0} icon={<Zap className="w-5 h-5" />} />
                <MetricTile label="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} trend={0} icon={<DollarSign className="w-5 h-5" />} />
                <MetricTile label="Active Deals" value={metrics.activeDeals} icon={<Target className="w-5 h-5" />} />
                <MetricTile label="Messages Sent" value={metrics.messagesSent} icon={<TrendingUp className="w-5 h-5" />} />
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
                <RevenueWidget onUpdate={handleDataUpdate} />
                <PipelineWidget onUpdate={handleDataUpdate} />
                <div className="space-y-6">
                  <HLAWidget onUpdate={handleDataUpdate} />
                  <OutreachWidget onUpdate={handleDataUpdate} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

