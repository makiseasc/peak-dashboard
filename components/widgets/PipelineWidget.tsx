"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
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
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading pipeline data</div>
        </CardContent>
      </Card>
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

  return (
    <>
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-[0_0_30px_rgba(139,92,246,0.08),0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.12),0_8px_40px_rgba(0,0,0,0.4)] hover:border-purple-500/30 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border-0 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Deal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Pipeline Value */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pipeline Value</p>
              <p className="text-5xl font-bold font-mono mb-2 text-slate-100 hover:bg-gradient-to-r hover:from-cyan-300/80 hover:to-purple-300/80 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                $<AnimatedNumber value={pipeline.totalValue} decimals={0} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeDeals.length} active deals
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </div>

          {/* Stage Counts */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(pipeline.counts).map(([stage, count]) => {
              if (stage === "lost") return null;
              return (
                <div
                  key={stage}
                  className={`p-3 rounded-lg border ${stageColors[stage] || "border-border"}`}
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {stageLabels[stage]}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Deals */}
          {pipeline.deals.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recent Deals</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pipeline.deals.slice(0, 5).map((deal) => (
                  <div
                    key={deal.id}
                    className="group flex items-start justify-between p-3 rounded border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {deal.client_name || "Unnamed Client"}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${stageColors[deal.stage] || ""}`}
                        >
                          {stageLabels[deal.stage] || deal.stage}
                        </Badge>
                      </div>
                      {deal.deal_value && (
                        <p className="text-sm font-semibold text-primary">
                          ${deal.deal_value.toLocaleString()}
                        </p>
                      )}
                      {deal.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {deal.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingDeal(deal)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(deal.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pipeline.deals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No deals in pipeline yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="mt-4"
              >
                Add Your First Deal
              </Button>
            </div>
          )}
        </CardContent>
          </div>
      </Card>

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

