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
import { Plus, MessageSquare, Reply, TrendingUp, Mail, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuickAddModal } from "./QuickAddModal";
import { Skeleton } from "@/components/ui/skeleton";

interface OutreachEntry {
  id: string;
  date: string;
  platform: string;
  messages_sent: number;
  replies: number;
  positive_replies: number;
  campaign_name?: string;
}

interface OutreachData {
  outreach: OutreachEntry[];
  totals: {
    sent: number;
    replies: number;
    positives: number;
  };
  responseRate: number;
  positiveRate: number;
  byPlatform: Record<string, any>;
}

async function fetchOutreach(days: number = 30): Promise<OutreachData> {
  const res = await fetch(`/api/outreach?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch outreach");
  return res.json();
}

export function OutreachWidget() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<OutreachEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<OutreachData>({
    queryKey: ["outreach", days],
    queryFn: () => fetchOutreach(days),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const addMutation = useMutation({
    mutationFn: async (entry: {
      date: string;
      platform: string;
      messages_sent?: number;
      replies?: number;
      positive_replies?: number;
      campaign_name?: string;
    }) => {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to add outreach (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast.success("Outreach entry added! 📧");
      setShowAddModal(false);
    },
    onError: (error: Error) => {
      console.error("Outreach add error:", error);
      toast.error(error.message || "Failed to add outreach");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (entry: {
      id: string;
      date?: string;
      platform?: string;
      messages_sent?: number;
      replies?: number;
      positive_replies?: number;
      campaign_name?: string;
    }) => {
      const res = await fetch("/api/outreach", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to update outreach (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast.success("Outreach entry updated! ✏️");
      setEditingEntry(null);
    },
    onError: (error: Error) => {
      console.error("Outreach update error:", error);
      toast.error(error.message || "Failed to update outreach");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/outreach?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete outreach");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast.success("Outreach entry deleted! 🗑️");
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete outreach");
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outreach</CardTitle>
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
          <CardTitle>Outreach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading outreach data</div>
        </CardContent>
      </Card>
    );
  }

  const outreach = data || {
    outreach: [],
    totals: { sent: 0, replies: 0, positives: 0 },
    responseRate: 0,
    positiveRate: 0,
    byPlatform: {},
  };

  return (
    <>
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.45)] hover:shadow-[0_0_40px_rgba(147,51,234,0.15)] hover:border-purple-500/20 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Outreach
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border-0 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Response Rate */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-blue-500/20">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
              <p className="text-3xl font-bold">{outreach.responseRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last {days} days
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Sent</p>
              <p className="text-xl font-semibold">{outreach.totals.sent}</p>
            </div>
            <div className="p-3 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Replies</p>
              <p className="text-xl font-semibold">{outreach.totals.replies}</p>
            </div>
            <div className="p-3 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Positive</p>
              <p className="text-xl font-semibold text-green-400">
                {outreach.totals.positives}
              </p>
            </div>
          </div>

          {/* Positive Rate */}
          {outreach.totals.replies > 0 && (
            <div className="p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Positive Reply Rate</p>
              <p className="text-lg font-semibold text-green-400">
                {outreach.positiveRate}%
              </p>
            </div>
          )}

          {/* By Platform */}
          {Object.keys(outreach.byPlatform).length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">By Platform</p>
              <div className="space-y-2">
                {Object.entries(outreach.byPlatform).map(([platform, stats]: [string, any]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-2 rounded border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {platform}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {stats.sent} sent
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.replies} replies ({stats.positives} +)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Entries */}
          {outreach.outreach.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recent Entries</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {outreach.outreach.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex items-center justify-between p-2 rounded border border-border text-sm hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.platform}
                        </Badge>
                        {entry.campaign_name && (
                          <span className="text-xs text-muted-foreground">
                            {entry.campaign_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entry.messages_sent} sent • {entry.replies} replies
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.positive_replies > 0 && (
                        <Badge variant="outline" className="text-xs text-green-400">
                          +{entry.positive_replies}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingEntry(entry)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(entry.id)}
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

          {outreach.outreach.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No outreach entries yet</p>
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
        </CardContent>
          </div>
      </Card>

      {showAddModal && (
        <QuickAddModal
          type="outreach"
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            addMutation.mutate({
              date: data.date || new Date().toISOString().split("T")[0],
              platform: data.platform || "smartlead",
              messages_sent: data.messages_sent
                ? parseInt(data.messages_sent)
                : undefined,
              replies: data.replies ? parseInt(data.replies) : undefined,
              positive_replies: data.positive_replies
                ? parseInt(data.positive_replies)
                : undefined,
              campaign_name: data.campaign_name,
            });
          }}
        />
      )}

      {editingEntry && (
        <QuickAddModal
          type="outreach"
          onClose={() => setEditingEntry(null)}
          onSubmit={(data) => {
            const updatePayload: any = {
              id: editingEntry.id,
            };
            
            if (data.date) {
              updatePayload.date = data.date;
            }
            
            if (data.platform) {
              updatePayload.platform = data.platform;
            }
            
            if (data.messages_sent !== undefined && data.messages_sent.trim()) {
              updatePayload.messages_sent = parseInt(data.messages_sent);
            }
            
            if (data.replies !== undefined && data.replies.trim()) {
              updatePayload.replies = parseInt(data.replies);
            }
            
            if (data.positive_replies !== undefined && data.positive_replies.trim()) {
              updatePayload.positive_replies = parseInt(data.positive_replies);
            }
            
            if (data.campaign_name !== undefined) {
              updatePayload.campaign_name = data.campaign_name?.trim() || null;
            }
            
            updateMutation.mutate(updatePayload);
          }}
          initialData={{
            date: editingEntry.date,
            platform: editingEntry.platform,
            messages_sent: String(editingEntry.messages_sent || 0),
            replies: String(editingEntry.replies || 0),
            positive_replies: String(editingEntry.positive_replies || 0),
            campaign_name: editingEntry.campaign_name || "",
          }}
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outreach Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this outreach entry.
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

