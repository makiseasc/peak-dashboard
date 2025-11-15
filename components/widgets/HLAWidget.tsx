"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Zap, Coins, Plus, Target, Edit2, Trash2, X, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDashboard } from "@/contexts/DashboardContext";
import { LevelUpCelebration } from "@/components/LevelUpCelebration";
import { QuickAddModal } from "./QuickAddModal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editingHLA, setEditingHLA] = useState<HLA | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState(0);
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
    onSuccess: async (_, variables) => {
      // Award XP and GP if completing (not uncompleting)
      if (variables.completed) {
        const leveledUp = awardXP(50, "HLA Completed");
        awardGP(3, "HLA Completed");
        
        // Invalidate and fetch updated data to check streak
        await queryClient.invalidateQueries({ queryKey: ["hla"] });
        const updatedData = await queryClient.fetchQuery({ queryKey: ["hla", today] });
        const currentStreak = (updatedData as HLAData)?.streakCount || 0;
        
        // Trigger confetti on streak milestones
        if (currentStreak === 3 || currentStreak === 7 || currentStreak === 30 || currentStreak === 100) {
          setMilestoneStreak(currentStreak);
          setShowMilestone(true);
          
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#9333ea', '#6366f1', '#06b6d4', '#8b5cf6']
          });
          
          // Auto-close after 3 seconds
          setTimeout(() => setShowMilestone(false), 3000);
        } else {
          toast.success("🎯 HLA Completed!", {
            description: "+50 XP and +3 GP earned",
          });
        }
        
        if (leveledUp) {
          setNewLevel(contextData.level + 1);
          setShowLevelUp(true);
        }
      } else {
        queryClient.invalidateQueries({ queryKey: ["hla"] });
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
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to add HLA (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hla"] });
      toast.success("HLA added! 🎯");
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      console.error("HLA add error:", error);
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

  const handleToggle = (hla: HLA, e?: React.MouseEvent) => {
    // Don't toggle if clicking on edit/delete buttons
    if (e && (e.target as HTMLElement).closest('button, [role="button"]')) {
      return;
    }
    toggleMutation.mutate({ id: hla.id, completed: !hla.completed });
  };

  const handleStartEdit = (hla: HLA, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(hla.id);
    setEditTitle(hla.title);
  };

  const handleSaveEdit = async (hla: HLA) => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    
    const res = await fetch("/api/hla", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: hla.id, title: editTitle.trim() }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      toast.error(errorData.error || "Failed to update HLA");
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ["hla"] });
    setEditingId(null);
    setEditTitle("");
    toast.success("HLA updated! ✏️");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/hla?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete HLA");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hla"] });
      toast.success("HLA deleted! 🗑️");
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete HLA");
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily High-Leverage Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
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

      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.45)] hover:shadow-[0_0_40px_rgba(147,51,234,0.15)] hover:border-purple-500/20 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
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
                className="gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border-0 transition-all duration-200"
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
              <span className="text-2xl font-bold text-purple-300">
                XP: <AnimatedNumber value={totalXP} />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-cyan-300">
                🔥 Streak: <AnimatedNumber value={streakCount} /> days
              </span>
            </div>
          </div>

          {hlaData.today.length > 0 ? (
            hlaData.today.map((hla) => (
              <div
                key={hla.id}
                className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <Checkbox 
                  checked={hla.completed} 
                  onCheckedChange={(checked) => {
                    toggleMutation.mutate({ id: hla.id, completed: checked === true });
                  }}
                  className="cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1" onClick={(e) => handleToggle(hla, e)}>
                  {editingId === hla.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(hla);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="h-8"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(hla);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                {editingId !== hla.id && (
                  <div className="flex items-center gap-2">
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingHLA(hla);
                      }}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(hla.id);
                      }}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
          </div>
      </Card>

      {showAddModal && (
        <QuickAddModal
          type="hla"
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            // Validate title before submitting
            const title = (data.title || "").trim();
            if (!title) {
              toast.error("Title is required");
              return;
            }
            
            addMutation.mutate({
              date: data.date || today,
              title: title,
              description: data.description?.trim() || undefined,
              energy_level: data.energy_level && data.energy_level.trim()
                ? parseInt(data.energy_level)
                : undefined,
            });
          }}
        />
      )}

      {editingHLA && (
        <QuickAddModal
          type="hla"
          onClose={() => setEditingHLA(null)}
          onSubmit={async (data) => {
            // Validate title before submitting
            const title = (data.title || "").trim();
            if (!title) {
              toast.error("Title is required");
              return;
            }
            
            try {
              const updatePayload: any = {
                id: editingHLA.id,
                title: title,
              };
              
              // Only include fields that are provided
              if (data.description !== undefined) {
                updatePayload.description = data.description?.trim() || null;
              }
              
              if (data.energy_level !== undefined && data.energy_level.trim()) {
                const energyNum = parseInt(data.energy_level);
                if (!isNaN(energyNum) && energyNum >= 1 && energyNum <= 10) {
                  updatePayload.energy_level = energyNum;
                }
              }
              
              if (data.date) {
                updatePayload.date = data.date;
              }
              
              const res = await fetch("/api/hla", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload),
              });
              
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.error || "Failed to update HLA");
                return;
              }
              
              queryClient.invalidateQueries({ queryKey: ["hla"] });
              toast.success("HLA updated! ✏️");
              setEditingHLA(null);
            } catch (error) {
              console.error("HLA update error:", error);
              toast.error("Failed to update HLA");
            }
          }}
          initialData={{
            date: editingHLA.date,
            title: editingHLA.title,
            description: editingHLA.description || "",
            energy_level: editingHLA.energy_level ? String(editingHLA.energy_level) : "",
          }}
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete HLA?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this high-leverage action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMilestone(false)}
          >
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-purple-500/50 rounded-2xl p-12 shadow-[0_0_100px_rgba(139,92,246,0.5)] max-w-md text-center">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
              
              <div className="relative z-10">
                <div className="text-6xl mb-4">🔥</div>
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {milestoneStreak} Day Streak!
                </h2>
                <p className="text-slate-300 text-lg">
                  Peak execution unlocked
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

