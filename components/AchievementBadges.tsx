import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { Trophy, Flame, DollarSign, Dumbbell, Target, Lock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "Streaks" | "Revenue" | "Health" | "Mastery";
  icon: any;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  requirement: number;
}

export function AchievementBadges() {
  const { data } = useDashboard();
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadge, setNewBadge] = useState<Achievement | null>(null);
  
  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "Complete 7-day HLA streak",
      category: "Streaks",
      icon: Flame,
      unlocked: Math.max(...(data.streaks?.map(s => s.best) || [0])) >= 7,
      progress: Math.max(...(data.streaks?.map(s => s.current) || [0])),
      requirement: 7,
      unlockedDate: Math.max(...(data.streaks?.map(s => s.best) || [0])) >= 7 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "streak_30",
      name: "Monthly Master",
      description: "Complete 30-day HLA streak",
      category: "Streaks",
      icon: Flame,
      unlocked: Math.max(...(data.streaks?.map(s => s.best) || [0])) >= 30,
      progress: Math.max(...(data.streaks?.map(s => s.current) || [0])),
      requirement: 30,
      unlockedDate: Math.max(...(data.streaks?.map(s => s.best) || [0])) >= 30 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "streak_100",
      name: "Century Champion",
      description: "Complete 100-day HLA streak",
      category: "Streaks",
      icon: Flame,
      unlocked: Math.max(...(data.streaks?.map(s => s.best) || [0])) >= 100,
      progress: Math.max(...(data.streaks?.map(s => s.current) || [0])),
      requirement: 100,
      unlockedDate: Math.max(...(data.streaks?.map(s => s.best) || [0])) >= 100 ? new Date().toISOString().split('T')[0] : undefined,
    },
    
    // Revenue Achievements
    {
      id: "first_client",
      name: "First Blood",
      description: "Close your first client",
      category: "Revenue",
      icon: DollarSign,
      unlocked: data.dealsInfo.closed >= 1,
      progress: data.dealsInfo.closed,
      requirement: 1,
      unlockedDate: data.dealsInfo.closed >= 1 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "revenue_10k",
      name: "$10K Milestone",
      description: "Reach $10K monthly revenue",
      category: "Revenue",
      icon: DollarSign,
      unlocked: data.currentRevenue >= 10000,
      progress: data.currentRevenue,
      requirement: 10000,
      unlockedDate: data.currentRevenue >= 10000 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "revenue_50k",
      name: "Big League",
      description: "Reach $50K total earned",
      category: "Revenue",
      icon: DollarSign,
      unlocked: data.currentRevenue >= 50000,
      progress: data.currentRevenue,
      requirement: 50000,
      unlockedDate: data.currentRevenue >= 50000 ? new Date().toISOString().split('T')[0] : undefined,
    },
    
    // Health Achievements
    {
      id: "gym_30",
      name: "Fitness Fanatic",
      description: "Complete 30-day gym streak",
      category: "Health",
      icon: Dumbbell,
      unlocked: (data.currentHealth.gymSessions || 0) >= 30,
      progress: data.currentHealth.gymSessions || 0,
      requirement: 30,
      unlockedDate: (data.currentHealth.gymSessions || 0) >= 30 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "sleep_90",
      name: "Sleep Sensei",
      description: "90-day sleep consistency (7+ hrs)",
      category: "Health",
      icon: Dumbbell,
      unlocked: false,
      progress: 0,
      requirement: 90,
    },
    
    // Mastery Achievements
    {
      id: "prospects_100",
      name: "Network King",
      description: "Add 100 prospects to pipeline",
      category: "Mastery",
      icon: Target,
      unlocked: data.activeProspects >= 100,
      progress: data.activeProspects,
      requirement: 100,
      unlockedDate: data.activeProspects >= 100 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "calls_50",
      name: "Call Champion",
      description: "Complete 50 calls",
      category: "Mastery",
      icon: Target,
      unlocked: data.callsThisMonth >= 50,
      progress: data.callsThisMonth,
      requirement: 50,
      unlockedDate: data.callsThisMonth >= 50 ? new Date().toISOString().split('T')[0] : undefined,
    },
    {
      id: "boss_5",
      name: "Boss Slayer",
      description: "Defeat 5 weekly bosses",
      category: "Mastery",
      icon: Trophy,
      unlocked: (data.defeatedBosses?.length || 0) >= 5,
      progress: data.defeatedBosses?.length || 0,
      requirement: 5,
      unlockedDate: (data.defeatedBosses?.length || 0) >= 5 ? new Date().toISOString().split('T')[0] : undefined,
    },
  ];
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  const getCategoryColor = (category: Achievement["category"]) => {
    switch (category) {
      case "Streaks": return "text-chart-3";
      case "Revenue": return "text-primary";
      case "Health": return "text-warning";
      case "Mastery": return "text-chart-3";
      default: return "text-muted-foreground";
    }
  };
  
  const getCategoryBg = (category: Achievement["category"]) => {
    switch (category) {
      case "Streaks": return "bg-chart-3/20 border-chart-3/30";
      case "Revenue": return "bg-primary/20 border-primary/30";
      case "Health": return "bg-warning/20 border-warning/30";
      case "Mastery": return "bg-chart-3/20 border-chart-3/30";
      default: return "bg-secondary/20 border-border";
    }
  };
  
  return (
    <>
      {showCelebration && newBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="bg-gradient-to-br from-primary via-chart-3 to-primary border-2 border-chart-3 shadow-2xl animate-scale-in">
            <CardContent className="p-12 text-center space-y-6">
              <Trophy className="h-24 w-24 text-primary-foreground mx-auto animate-pulse" />
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-primary-foreground">ACHIEVEMENT UNLOCKED!</h2>
                <p className="text-2xl text-primary-foreground/80">{newBadge.name}</p>
                <p className="text-lg text-primary-foreground/60">{newBadge.description}</p>
              </div>
              <Button onClick={() => setShowCelebration(false)} size="lg">
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/10 via-background to-chart-3/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-2xl font-bold">{unlockedCount}/{totalCount}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6" />
              Achievement Badges
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {["Streaks", "Revenue", "Health", "Mastery"].map((category) => {
              const categoryAchievements = achievements.filter(a => a.category === category);
              const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
              
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{category}</h3>
                    <Badge variant="secondary">
                      {unlockedInCategory}/{categoryAchievements.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryAchievements.map((achievement) => {
                      const Icon = achievement.icon;
                      const progressPercent = achievement.progress && achievement.requirement 
                        ? Math.min((achievement.progress / achievement.requirement) * 100, 100)
                        : 0;
                      
                      return (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-lg border ${
                            achievement.unlocked 
                              ? getCategoryBg(achievement.category as Achievement["category"])
                              : "bg-secondary/20 border-border opacity-60"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              achievement.unlocked 
                                ? getCategoryBg(achievement.category as Achievement["category"])
                                : "bg-secondary/50"
                            }`}>
                              {achievement.unlocked ? (
                                <Icon className={`h-6 w-6 ${getCategoryColor(achievement.category as Achievement["category"])}`} />
                              ) : (
                                <Lock className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div>
                                <p className="font-semibold">{achievement.unlocked ? achievement.name : "???"}</p>
                                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                {achievement.unlockedDate && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Unlocked: {achievement.unlockedDate}
                                  </p>
                                )}
                              </div>
                              
                              {!achievement.unlocked && achievement.progress !== undefined && (
                                <div className="space-y-1">
                                  <Progress value={progressPercent} className="h-2" />
                                  <p className="text-xs text-muted-foreground">
                                    {achievement.progress} / {achievement.requirement}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
