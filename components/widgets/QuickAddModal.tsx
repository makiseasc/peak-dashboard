"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface QuickAddModalProps {
  type: "revenue" | "pipeline" | "hla" | "outreach";
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void | Promise<void>;
  initialData?: Record<string, string>;
}

export function QuickAddModal({ type, onClose, onSubmit, initialData }: QuickAddModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    date: initialData?.date || new Date().toISOString().split("T")[0],
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === "revenue" && (initialData ? "Edit Revenue Entry" : "Add Revenue Entry")}
            {type === "pipeline" && (initialData ? "Edit Pipeline Deal" : "Add Pipeline Deal")}
            {type === "hla" && (initialData ? "Edit High-Leverage Action" : "Add High-Leverage Action")}
            {type === "outreach" && (initialData ? "Edit Outreach Entry" : "Add Outreach Entry")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Field - Common to all */}
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          {/* Revenue Fields */}
          {type === "revenue" && (
            <>
              <div>
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source || ""}
                  onValueChange={(value) => handleChange("source", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gumroad">Gumroad</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Add any notes..."
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Pipeline Fields */}
          {type === "pipeline" && (
            <>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage || ""}
                  onValueChange={(value) => handleChange("stage", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name || ""}
                  onChange={(e) => handleChange("client_name", e.target.value)}
                  placeholder="Client or company name"
                />
              </div>
              <div>
                <Label htmlFor="deal_value">Deal Value ($)</Label>
                <Input
                  id="deal_value"
                  type="number"
                  step="0.01"
                  value={formData.deal_value || ""}
                  onChange={(e) => handleChange("deal_value", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Add any notes..."
                  rows={3}
                />
              </div>
            </>
          )}

          {/* HLA Fields */}
          {type === "hla" && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g., Make 10 prospect calls"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Add details..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="energy_level">Energy Level (1-10)</Label>
                <Input
                  id="energy_level"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.energy_level || ""}
                  onChange={(e) => handleChange("energy_level", e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </>
          )}

          {/* Outreach Fields */}
          {type === "outreach" && (
            <>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform || ""}
                  onValueChange={(value) => handleChange("platform", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartlead">Smartlead</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="campaign_name">Campaign Name (Optional)</Label>
                <Input
                  id="campaign_name"
                  value={formData.campaign_name || ""}
                  onChange={(e) => handleChange("campaign_name", e.target.value)}
                  placeholder="Campaign or campaign name"
                />
              </div>
              <div>
                <Label htmlFor="messages_sent">Messages Sent</Label>
                <Input
                  id="messages_sent"
                  type="number"
                  min="0"
                  value={formData.messages_sent || ""}
                  onChange={(e) => handleChange("messages_sent", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="replies">Replies</Label>
                <Input
                  id="replies"
                  type="number"
                  min="0"
                  value={formData.replies || ""}
                  onChange={(e) => handleChange("replies", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="positive_replies">Positive Replies</Label>
                <Input
                  id="positive_replies"
                  type="number"
                  min="0"
                  value={formData.positive_replies || ""}
                  onChange={(e) => handleChange("positive_replies", e.target.value)}
                  placeholder="0"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

