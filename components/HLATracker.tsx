import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { CheckCircle2, Zap, Coins } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useState, useEffect } from "react";
import { LevelUpCelebration } from "./LevelUpCelebration";
import { toast } from "@/hooks/use-toast";

export function HLATracker() {
  const { data, updateData, awardXP, awardGP, updateStreak } = useDashboard();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);
  
  const completedCount = (data.currentHLAs ?? []).filter(h => h.completed).length;
  const totalCount = (data.currentHLAs ?? []).length;
  
  // Check for 3/3 completion and award GP
  useEffect(() => {
    if (completedCount === 3 && previousCompletedCount < 3) {
      awardGP(9, "Daily HLA 3/3 Completion");
      updateStreak("hla");
      toast({
        title: "🔥 Perfect Day!",
        description: "+9 GP earned for 3/3 HLAs completed!",
      });
    }
    setPreviousCompletedCount(completedCount);
  }, [completedCount]);
  
  const toggleHLA = (id: string) => {
    const updatedHLAs = (data.currentHLAs ?? []).map(hla => {
      if (hla.id === id) {
        const nowCompleted = !hla.completed;
        
        // Award XP and GP if completing (not uncompleting)
        if (nowCompleted) {
          const leveledUp = awardXP(50, "HLA Completed");
          awardGP(3, "HLA Completed");
          
          toast({
            title: "🎯 HLA Completed!",
            description: "+50 XP and +3 GP earned",
          });
          
          if (leveledUp) {
            setNewLevel(data.level + 1);
            setShowLevelUp(true);
          }
        }
        
        return { ...hla, completed: nowCompleted };
      }
      return hla;
    });
    
    updateData({ currentHLAs: updatedHLAs });
  };

  return (
    <>
      {showLevelUp && <LevelUpCelebration level={newLevel} onClose={() => setShowLevelUp(false)} />}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily High-Leverage Activities</CardTitle>
            <Badge variant={completedCount === totalCount ? "default" : "secondary"}>
              {completedCount}/{totalCount} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.currentHLAs ?? []).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => toggleHLA(activity.id)}
            >
              <Checkbox checked={activity.completed} />
              <div className="flex-1">
                <span className={activity.completed ? "line-through text-muted-foreground" : "font-medium"}>
                  {activity.title}
                </span>
                {activity.description && (
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                )}
              </div>
              {activity.completed ? (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-accent" />
                    <span>+50 XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="h-3 w-3 text-warning" />
                    <span>+3 GP</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {completedCount === totalCount && (
            <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                All HLAs completed for today! Outstanding work.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
