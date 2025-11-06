"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RevenueChart from "@/components/Charts";

async function fetchMetrics() {
  const res = await fetch("/api/metrics");
  return res.json();
}

export default function DashboardPage() {
  const { data, refetch } = useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
  });
  const stats = data || { revenue: 0, tasks: 0, leads: 0 };

  const handleRefresh = async () => {
    await refetch();
    toast.success("Metrics updated successfully ⚡");
  };

  const trend = [
    { name: "Mon", value: 4200 },
    { name: "Tue", value: 6000 },
    { name: "Wed", value: 7800 },
    { name: "Thu", value: 6900 },
    { name: "Fri", value: 8450 },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-teal-300 text-transparent bg-clip-text">
            Operator Console
          </h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Metric label="Revenue" value={`$${stats.revenue.toLocaleString()}`} />
          <Metric label="Tasks Completed" value={stats.tasks} />
          <Metric label="Open Leads" value={stats.leads} />
        </div>

        <RevenueChart data={trend} />
      </motion.div>
    </DashboardLayout>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#141C2E] to-[#0F1626] rounded-xl p-6 border border-white/10 shadow-md hover:shadow-purple-500/20 transition"
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <h3 className="text-2xl font-semibold text-white/90">{value}</h3>
    </motion.div>
  );
}

