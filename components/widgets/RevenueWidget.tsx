"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, TrendingUp, Calendar, Copy, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuickAddModal } from "./QuickAddModal";

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

export function RevenueWidget() {
  const [showAddModal, setShowAddModal] = useState(false);
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
      if (!res.ok) throw new Error("Failed to add revenue");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue"] });
      toast.success("Revenue entry added! 💰");
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add revenue");
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
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
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
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading revenue data</div>
        </CardContent>
      </Card>
    );
  }

  const revenue = data || { revenue: [], total: 0, dailyAverage: 0, bySource: {} };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Revenue */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">${revenue.total.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last {days} days
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/20">
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
          </div>

          {/* Daily Average */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
              <p className="text-xl font-semibold">${revenue.dailyAverage.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Entries</p>
              <p className="text-xl font-semibold">{revenue.revenue.length}</p>
            </div>
          </div>

          {/* By Source */}
          {Object.keys(revenue.bySource).length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">By Source</p>
              <div className="space-y-2">
                {Object.entries(revenue.bySource).map(([source, amount]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between p-2 rounded border border-border"
                  >
                    <span className="text-sm capitalize">{source}</span>
                    <span className="text-sm font-semibold">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Entries */}
          {revenue.revenue.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recent Entries</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {revenue.revenue.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 rounded border border-border text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium capitalize">{entry.source}</p>
                      {entry.description && (
                        <p className="text-xs text-muted-foreground">
                          {entry.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold">${entry.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {revenue.revenue.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No revenue entries yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="mt-4"
              >
                Add Your First Entry
              </Button>
            </div>
          )}

          {/* Proof Post Generator */}
          {revenue.total > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium mb-2">Generate Proof Post</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateProof('twitter')}
                  disabled={generatingProof}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-xs flex-1"
                >
                  {generatingProof ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      🐦 Twitter Proof
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => generateProof('linkedin')}
                  disabled={generatingProof}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xs flex-1"
                >
                  {generatingProof ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      💼 LinkedIn Proof
                    </>
                  )}
                </Button>
              </div>

              {showProof && proofPost && (
                <div className="mt-4 p-4 bg-gradient-to-br from-slate-950/50 to-slate-900/50 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-slate-300 mb-3 whitespace-pre-wrap leading-relaxed">
                    {proofPost}
                  </p>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
    </>
  );
}

