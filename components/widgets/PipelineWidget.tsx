"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { Badge } from "@/components/ui/badge";
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
import { Plus, TrendingUp, Users, Target, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuickAddModal } from "./QuickAddModal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";

interface PipelineDeal {
  id: string;
  date: string;
  stage: string;
  client_name?: string;
  deal_value?: number;
  notes?: string;
}

interface PipelineData {
  deals: PipelineDeal[];
  byStage: Record<string, PipelineDeal[]>;
  totalValue: number;
  counts: {
    discovery: number;
    proposal: number;
    negotiation: number;
    closed: number;
    lost: number;
  };
}

const stageColors: Record<string, string> = {
  discovery: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  proposal: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  negotiation: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  closed: "bg-green-500/20 text-green-400 border-green-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
};

const stageLabels: Record<string, string> = {
  discovery: "Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed: "Closed",
  lost: "Lost",
};

async function fetchPipeline(activeOnly: boolean = false): Promise<PipelineData> {
  const res = await fetch(`/api/pipeline?activeOnly=${activeOnly}`);
  if (!res.ok) throw new Error("Failed to fetch pipeline");
  return res.json();
}

export function PipelineWidget() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<PipelineDeal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<PipelineData>({
    queryKey: ["pipeline"],
    queryFn: () => fetchPipeline(false),
    refetchInterval: 30000,
  });

  const addMutation = useMutation({
    mutationFn: async (deal: {
      date: string;
      stage: string;
      client_name?: string;
      deal_value?: number;
      notes?: string;
    }) => {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deal),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to add deal (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Deal added to pipeline! 🎯");
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      console.error("Pipeline add error:", error);
      toast.error(error.message || "Failed to add deal");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (deal: {
      id: string;
      date?: string;
      stage?: string;
      client_name?: string;
      deal_value?: number;
      notes?: string;
    }) => {
      const res = await fetch("/api/pipeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deal),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to update deal (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Deal updated! ✏️");
      setEditingDeal(null);
    },
    onError: (error: Error) => {
      console.error("Pipeline update error:", error);
      toast.error(error.message || "Failed to update deal");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/pipeline?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete deal");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Deal deleted! 🗑️");
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete deal");
    },
  });

  if (isLoading) {
    return (
      <AnalyticsCard title="Pipeline" subtitle="Deal stages">
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
      <AnalyticsCard title="Pipeline" subtitle="Deal stages">
        <div className="text-destructive">Error loading pipeline data</div>
      </AnalyticsCard>
    );
  }

  const pipeline = data || {
    deals: [],
    byStage: {},
    totalValue: 0,
    counts: { discovery: 0, proposal: 0, negotiation: 0, closed: 0, lost: 0 },
  };

  const activeDeals = pipeline.deals.filter(
    (d) => !["closed", "lost"].includes(d.stage)
  );

  const stageData = [
    { stage: 'Discovery', count: pipeline.counts.discovery || 0, color: 'from-blue-500 to-blue-600' },
    { stage: 'Proposal', count: pipeline.counts.proposal || 0, color: 'from-yellow-500 to-yellow-600' },
    { stage: 'Negotiation', count: pipeline.counts.negotiation || 0, color: 'from-orange-500 to-orange-600' },
    { stage: 'Closed', count: pipeline.counts.closed || 0, color: 'from-green-500 to-green-600' },
  ];
  const totalDeals = activeDeals.length || 1;

  return (
    <>
      <AnalyticsCard 
        title="Pipeline" 
        subtitle="Deal stages"
      >
        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Pipeline Value</p>
            <p className="text-3xl font-bold font-mono text-white">
              $<AnimatedNumber value={pipeline.totalValue} decimals={0} />
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Active Deals</p>
            <p className="text-3xl font-bold font-mono text-white">{activeDeals.length}</p>
          </div>
        </div>

        {/* Horizontal stage bars */}
        <div className="space-y-3 mb-6">
          {stageData.map(({ stage, count, color }) => (
            <div key={stage}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{stage}</span>
                <span className="text-white font-semibold">{count}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
                  style={{ width: `${(count / totalDeals) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state or CTA */}
        {activeDeals.length === 0 ? (
          <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No deals in pipeline yet</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white"
            >
              + Add Deal
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAddModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white"
          >
            + Add Deal
          </Button>
        )}
      </AnalyticsCard>

      {showAddModal && (
        <QuickAddModal
          type="pipeline"
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            addMutation.mutate({
              date: data.date || new Date().toISOString().split("T")[0],
              stage: data.stage || "discovery",
              client_name: data.client_name,
              deal_value: data.deal_value
                ? parseFloat(data.deal_value)
                : undefined,
              notes: data.notes,
            });
          }}
        />
      )}

      {editingDeal && (
        <QuickAddModal
          type="pipeline"
          onClose={() => setEditingDeal(null)}
          onSubmit={(data) => {
            const updatePayload: any = {
              id: editingDeal.id,
            };
            
            // Only include fields that are provided
            if (data.date) {
              updatePayload.date = data.date;
            }
            
            if (data.stage) {
              updatePayload.stage = data.stage;
            }
            
            if (data.client_name !== undefined) {
              updatePayload.client_name = data.client_name?.trim() || null;
            }
            
            if (data.deal_value !== undefined && data.deal_value.trim()) {
              const value = parseFloat(data.deal_value);
              if (!isNaN(value)) {
                updatePayload.deal_value = value;
              } else {
                updatePayload.deal_value = null;
              }
            }
            
            if (data.notes !== undefined) {
              updatePayload.notes = data.notes?.trim() || null;
            }
            
            updateMutation.mutate(updatePayload);
          }}
          initialData={{
            date: editingDeal.date,
            stage: editingDeal.stage,
            client_name: editingDeal.client_name || "",
            deal_value: editingDeal.deal_value ? String(editingDeal.deal_value) : "",
            notes: editingDeal.notes || "",
          }}
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this pipeline deal.
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

