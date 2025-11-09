"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Coins, Plus, Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDashboard } from "@/contexts/DashboardContext";
import { LevelUpCelebration } from "@/components/LevelUpCelebration";
import { QuickAddModal } from "./QuickAddModal";

interface HLA {
  id: string;
  date: string;
  title: string;
  description?: string;
  completed: boolean;
  energy_level?: number;
  xp?: number;
  streak_count?: number;
}

interface HLAData {
  hlas: HLA[];
  today: HLA[];
  completed: number;
  total: number;
  totalXP?: number;
  streakCount?: number;
}

async function fetchHLA(date?: string): Promise<HLAData> {
  const url = date
    ? `/api/hla?date=${date}`
    : `/api/hla`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch HLA");
  return res.json();
}

export function HLAWidget() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);
  const { awardXP, awardGP, updateStreak, data: contextData } = useDashboard();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split("T")[0];
  const { data, isLoading, error } = useQuery<HLAData>({
    queryKey: ["hla", today],
    queryFn: () => fetchHLA(today),
    refetchInterval: 30000,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await fetch("/api/hla", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });
      if (!res.ok) throw new Error("Failed to update HLA");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hla"] });
      
      // Award XP and GP if completing (not uncompleting)
      if (variables.completed) {
        const leveledUp = awardXP(50, "HLA Completed");
        awardGP(3, "HLA Completed");
        
        toast.success("🎯 HLA Completed! +50 XP and +3 GP earned");
        
        if (leveledUp) {
          setNewLevel(contextData.level + 1);
          setShowLevelUp(true);
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update HLA");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (hla: {
      date: string;
      title: string;
      description?: string;
      energy_level?: number;
    }) => {
      const res = await fetch("/api/hla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hla),
      });
      if (!res.ok) throw new Error("Failed to add HLA");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hla"] });
      toast.success("HLA added! 🎯");
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add HLA");
    },
  });

  const hlaData = data || { hlas: [], today: [], completed: 0, total: 0, totalXP: 0, streakCount: 0 };
  const completedCount = hlaData.completed;
  const totalCount = hlaData.total;
  const totalXP = hlaData.totalXP || 0;
  const streakCount = hlaData.streakCount || 0;

  // Check for all completion and award bonus GP
  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount && previousCompletedCount < totalCount) {
      awardGP(9, "Daily HLA 3/3 Completion");
      updateStreak("hla");
      toast.success("🔥 Perfect Day! +9 GP earned for completing all HLAs!");
    }
    setPreviousCompletedCount(completedCount);
  }, [completedCount, totalCount, previousCompletedCount, awardGP, updateStreak]);

  const handleToggle = (hla: HLA) => {
    toggleMutation.mutate({ id: hla.id, completed: !hla.completed });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily High-Leverage Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily High-Leverage Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading HLA data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {showLevelUp && (
        <LevelUpCelebration
          level={newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily High-Leverage Activities
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={completedCount === totalCount ? "default" : "secondary"}
              >
                {completedCount}/{totalCount} Complete
              </Badge>
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* XP and Streak Display */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">XP: {totalXP}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-400">🔥 Streak: {streakCount} days</span>
            </div>
          </div>

          {hlaData.today.length > 0 ? (
            hlaData.today.map((hla) => (
              <div
                key={hla.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => handleToggle(hla)}
              >
                <Checkbox checked={hla.completed} />
                <div className="flex-1">
                  <span
                    className={
                      hla.completed
                        ? "line-through text-muted-foreground"
                        : "font-medium"
                    }
                  >
                    {hla.title}
                  </span>
                  {hla.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {hla.description}
                    </p>
                  )}
                  {hla.energy_level && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Energy Level: {hla.energy_level}/10
                    </p>
                  )}
                </div>
                {hla.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
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
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No HLAs for today yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="mt-4"
              >
                Add Your First HLA
              </Button>
            </div>
          )}

          {totalCount > 0 && completedCount === totalCount && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm font-medium text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                All HLAs completed for today! Outstanding work.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <QuickAddModal
          type="hla"
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            addMutation.mutate({
              date: data.date || today,
              title: data.title || "",
              description: data.description,
              energy_level: data.energy_level
                ? parseInt(data.energy_level)
                : undefined,
            });
          }}
        />
      )}
    </>
  );
}

