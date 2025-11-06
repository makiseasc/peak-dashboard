import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function FinancialSnapshot() {
  const { data } = useDashboard();
  
  const monthlyChange = data.currentRevenue - (data.previousRevenue || data.lastMonthRevenue);
  const changePercent = (data.previousRevenue || data.lastMonthRevenue) 
    ? ((monthlyChange / (data.previousRevenue || data.lastMonthRevenue)) * 100).toFixed(1)
    : "0.0";
  const isPositive = monthlyChange >= 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${data.currentRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-5" />
                )}
                <span className={`text-sm font-semibold ${isPositive ? "text-chart-1" : "text-chart-5"}`}>
                  {changePercent}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${data.monthlySavings?.toLocaleString() || "0"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((data.monthlySavings || 0) / (data.currentRevenue || 1) * 100).toFixed(0)}% of revenue
              </p>
            </div>
            <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <PiggyBank className="h-6 w-6 text-chart-1" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${data.revenueGoal?.toLocaleString() || "0"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((data.currentRevenue / (data.revenueGoal || 1)) * 100).toFixed(0)}% achieved
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
