import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useDashboard } from "@/contexts/DashboardContext";
import { Skull, Swords, Target, Flame, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface BossTemplate {
  name: string;
  description: string;
  maxHP: number;
  icon: any;
  tasks: { name: string; damage: number; completed: boolean }[];
}

export function BossSelector() {
  const { createNewBoss } = useDashboard();
  
  const bossTemplates: BossTemplate[] = [
    {
      name: "Close First Client",
      description: "Land your first major client deal",
      maxHP: 500,
      icon: Target,
      tasks: [
        { name: "5 Discovery calls", damage: 100, completed: false },
        { name: "3 Proposals sent", damage: 150, completed: false },
        { name: "Follow up 10 prospects", damage: 100, completed: false },
        { name: "1 Deal closed", damage: 150, completed: false },
      ],
    },
    {
      name: "Outreach Master",
      description: "Dominate your outreach game",
      maxHP: 300,
      icon: Swords,
      tasks: [
        { name: "30+ prospect touches", damage: 100, completed: false },
        { name: "15 meaningful conversations", damage: 100, completed: false },
        { name: "5 call bookings", damage: 100, completed: false },
      ],
    },
    {
      name: "Perfect Week",
      description: "Complete all HLAs every day this week",
      maxHP: 700,
      icon: Trophy,
      tasks: [
        { name: "Monday 3/3 HLAs", damage: 100, completed: false },
        { name: "Tuesday 3/3 HLAs", damage: 100, completed: false },
        { name: "Wednesday 3/3 HLAs", damage: 100, completed: false },
        { name: "Thursday 3/3 HLAs", damage: 100, completed: false },
        { name: "Friday 3/3 HLAs", damage: 100, completed: false },
        { name: "Saturday 3/3 HLAs", damage: 100, completed: false },
        { name: "Sunday 3/3 HLAs", damage: 100, completed: false },
      ],
    },
    {
      name: "Health Guardian",
      description: "Optimize your energy and recovery",
      maxHP: 400,
      icon: Flame,
      tasks: [
        { name: "4+ gym sessions", damage: 100, completed: false },
        { name: "8h avg sleep/night", damage: 150, completed: false },
        { name: "Daily supplements", damage: 75, completed: false },
        { name: "3 recovery activities", damage: 75, completed: false },
      ],
    },
  ];
  
  const selectBoss = (template: BossTemplate) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    createNewBoss({
      name: template.name,
      description: template.description,
      maxHP: template.maxHP,
      currentHP: template.maxHP,
      weekStart: today.toISOString().split("T")[0],
      weekEnd: nextWeek.toISOString().split("T")[0],
      defeated: false,
      tasks: template.tasks,
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Skull className="h-5 w-5 mr-2" />
          Select New Boss Battle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Skull className="h-6 w-6" />
            Choose Your Weekly Boss
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {bossTemplates.map((boss) => {
            const Icon = boss.icon;
            return (
              <Card key={boss.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/20 border border-destructive/30">
                      <Icon className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{boss.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{boss.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Boss HP:</span>
                    <span className="font-bold text-destructive">{boss.maxHP}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Tasks:</p>
                    {boss.tasks.map((task, idx) => (
                      <div key={idx} className="text-xs p-2 rounded bg-secondary/50 flex justify-between">
                        <span>{task.name}</span>
                        <span className="text-destructive font-medium">{task.damage} dmg</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={() => selectBoss(boss)} className="w-full mt-2">
                    Accept Challenge
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
