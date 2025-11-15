"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Zap,
  Settings,
  BarChart3,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Zap, label: "Automations", href: "/dashboard/automations" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="relative w-20 h-screen flex-shrink-0">
      {/* Purple-cyan gradient rail */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-cyan-500" />
      
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl border-r border-white/5" />
      
      {/* Nav items */}
      <nav className="relative z-10 flex flex-col items-center gap-4 py-8">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
        </div>

        {/* Nav links */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative group w-14 h-14 rounded-xl flex items-center justify-center
                transition-all duration-200
                ${isActive 
                  ? 'bg-slate-800/60 shadow-[0_0_25px_rgba(139,92,246,0.4)]' 
                  : 'hover:bg-slate-800/40'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-r" />
              )}
              
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive 
                    ? 'text-purple-300' 
                    : 'text-slate-400 group-hover:text-purple-300'
                }`}
              />
              
              {/* Tooltip */}
              <div className="absolute left-20 px-3 py-2 bg-slate-800 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

