"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
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
import { Plus, DollarSign, TrendingUp, Calendar, Copy, Loader2, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuickAddModal } from "./QuickAddModal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";

interface RevenueEntry {
  id: string;
  date: string;
  source: string;
  amount: number;
  description?: string;
}

interface RevenueData {
  revenue: RevenueEntry[];
  total: number;
  dailyAverage: number;
  bySource: Record<string, number>;
}

async function fetchRevenue(days: number = 30): Promise<RevenueData> {
  const res = await fetch(`/api/revenue?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch revenue");
  return res.json();
}

interface RevenueWidgetProps {
  onUpdate?: () => void;
}

export function RevenueWidget({ onUpdate }: RevenueWidgetProps = {}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RevenueEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [proofPost, setProofPost] = useState("");
  const [showProof, setShowProof] = useState(false);
  const [generatingProof, setGeneratingProof] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RevenueData>({
    queryKey: ["revenue", days],
    queryFn: () => fetchRevenue(days),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const addMutation = useMutation({
    mutationFn: async (entry: {
      date: string;
      source: string;
      amount: number;
      description?: string;
    }) => {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to add revenue (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue"] });
      toast.success("Revenue entry added! 💰");
      setShowAddModal(false);
      onUpdate?.();
    },
    onError: (error: Error) => {
      console.error("Revenue add error:", error);
      toast.error(error.message || "Failed to add revenue");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (entry: {
      id: string;
      date?: string;
      source?: string;
      amount?: number;
      description?: string;
    }) => {
      const res = await fetch("/api/revenue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to update revenue (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue"] });
      toast.success("Revenue entry updated! ✏️");
      setEditingEntry(null);
      onUpdate?.();
    },
    onError: (error: Error) => {
      console.error("Revenue update error:", error);
      toast.error(error.message || "Failed to update revenue");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/revenue?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete revenue");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue"] });
      toast.success("Revenue entry deleted! 🗑️");
      setDeleteId(null);
      onUpdate?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete revenue");
    },
  });

  const generateProof = async (type: 'twitter' | 'linkedin') => {
    setGeneratingProof(true);
    try {
      const res = await fetch('/api/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error("Failed to generate proof post");
      const data = await res.json();
      setProofPost(data.content);
      setShowProof(true);
      toast.success(`${type === 'twitter' ? 'Twitter' : 'LinkedIn'} post generated! 🎯`);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate proof post");
    } finally {
      setGeneratingProof(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(proofPost);
      toast.success("Copied to clipboard! 📋");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (isLoading) {
    return (
      <AnalyticsCard title="Revenue" subtitle="Last 30 days">
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
      <AnalyticsCard title="Revenue" subtitle="Last 30 days">
        <div className="text-destructive">Error loading revenue data</div>
      </AnalyticsCard>
    );
  }

  const revenue = data || { revenue: [], total: 0, dailyAverage: 0, bySource: {} };
  
  // Prepare data for mini sparkline
  const sparklineData = revenue.revenue
    .slice(-7)
    .map(entry => ({ date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), amount: entry.amount }));

  return (
    <>
      <AnalyticsCard 
        title="Revenue" 
        subtitle="Last 30 days"
      >
        {/* Top metrics - matching MetricTile style */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Total Revenue</p>
            <p className="text-3xl font-bold font-mono text-white">
              $<AnimatedNumber value={revenue.total} decimals={0} />
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Daily Average</p>
            <p className="text-3xl font-bold font-mono text-white">${revenue.dailyAverage.toFixed(2)}</p>
          </div>
        </div>

        {/* Mini sparkline chart */}
        {sparklineData.length > 0 && (
          <div className="h-24 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent entries list */}
        {revenue.revenue.length > 0 ? (
          <div className="space-y-2 mb-6">
            <p className="text-sm text-slate-400 mb-3">Recent Entries</p>
            {revenue.revenue.slice(0, 5).map(entry => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">${entry.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{entry.source} • {new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingEntry(entry)}
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(entry.id)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5 mb-6">
            <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No revenue entries yet</p>
          </div>
        )}

        {/* Add button */}
        <Button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold"
        >
          + Add Entry
        </Button>

      </AnalyticsCard>

      {showAddModal && (
        <QuickAddModal
          type="revenue"
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            addMutation.mutate({
              date: data.date || new Date().toISOString().split("T")[0],
              source: data.source || "manual",
              amount: parseFloat(data.amount || "0"),
              description: data.description,
            });
          }}
        />
      )}

      {editingEntry && (
        <QuickAddModal
          type="revenue"
          onClose={() => setEditingEntry(null)}
          onSubmit={(data) => {
            updateMutation.mutate({
              id: editingEntry.id,
              date: data.date || editingEntry.date,
              source: data.source || editingEntry.source,
              amount: parseFloat(data.amount || String(editingEntry.amount)),
              description: data.description || editingEntry.description,
            });
          }}
          initialData={{
            date: editingEntry.date,
            source: editingEntry.source,
            amount: String(editingEntry.amount),
            description: editingEntry.description || "",
          }}
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Revenue Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this revenue entry.
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
    </>
  );
}

