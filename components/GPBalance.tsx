import { Card, CardContent } from "./ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "./ui/badge";

export function GPBalance() {
  const { data } = useDashboard();
  
  return (
    <Card className="bg-gradient-to-br from-warning/20 via-background to-warning/10 border-warning/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20 border border-warning/30">
                <Coins className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gold Points</p>
                <p className="text-3xl font-bold text-warning">{data.gp} GP</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Earned</p>
                <p className="text-lg font-semibold text-accent">{data.gpEarned}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-semibold text-destructive">{data.gpSpent}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
