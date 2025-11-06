import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useDashboard } from "@/contexts/DashboardContext";
import { Skull, Swords, Trophy, CheckCircle2, Coins } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { LevelUpCelebration } from "./LevelUpCelebration";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "./ui/checkbox";

export function BossBattle() {
  const { data, damageBoss, awardGP } = useDashboard();
  const [showVictory, setShowVictory] = useState(false);
  
  if (!data.currentBoss) return null;
  
  const boss = data.currentBoss;
  const hpPercent = (boss.currentHP / boss.maxHP) * 100;
  
  const handleTaskComplete = (taskName: string, damage: number) => {
    const bossDefeated = damageBoss(damage, taskName);
    
    toast({
      title: `💥 ${damage} Damage Dealt!`,
      description: `${taskName} completed`,
    });
    
    if (bossDefeated) {
      awardGP(25, "Boss Defeated");
      setShowVictory(true);
      
      toast({
        title: "🏆 BOSS DEFEATED!",
        description: "+25 GP earned + Special Badge",
      });
    }
  };
  
  return (
    <>
      {showVictory && boss.defeated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="bg-gradient-to-br from-accent via-primary to-accent border-2 border-accent shadow-2xl animate-scale-in">
            <CardContent className="p-12 text-center space-y-6">
              <Trophy className="h-24 w-24 text-primary-foreground mx-auto animate-pulse" />
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-primary-foreground">BOSS DEFEATED!</h2>
                <p className="text-2xl text-primary-foreground/80">{boss.name}</p>
                <div className="flex items-center justify-center gap-2 text-warning text-xl font-bold">
                  <Coins className="h-6 w-6" />
                  <span>+25 GP</span>
                </div>
              </div>
              <Button onClick={() => setShowVictory(false)} size="lg">
                Claim Rewards
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Card className={boss.defeated ? "border-accent bg-accent/10" : "border-destructive/50 bg-destructive/5"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${boss.defeated ? "bg-accent/20 border-accent/30" : "bg-destructive/20 border-destructive/30"} border`}>
                {boss.defeated ? (
                  <Trophy className="h-6 w-6 text-accent" />
                ) : (
                  <Skull className="h-6 w-6 text-destructive" />
                )}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Weekly Boss Battle
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{boss.description}</p>
              </div>
            </div>
            {boss.defeated && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                <Trophy className="h-3 w-3 mr-1" />
                Defeated
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold">{boss.name}</span>
              <span className="text-sm font-medium">
                {boss.currentHP} / {boss.maxHP} HP
              </span>
            </div>
            <Progress 
              value={hpPercent} 
              className={`h-4 ${boss.defeated ? "[&>div]:bg-accent" : "[&>div]:bg-destructive"}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Week: {new Date(boss.weekStart).toLocaleDateString()} - {new Date(boss.weekEnd).toLocaleDateString()}</span>
              <span>{hpPercent.toFixed(0)}% HP Remaining</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Battle Tasks:</p>
            {boss.tasks.map((task) => (
              <div
                key={task.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={task.completed}
                    disabled={task.completed || boss.defeated}
                    onCheckedChange={() => !task.completed && !boss.defeated && handleTaskComplete(task.name, task.damage)}
                  />
                  <div>
                    <p className={task.completed ? "line-through text-muted-foreground" : "font-medium"}>
                      {task.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.damage} damage
                    </p>
                  </div>
                </div>
                {task.completed && (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                )}
              </div>
            ))}
          </div>
          
          {boss.defeated && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Victory! You earned 25 GP and a special badge. Ready for next week's challenge?
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
