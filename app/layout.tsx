"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import { DashboardProvider } from "@/contexts/DashboardContext";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B1220] text-white antialiased">
        <QueryClientProvider client={queryClient}>
          <DashboardProvider>
            <Toaster position="top-right" richColors />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </DashboardProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
