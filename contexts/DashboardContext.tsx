import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Prospect {
  id: string;
  name: string;
  company: string;
  stage: "Cold" | "Warm" | "Call Booked" | "Proposal Sent" | "Closed";
  lastTouch: string;
  nextAction: string;
  value: number;
}

interface HLA {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface DailyHLA {
  date: string;
  hlas: HLA[];
  energyScore: number;
  notes: string;
}

interface Constraint {
  week: string;
  bottleneck: string;
  solution: string;
  outcome: string;
  hypothesis: string;
  testPlan: string;
}

interface IncomeStream {
  name: string;
  amount: number;
}

interface HealthMetric {
  date: string;
  sleepScore: number;
  recovery: number;
  gymSessions: number;
  supplements: string[];
}

interface ProofItem {
  id: string;
  title: string;
  type: "Case Study" | "LinkedIn" | "Demo" | "Testimonial";
  status: "Draft" | "Published" | "In Progress";
  date: string;
  impact: string;
}

interface Streak {
  type: "hla" | "revenue" | "mastery";
  current: number;
  best: number;
  lastActivity: string;
}

interface Reward {
  id: string;
  name: string;
  cost: number;
  tier: "Low" | "Mid" | "High";
  category: string;
  purchased: boolean;
  purchaseDate?: string;
}

interface Boss {
  id: string;
  name: string;
  description: string;
  maxHP: number;
  currentHP: number;
  weekStart: string;
  weekEnd: string;
  defeated: boolean;
  tasks: { name: string; damage: number; completed: boolean }[];
}

interface Transaction {
  id: string;
  date: string;
  source: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
  notes: string;
}

interface DashboardData {
  currentRevenue: number;
  lastMonthRevenue: number;
  previousRevenue?: number;
  activeProspects: number;
  callsThisMonth: number;
  monthlySavings?: number;
  revenueGoal?: number;
  dealsInfo: {
    closed: number;
    negotiation: number;
    qualified?: number;
    proposal?: number;
  };
  prospects: Prospect[];
  dailyHLAs: DailyHLA[];
  currentHLAs: HLA[];
  constraints: Constraint[];
  currentBottleneck: string;
  incomeStreams: IncomeStream[];
  cashPosition: {
    liquid: number;
    dueThisWeek: number;
    expectedIncome: number;
    burnRate: number;
  };
  cashOnHand: number;
  lastWeekCashOnHand: number;
  transactions: Transaction[];
  healthMetrics: HealthMetric[];
  currentHealth: {
    sleepScore: number;
    recovery: number;
    gymSessions: number;
    supplements: string[];
  };
  proofItems: ProofItem[];
  xp: number;
  level: number;
  gp: number;
  gpEarned: number;
  gpSpent: number;
  streaks: Streak[];
  rewards: Reward[];
  currentBoss: Boss | null;
  defeatedBosses: Boss[];
}

interface DashboardContextType {
  data: DashboardData;
  updateData: (updates: Partial<DashboardData>) => void;
  exportData: () => void;
  awardXP: (amount: number, reason: string) => boolean;
  getXPForNextLevel: (level: number) => number;
  awardGP: (amount: number, reason: string) => void;
  spendGP: (amount: number, reason: string) => boolean;
  updateStreak: (type: "hla" | "revenue" | "mastery") => void;
  damageBoss: (damage: number, taskName: string) => boolean;
  createNewBoss: (boss: Omit<Boss, "id">) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const initialData: DashboardData = {
  currentRevenue: 3250,
  lastMonthRevenue: 2900,
  activeProspects: 24,
  callsThisMonth: 47,
  dealsInfo: { closed: 8, negotiation: 5 },
  prospects: [],
  dailyHLAs: [],
  currentHLAs: [
    { id: "1", title: "Revenue HLA", description: "Make 10 prospect calls", completed: false },
    { id: "2", title: "Signal HLA", description: "Publish LinkedIn post", completed: false },
    { id: "3", title: "Mastery HLA", description: "Systems build + skills training + energy optimization", completed: false },
  ],
  constraints: [],
  currentBottleneck: "Time Allocation",
  incomeStreams: [
    { name: "Consulting", amount: 7500 },
    { name: "ACI", amount: 1500 },
    { name: "Snorkel", amount: 1000 },
    { name: "Other", amount: 500 },
  ],
  cashPosition: {
    liquid: 45200,
    dueThisWeek: 3500,
    expectedIncome: 8500,
    burnRate: 8200,
  },
  cashOnHand: 45200,
  lastWeekCashOnHand: 43000,
  transactions: [],
  healthMetrics: [],
  currentHealth: {
    sleepScore: 7.2,
    recovery: 85,
    gymSessions: 3,
    supplements: ["Creatine", "Protein", "Vitamin D"],
  },
  proofItems: [],
  xp: 0,
  level: 1,
  gp: 0,
  gpEarned: 0,
  gpSpent: 0,
  streaks: [
    { type: "hla", current: 0, best: 0, lastActivity: "" },
    { type: "revenue", current: 0, best: 0, lastActivity: "" },
    { type: "mastery", current: 0, best: 0, lastActivity: "" },
  ],
  rewards: [
    // Low Tier (10-30 GP)
    { id: "r1", name: "Premium Coffee ($15)", cost: 10, tier: "Low", category: "Food & Drink", purchased: false },
    { id: "r2", name: "Favorite Snack", cost: 15, tier: "Low", category: "Food & Drink", purchased: false },
    { id: "r3", name: "1 Hour Gaming Session", cost: 20, tier: "Low", category: "Entertainment", purchased: false },
    { id: "r4", name: "Episode Binge (3 eps)", cost: 25, tier: "Low", category: "Entertainment", purchased: false },
    
    // Mid Tier (40-75 GP)
    { id: "r5", name: "Movie Theater Night", cost: 40, tier: "Mid", category: "Entertainment", purchased: false },
    { id: "r6", name: "Special Restaurant Meal", cost: 50, tier: "Mid", category: "Food & Drink", purchased: false },
    { id: "r7", name: "Hobby Purchase ($50)", cost: 60, tier: "Mid", category: "Shopping", purchased: false },
    { id: "r8", name: "Concert/Event Ticket", cost: 75, tier: "Mid", category: "Entertainment", purchased: false },
    
    // High Tier (100+ GP)
    { id: "r9", name: "Full Day Off", cost: 100, tier: "High", category: "Time Off", purchased: false },
    { id: "r10", name: "Weekend Trip", cost: 150, tier: "High", category: "Travel", purchased: false },
    { id: "r11", name: "Major Purchase ($300+)", cost: 200, tier: "High", category: "Shopping", purchased: false },
    { id: "r12", name: "Week Vacation", cost: 500, tier: "High", category: "Travel", purchased: false },
  ],
  currentBoss: {
    id: "boss_1",
    name: "Close First Client",
    description: "Land your first major client deal",
    maxHP: 500,
    currentHP: 500,
    weekStart: new Date().toISOString().split("T")[0],
    weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    defeated: false,
    tasks: [
      { name: "5 Discovery calls", damage: 100, completed: false },
      { name: "3 Proposals sent", damage: 150, completed: false },
      { name: "Follow up 10 prospects", damage: 100, completed: false },
      { name: "1 Deal closed", damage: 150, completed: false },
    ],
  },
  defeatedBosses: [],
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(() => {
    const stored = localStorage.getItem("dashboardData");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: Convert old "health" streaks to "mastery"
      if (parsed.streaks) {
        parsed.streaks = parsed.streaks.map((streak: any) => 
          streak.type === "health" ? { ...streak, type: "mastery" as const } : streak
        );
      }
      // Migration: Update Health HLA to Mastery HLA
      if (parsed.currentHLAs) {
        parsed.currentHLAs = parsed.currentHLAs.map((hla: HLA) => 
          hla.title === "Health HLA" 
            ? { ...hla, title: "Mastery HLA", description: "Systems build + skills training + energy optimization" }
            : hla
        );
      }
      return {
        ...initialData,
        ...parsed,
        cashPosition: { ...initialData.cashPosition, ...(parsed.cashPosition || {}) },
        dealsInfo: { ...initialData.dealsInfo, ...(parsed.dealsInfo || {}) },
        currentHealth: { ...initialData.currentHealth, ...(parsed.currentHealth || {}) },
        currentHLAs: parsed.currentHLAs ?? initialData.currentHLAs,
        dailyHLAs: parsed.dailyHLAs ?? initialData.dailyHLAs,
        streaks: parsed.streaks ?? initialData.streaks,
        rewards: parsed.rewards ?? initialData.rewards,
        prospects: parsed.prospects ?? initialData.prospects,
        transactions: parsed.transactions ?? initialData.transactions,
        proofItems: parsed.proofItems ?? initialData.proofItems,
        incomeStreams: parsed.incomeStreams ?? initialData.incomeStreams,
        currentBoss: parsed.currentBoss ?? initialData.currentBoss,
        defeatedBosses: parsed.defeatedBosses ?? initialData.defeatedBosses,
      };
    }
    return initialData;
  });

