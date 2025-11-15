"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { RevenueWidget } from "@/components/widgets/RevenueWidget";
import { PipelineWidget } from "@/components/widgets/PipelineWidget";
import { HLAWidget } from "@/components/widgets/HLAWidget";
import { OutreachWidget } from "@/components/widgets/OutreachWidget";
import { DailyReportWidget } from "@/components/widgets/DailyReportWidget";
import { OperatorStatsWidget } from "@/components/widgets/OperatorStatsWidget";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="min-h-screen relative overflow-hidden -m-8 p-8">
        {/* Base layer - Deep navy */}
        <div className="absolute inset-0 bg-[#0a0e27]" />
        
        {/* Gradient layer - Subtle variation */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Radial gradient glows - Purple & Cyan */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/25 rounded-full blur-[150px]" />
        </div>
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-[0.015] dashboard-grid" />
        
        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-noise" />
        
        {/* Content layer */}
        <div className="relative z-10">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-300 text-transparent bg-clip-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            PEAK Dashboard
          </motion.h2>
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Empire Operations Command Center
          </motion.p>
        </div>

        {/* Widget Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {/* Top Row */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <RevenueWidget />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <PipelineWidget />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <HLAWidget />
          </motion.div>

          {/* Second Row */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <OutreachWidget />
          </motion.div>

          {/* AI Daily Report - Full Width */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
            className="col-span-full"
          >
            <DailyReportWidget />
          </motion.div>

          {/* Operator Stats - Full Width */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
            className="col-span-full"
          >
            <OperatorStatsWidget />
          </motion.div>
        </motion.div>
      </motion.div>
        </div>
      </div>
    </DashboardLayout>
    </AuthGuard>
  );
}

