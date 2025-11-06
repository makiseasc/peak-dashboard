import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { Flame, Trophy, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export function StreakDisplay() {
  const { data } = useDashboard();
  
  const getFlameSize = (streak: number) => {
    if (streak >= 100) return "h-12 w-12";
    if (streak >= 30) return "h-10 w-10";
    if (streak >= 7) return "h-8 w-8";
    return "h-6 w-6";
  };
  
  const getFlameColor = (streak: number, type: string) => {
    const today = new Date().toISOString().split("T")[0];
    const lastActivity = (data.streaks || []).find(s => s.type === type)?.lastActivity;
    const isAtRisk = lastActivity !== today;
    
    if (isAtRisk && streak > 0) return "text-destructive animate-pulse";
    if (streak >= 100) return "text-warning";
    if (streak >= 30) return "text-accent";
    if (streak >= 7) return "text-primary";
    return "text-muted-foreground";
  };
  
  const getStreakBadge = (streak: number) => {
    if (streak >= 100) return { icon: Trophy, label: "Legend" };
    if (streak >= 30) return { icon: Zap, label: "Master" };
    if (streak >= 7) return { icon: Flame, label: "Hot" };
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(data.streaks || []).map((streak) => {
          const badge = getStreakBadge(streak.current);
          const today = new Date().toISOString().split("T")[0];
          const isAtRisk = streak.lastActivity !== today && streak.current > 0;
          
          return (
            <div key={streak.type} className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-center gap-4">
                <Flame className={cn(getFlameSize(streak.current), getFlameColor(streak.current, streak.type))} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium capitalize">{streak.type} Streak</p>
                    {badge && (
                      <Badge variant="default" className="gap-1">
                        <badge.icon className="h-3 w-3" />
                        {badge.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Best: {streak.best} days
                  </p>
                  {isAtRisk && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      ⚠️ Streak at risk! Act today to maintain it.
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{streak.current}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