  // Daily reset logic
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toISOString().split("T")[0];
      const lastResetDate = localStorage.getItem("lastResetDate");
      
      if (lastResetDate !== today) {
        // It's a new day, check if we need to reset HLAs
        const completedYesterday = data.currentHLAs.filter(h => h.completed).length === 3;
        
        // Reset HLAs for new day
        setData(prev => ({
          ...prev,
          currentHLAs: prev.currentHLAs.map(hla => ({ ...hla, completed: false })),
        }));
        
        localStorage.setItem("lastResetDate", today);
        
        // Show notification if it's the first visit after midnight
        if (lastResetDate && completedYesterday) {
          // Streak is preserved
          console.log("New day! Streak preserved from yesterday.");
        }
      }
    };
    
    checkDailyReset();
    // Check every minute for day change
    const interval = setInterval(checkDailyReset, 60000);
    
    return () => clearInterval(interval);
  }, [data.currentHLAs]);

  useEffect(() => {
    // Debounced localStorage save
    const timeout = setTimeout(() => {
      localStorage.setItem("dashboardData", JSON.stringify(data));
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [data]);

  const updateData = (updates: Partial<DashboardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const getXPForNextLevel = (level: number): number => {
    // Level 1→2 = 100 XP, each level needs 20% more XP than previous
    return Math.floor(100 * Math.pow(1.2, level - 1));
  };

  const awardXP = (amount: number, reason: string): boolean => {
    let leveledUp = false;
    
    setData((prev) => {
      const newXP = prev.xp + amount;
      let currentLevel = prev.level;
      let remainingXP = newXP;
      
      // Check for level ups
      while (remainingXP >= getXPForNextLevel(currentLevel)) {
        remainingXP -= getXPForNextLevel(currentLevel);
        currentLevel++;
        leveledUp = true;
      }
      
      return {
        ...prev,
        xp: remainingXP,
        level: currentLevel,
      };
    });
    
    return leveledUp;
  };

  const awardGP = (amount: number, reason: string) => {
    setData((prev) => ({
      ...prev,
      gp: prev.gp + amount,
      gpEarned: prev.gpEarned + amount,
    }));
  };

  const spendGP = (amount: number, reason: string): boolean => {
    if (data.gp < amount) return false;
    
    setData((prev) => ({
      ...prev,
      gp: prev.gp - amount,
      gpSpent: prev.gpSpent + amount,
    }));
    
    return true;
  };

  const updateStreak = (type: "hla" | "revenue" | "mastery") => {
    const today = new Date().toISOString().split("T")[0];
    
    setData((prev) => {
      const streaks = prev.streaks.map(streak => {
        if (streak.type === type) {
          const lastDate = new Date(streak.lastActivity);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let newCurrent = streak.current;
          if (diffDays === 1) {
            // Consecutive day
            newCurrent = streak.current + 1;
          } else if (diffDays === 0) {
            // Same day, no change
            newCurrent = streak.current;
          } else {
            // Streak broken
            newCurrent = 1;
          }
          
          return {
            ...streak,
            current: newCurrent,
            best: Math.max(streak.best, newCurrent),
            lastActivity: today,
          };
        }
        return streak;
      });
      
      return { ...prev, streaks };
    });
  };

  const damageBoss = (damage: number, taskName: string): boolean => {
    let bossDefeated = false;
    
    setData((prev) => {
      if (!prev.currentBoss) return prev;
      
      const updatedTasks = prev.currentBoss.tasks.map(task => 
        task.name === taskName ? { ...task, completed: true } : task
      );
      
      const newHP = Math.max(0, prev.currentBoss.currentHP - damage);
      const defeated = newHP === 0;
      
      if (defeated) {
        bossDefeated = true;
      }
      
      return {
        ...prev,
        currentBoss: {
          ...prev.currentBoss,
          currentHP: newHP,
          defeated,
          tasks: updatedTasks,
        },
      };
    });
    
    return bossDefeated;
  };

  const createNewBoss = (boss: Omit<Boss, "id">) => {
    setData((prev) => {
      const defeatedBosses = prev.currentBoss?.defeated 
        ? [...prev.defeatedBosses, prev.currentBoss]
        : prev.defeatedBosses;
      
      return {
        ...prev,
        currentBoss: {
          ...boss,
          id: `boss_${Date.now()}`,
        },
        defeatedBosses,
      };
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardContext.Provider value={{ 
      data, 
      updateData, 
      exportData, 
      awardXP, 
      getXPForNextLevel,
      awardGP,
      spendGP,
      updateStreak,
      damageBoss,
      createNewBoss,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
