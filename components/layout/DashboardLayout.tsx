"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Zap, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const nav = [
    { id: "overview", icon: BarChart3, label: "Overview", href: "/dashboard" },
    { id: "automations", icon: Zap, label: "Automations", href: "/dashboard/automations" },
    { id: "settings", icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#0B1220] text-white">
      <aside className="w-56 bg-[#0E1629] border-r border-white/10 p-4 flex flex-col gap-4">
        <h1 className="text-lg font-bold tracking-wide">PEAK OPS</h1>
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive ? "bg-[#1C2540] text-white" : "hover:bg-[#141C2E] text-gray-400"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

