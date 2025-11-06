import { useState } from "react";
import { Plus, X, Target, TrendingUp, Activity, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useDashboard } from "@/contexts/DashboardContext";
import { toast } from "sonner";

export function QuickActionsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { data, updateData, awardXP } = useDashboard();

  const [prospectName, setProspectName] = useState("");
  const [prospectCompany, setProspectCompany] = useState("");
  const [revenueAmount, setRevenueAmount] = useState("");

  const quickActions = [
    { id: "prospect", label: "Add Prospect", icon: Target, color: "text-blue-500" },
    { id: "hla", label: "Log HLA", icon: Activity, color: "text-green-500" },
    { id: "revenue", label: "Update Revenue", icon: TrendingUp, color: "text-purple-500" },
    { id: "health", label: "Record Health", icon: Heart, color: "text-red-500" },
  ];

  const handleAddProspect = () => {
    if (!prospectName || !prospectCompany) {
      toast.error("Please fill in all fields");
      return;
    }

    const newProspect = {
      id: Date.now().toString(),
      name: prospectName,
      company: prospectCompany,
      stage: "Cold" as const,
      lastTouch: new Date().toISOString().split("T")[0],
      nextAction: "Initial outreach",
      value: 0,
    };

    updateData({
      prospects: [...data.prospects, newProspect],
      activeProspects: data.activeProspects + 1,
    });

    awardXP(10, "Added new prospect");
    toast.success("Prospect added successfully!");
    setProspectName("");
    setProspectCompany("");
    setActiveModal(null);
  };

  const handleUpdateRevenue = () => {
    const amount = parseFloat(revenueAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    updateData({
      currentRevenue: data.currentRevenue + amount,
    });

    awardXP(Math.floor(amount / 100), "Revenue update");
    toast.success(`Added $${amount.toLocaleString()} to revenue!`);
    setRevenueAmount("");
    setActiveModal(null);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Expanded action buttons */}
        <div
          className={cn(
            "flex flex-col gap-2 transition-all duration-300 origin-bottom",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="secondary"
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all gap-2 min-w-[180px]"
              onClick={() => {
                setActiveModal(action.id);
                setIsOpen(false);
              }}
            >
              <action.icon className={cn("h-5 w-5", action.color)} />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Main toggle button */}
        <Button
          size="lg"
          className={cn(
            "rounded-full w-14 h-14 shadow-2xl hover:shadow-xl transition-all",
            isOpen && "rotate-45"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </Button>
      </div>

      {/* Add Prospect Modal */}
      <Dialog open={activeModal === "prospect"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Prospect</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={prospectCompany}
                onChange={(e) => setProspectCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <Button onClick={handleAddProspect} className="w-full">
              Add Prospect
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log HLA Modal */}
      <Dialog open={activeModal === "hla"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick HLA Check</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(data.currentHLAs ?? []).map((hla) => (
              <div key={hla.id} className="flex items-center gap-3">
                <Checkbox
                  checked={hla.completed}
                  onCheckedChange={(checked: boolean | 'indeterminate') => {
                    const updatedHLAs = data.currentHLAs.map((h) =>
                      h.id === hla.id ? { ...h, completed: !!checked } : h
                    );
                    updateData({ currentHLAs: updatedHLAs });
                    if (checked) {
                      awardXP(50, `Completed ${hla.title}`);
                      toast.success(`${hla.title} completed!`);
                    }
                  }}
                />
                <div>
                  <p className="font-medium">{hla.title}</p>
                  <p className="text-sm text-muted-foreground">{hla.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Revenue Modal */}
      <Dialog open={activeModal === "revenue"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Revenue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={revenueAmount}
                onChange={(e) => setRevenueAmount(e.target.value)}
                placeholder="5000"
              />
            </div>
            <Button onClick={handleUpdateRevenue} className="w-full">
              Add Revenue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Health Modal */}
      <Dialog open={activeModal === "health"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Health Metric</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Navigate to the Health page for detailed tracking
          </p>
          <Button onClick={() => setActiveModal(null)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
