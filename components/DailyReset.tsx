import { Card, CardContent } from "./ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { Clock, AlertTriangle, CheckCircle2, Zap, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { LevelUpCelebration } from "./LevelUpCelebration";
import { toast } from "@/hooks/use-toast";

export function DailyReset() {
  const { data, updateData, awardXP, awardGP, updateStreak } = useDashboard();
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [prevCompletedCount, setPrevCompletedCount] = useState(0);
  
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setHoursLeft(hours);
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
      
      // Show warning if after 8pm (20:00) and HLAs not complete
      const currentHour = now.getHours();
      const completedHLAs = data.currentHLAs.filter(h => h.completed).length;
      setShowWarning(currentHour >= 20 && completedHLAs < 3);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [data.currentHLAs]);
  
  const completedHLAs = data.currentHLAs.filter(h => h.completed).length;
  const allComplete = completedHLAs === 3;
  
  // Check for all HLAs complete and award bonus
  useEffect(() => {
    if (completedHLAs === 3 && prevCompletedCount < 3) {
      awardGP(50, "All Daily HLAs Complete");
      updateStreak("hla");
      toast({
        title: "🎉 Perfect Day!",
        description: "+50 GP bonus for completing all HLAs!",
      });
    }
    setPrevCompletedCount(completedHLAs);
  }, [completedHLAs]);
  
  const toggleHLA = (id: string) => {
    const hla = data.currentHLAs.find(h => h.id === id);
    if (!hla) return;
    
    const newCompleted = !hla.completed;
    const updatedHLAs = data.currentHLAs.map(h => 
      h.id === id ? { ...h, completed: newCompleted } : h
    );
    
    if (newCompleted) {
      // Award XP and GP for completing HLA
      const leveledUp = awardXP(200, `Completed ${hla.title}`);
      awardGP(20, `Completed ${hla.title}`);
      
      toast({
        title: "✅ HLA Completed!",
        description: `+200 XP, +20 GP`,
      });
      
      if (leveledUp) {
        setNewLevel(data.level + 1);
        setShowLevelUp(true);
      }
    }
    
    updateData({ currentHLAs: updatedHLAs });
  };
  
  return (
    <>
      {showLevelUp && <LevelUpCelebration level={newLevel} onClose={() => setShowLevelUp(false)} />}
    <Card className={`${showWarning ? "border-warning bg-warning/10" : allComplete ? "border-accent bg-accent/10" : "bg-secondary/50"}`}>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                showWarning 
                  ? "bg-warning/20 border-warning/30" 
                  : allComplete 
                    ? "bg-accent/20 border-accent/30"
                    : "bg-primary/20 border-primary/30"
              } border`}>
                {showWarning ? (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                ) : allComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <Clock className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Reset In</p>
                <p className="text-2xl font-bold font-mono">{timeUntilReset}</p>
              </div>
            </div>
            
            <Badge variant={allComplete ? "default" : "secondary"} className={allComplete ? "bg-accent" : ""}>
              {completedHLAs}/3 HLAs
            </Badge>
          </div>
          
          {showWarning && !allComplete && (
            <div className="p-3 rounded-lg bg-warning/20 border border-warning/30">
              <p className="text-sm font-medium text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                ⚠️ {hoursLeft} hours to maintain your streak! Complete remaining HLAs.
              </p>
            </div>
          )}
          
          {allComplete && (
            <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
              <p className="text-sm font-medium text-accent flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Perfect! All HLAs completed for today. Streak secured! 🔥
              </p>
            </div>
          )}
          
          {/* HLA List */}
          <div className="space-y-3 pt-4 border-t border-border">
            {data.currentHLAs.map((hla) => (
              <div
                key={hla.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  hla.completed 
                    ? "bg-accent/10 border border-accent/20" 
                    : "bg-secondary/30 border border-border hover:border-primary/30"
                }`}
              >
                <Checkbox
                  id={`hla-${hla.id}`}
                  checked={hla.completed}
                  onCheckedChange={() => toggleHLA(hla.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`hla-${hla.id}`}
                    className={`block font-medium cursor-pointer ${
                      hla.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {hla.title}
                  </label>
                  {hla.description && (
                    <p className="text-sm text-muted-foreground mt-1">{hla.description}</p>
                  )}
                  {!hla.completed && (
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-primary">
                        <Zap className="h-3 w-3" />
                        +200 XP
                      </span>
                      <span className="flex items-center gap-1 text-warning">
                        <Coins className="h-3 w-3" />
                        +20 GP
                      </span>
                    </div>
                  )}
                  {hla.completed && (
                    <span className="flex items-center gap-1 text-xs text-accent mt-2">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
