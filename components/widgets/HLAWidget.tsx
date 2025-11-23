"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { CheckItem } from "@/components/ui/CheckItem";
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
import { CheckCircle2, Zap, Coins, Plus, Target, Edit2, Trash2, X, Check, Flame } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDashboard } from "@/contexts/DashboardContext";
import { LevelUpCelebration } from "@/components/LevelUpCelebration";
import { QuickAddModal } from "./QuickAddModal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayCST, isTodayCST, isPastDate, isFutureDate } from "@/lib/date-utils";
import { Calendar } from "lucide-react";

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

interface HLAWidgetProps {
  onUpdate?: () => void;
}

export function HLAWidget({ onUpdate }: HLAWidgetProps = {}) {
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
  const [selectedDate, setSelectedDate] = useState<string>(getTodayCST());
  const { awardXP, awardGP, updateStreak, data: contextData } = useDashboard();
  const queryClient = useQueryClient();

  const today = getTodayCST();
  const { data, isLoading, error } = useQuery<HLAData>({
    queryKey: ["hla", selectedDate],
    queryFn: () => fetchHLA(selectedDate),
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
        const updatedData = await queryClient.fetchQuery({ queryKey: ["hla", selectedDate] });
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
      onUpdate?.();
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
      onUpdate?.();
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
      onUpdate?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete HLA");
    },
  });

  if (isLoading) {
    return (
      <AnalyticsCard title="Daily High-Leverage Activities" subtitle="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </AnalyticsCard>
    );
  }

  if (error) {
    return (
      <AnalyticsCard title="Daily High-Leverage Activities" subtitle="Error">
        <div className="text-destructive">Error loading HLA data</div>
      </AnalyticsCard>
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

      <AnalyticsCard 
        title="Daily High-Leverage Activities"
        subtitle={`${completedCount}/${totalCount} Complete`}
      >
        {/* Date Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-[200px] bg-white/5 border-white/10"
            />
            {!isTodayCST(selectedDate) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedDate(today)}
                className="text-xs"
              >
                Today
              </Button>
            )}
            {isPastDate(selectedDate) && (
              <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/30">
                Past Date
              </Badge>
            )}
            {isFutureDate(selectedDate) && (
              <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30">
                Future Date
              </Badge>
            )}
          </div>
        </div>

        {/* XP & Streak metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 uppercase tracking-wide">XP</p>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">
              <AnimatedNumber value={totalXP} />
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isTodayCST(selectedDate) ? "Today" : isPastDate(selectedDate) ? "For this date" : "Planned"}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 uppercase tracking-wide">Streak</p>
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">
              <AnimatedNumber value={streakCount} /> days
            </p>
            <p className="text-xs text-slate-500 mt-1">Current streak</p>
          </div>
        </div>

        {/* HLA checklist - use CheckItem component */}
        <div className="space-y-3 mb-6">
          {hlaData.today.length > 0 ? (
            hlaData.today.map((hla) => (
              <CheckItem
                key={hla.id}
                text={hla.title}
                completed={hla.completed}
                onToggle={() => toggleMutation.mutate({ id: hla.id, completed: !hla.completed })}
                onEdit={() => setEditingHLA(hla)}
              />
            ))
          ) : (
            <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">
                {isTodayCST(selectedDate) 
                  ? "No HLAs for today yet" 
                  : isPastDate(selectedDate)
                  ? `No HLAs for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : `No HLAs planned for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white"
              >
                + Add
              </Button>
            </div>
          )}
        </div>

        {/* Success message - only when all complete */}
        {totalCount > 0 && completedCount === totalCount && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-medium">
                {isTodayCST(selectedDate) 
                  ? "All HLAs completed for today! Outstanding work."
                  : isPastDate(selectedDate)
                  ? `All HLAs completed for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`
                  : `All HLAs planned for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`}
              </p>
            </div>
          </div>
        )}

        {/* Add button */}
        {hlaData.today.length > 0 && (
          <Button 
            onClick={() => setShowAddModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold"
          >
            + Add
          </Button>
        )}
      </AnalyticsCard>

      {showAddModal && (
        <QuickAddModal
          type="hla"
          onClose={() => setShowAddModal(false)}
          initialData={{ date: selectedDate }}
          onSubmit={(data) => {
            // Validate title before submitting
            const title = (data.title || "").trim();
            if (!title) {
              toast.error("Title is required");
              return;
            }
            
            addMutation.mutate({
              date: data.date || selectedDate,
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
              onUpdate?.();
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

