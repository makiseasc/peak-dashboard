"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  metrics: {
    totalRevenue: number;
    avgDaily: number;
    activePipeline: number;
    completedHLA: number;
    totalHLA: number;
  };
  report: string;
}

export function DailyReportWidget() {
  const [report, setReport] = useState<string>("");
  const [metrics, setMetrics] = useState<ReportData["metrics"] | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report");
      if (!res.ok) throw new Error("Failed to generate report");
      
      const data: ReportData = await res.json();
      setReport(data.report);
      setMetrics(data.metrics);
      toast.success("Daily report generated! 📊");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report");
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            AI Daily Brief
          </CardTitle>
          <Button
            onClick={generateReport}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {metrics && (
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg border border-border bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <p className="text-xs text-muted-foreground mb-1">Revenue (30d)</p>
              <p className="text-lg font-semibold">${metrics.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <p className="text-xs text-muted-foreground mb-1">Daily Avg</p>
              <p className="text-lg font-semibold">${metrics.avgDaily.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-gradient-to-br from-green-500/10 to-green-500/5">
              <p className="text-xs text-muted-foreground mb-1">Active Pipeline</p>
              <p className="text-lg font-semibold">{metrics.activePipeline}</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
              <p className="text-xs text-muted-foreground mb-1">HLAs</p>
              <p className="text-lg font-semibold">
                {metrics.completedHLA}/{metrics.totalHLA}
              </p>
            </div>
          </div>
        )}

        {report && (
          <div className="bg-gradient-to-br from-slate-950/50 to-slate-900/50 rounded-lg p-6 border border-purple-500/20">
            <div className="prose prose-invert max-w-none">
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {report}
              </pre>
            </div>
          </div>
        )}

        {!report && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Click "Generate Report" to create your AI-powered daily briefing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

