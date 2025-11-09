"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Zap, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const nav = [
    { id: "overview", icon: BarChart3, label: "Overview", href: "/dashboard" },
    { id: "automations", icon: Zap, label: "Automations", href: "/dashboard/automations" },
    { id: "settings", icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "OP";

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
        
        {/* User Menu */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-[#141C2E]"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs truncate">
                  {user?.email || "Operator"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0E1629] border-white/10">
              <DropdownMenuLabel className="text-white">
                {user?.email || "Operator"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={signOut}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

