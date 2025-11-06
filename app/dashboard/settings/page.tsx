"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-teal-300 text-transparent bg-clip-text">
          Settings
        </h2>

        <div className="bg-[#141C2E] rounded-xl p-6 border border-white/10 space-y-4 max-w-lg">
          <Setting label="Username" value="makise@ops" />
          <Setting label="Theme" value="Dark Mode" />
          <Setting label="Notifications" value="Enabled" />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

