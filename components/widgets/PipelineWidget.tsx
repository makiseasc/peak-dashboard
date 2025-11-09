"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuickAddModal } from "./QuickAddModal";

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
      if (!res.ok) throw new Error("Failed to add deal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline"] });
      toast.success("Deal added to pipeline! 🎯");
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add deal");
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-2"
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
              <p className="text-3xl font-bold">
                ${pipeline.totalValue.toLocaleString()}
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
                    className="flex items-start justify-between p-3 rounded border border-border"
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
    </>
  );
}

