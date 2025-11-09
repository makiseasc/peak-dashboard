"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Target, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OperatorStats {
  totalXP: number;
  streakCount: number;
  bestStreak: number;
  completionRate: number;
  totalHLAs: number;
  completedHLAs: number;
  chartData: Array<{
    date: string;
    completion: string;
    total: number;
    completed: number;
  }>;
  days: number;
}

async function fetchOperatorStats(days: number = 14): Promise<OperatorStats> {
  const res = await fetch(`/api/operator-stats?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch operator stats");
  return res.json();
}

export function OperatorStatsWidget() {
  const [days, setDays] = useState(14);

  const { data, isLoading, error } = useQuery<OperatorStats>({
    queryKey: ["operator-stats", days],
    queryFn: () => fetchOperatorStats(days),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operator Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operator Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading operator stats</div>
        </CardContent>
      </Card>
    );
  }

  const stats = data || {
    totalXP: 0,
    streakCount: 0,
    bestStreak: 0,
    completionRate: 0,
    totalHLAs: 0,
    completedHLAs: 0,
    chartData: [],
    days: 14,
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Operator Analytics
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Last {days} days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            <p className="text-2xl font-bold text-purple-300">{stats.totalXP}</p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-green-500/10 to-green-500/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
            <p className="text-2xl font-bold text-green-300">{stats.streakCount} days</p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
            <p className="text-2xl font-bold text-yellow-300">{stats.bestStreak} days</p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
            <p className="text-2xl font-bold text-blue-300">{stats.completionRate}%</p>
          </div>
        </div>

        {/* Completion Chart */}
        {stats.chartData.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-4">Daily Completion Trend</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                    formatter={(value: any) => [`${value}%`, "Completion"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">HLAs Completed</p>
            <p className="text-xl font-semibold">
              {stats.completedHLAs}/{stats.totalHLAs}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total HLAs</p>
            <p className="text-xl font-semibold">{stats.totalHLAs}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

