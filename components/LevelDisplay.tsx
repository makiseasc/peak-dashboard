import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { useDashboard } from "@/contexts/DashboardContext";
import { Trophy, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

export function LevelDisplay() {
  const { data, getXPForNextLevel } = useDashboard();
  
  const currentLevel = data.level || 1;
  const currentXP = data.xp || 0;
  const xpForNext = getXPForNextLevel(currentLevel);
  const progressPercent = xpForNext > 0 ? (currentXP / xpForNext) * 100 : 0;
  
  return (
    <Card className="bg-gradient-to-br from-primary/20 via-background to-chart-3/20 border-primary/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Level</p>
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {currentLevel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Performance Rank</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Zap className="h-4 w-4 text-chart-3" />
                <p className="text-2xl font-bold text-chart-3">{currentXP}</p>
                <span className="text-sm text-muted-foreground">/ {xpForNext}</span>
              </div>
              <p className="text-xs text-muted-foreground">XP to next level</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressPercent.toFixed(1)}% Complete</span>
              <span>{Math.max(0, xpForNext - currentXP)} XP needed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
