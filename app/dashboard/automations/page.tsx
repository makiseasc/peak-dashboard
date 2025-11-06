"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AutomationsPage() {
  const automations = [
    { name: "Lead Routing", status: "Active", lastRun: "2h ago" },
    { name: "Weekly Report Sync", status: "Idle", lastRun: "Yesterday" },
    { name: "Notion → Airtable Bridge", status: "Active", lastRun: "5m ago" },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-teal-300 text-transparent bg-clip-text">
          Automations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automations.map((auto) => (
            <motion.div
              key={auto.name}
              className="bg-gradient-to-br from-[#141C2E] to-[#0F1626] rounded-xl p-5 border border-white/10 shadow-md hover:shadow-teal-400/20 transition"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold">{auto.name}</h3>
              <p
                className={`text-sm mt-1 ${
                  auto.status === "Active" ? "text-green-400" : "text-gray-400"
                }`}
              >
                {auto.status}
              </p>
              <p className="text-xs text-gray-500 mt-2">Last run: {auto.lastRun}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

