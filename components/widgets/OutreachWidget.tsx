"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import { OutreachDonut } from "@/components/charts/OutreachDonut";
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
      <AnalyticsCard title="Outreach" subtitle="Last 30 days">
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
      <AnalyticsCard title="Outreach" subtitle="Last 30 days">
        <div className="text-destructive">Error loading outreach data</div>
      </AnalyticsCard>
    );
  }

  const outreach = data || {
    outreach: [],
    totals: { sent: 0, replies: 0, positives: 0 },
    responseRate: 0,
    positiveRate: 0,
    byPlatform: {},
  };

  const sent = outreach.totals.sent || 0;
  const replies = outreach.totals.replies || 0;
  const positive = outreach.totals.positives || 0;
  const responseRate = outreach.responseRate || 0;

  return (
    <>
      <AnalyticsCard 
        title="Outreach" 
        subtitle="Last 30 days"
      >
        {/* Response rate metric */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Response Rate</p>
          <p className="text-4xl font-bold font-mono text-white">{responseRate}%</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-2xl font-bold font-mono text-white">{sent}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Sent</p>
          </div>
          <div className="text-center bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-2xl font-bold font-mono text-white">{replies}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Replies</p>
          </div>
          <div className="text-center bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-2xl font-bold font-mono text-cyan-400">{positive}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Positive</p>
          </div>
        </div>

        {/* Donut chart or empty state */}
        {sent > 0 ? (
          <div className="h-48 mb-6">
            <OutreachDonut 
              data={{
                positive,
                neutral: replies - positive,
                noResponse: sent - replies,
                responseRate
              }}
            />
          </div>
        ) : (
          <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5 mb-6">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No outreach entries yet</p>
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

