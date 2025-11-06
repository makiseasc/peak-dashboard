import { BarChart3, Target, Activity, DollarSign, Heart, FileText, Upload, TrendingDown, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: BarChart3, label: "Overview", path: "/" },
  { icon: Target, label: "Revenue Pipeline", path: "/revenue" },
  { icon: Activity, label: "HLA Tracker", path: "/hla" },
  { icon: TrendingDown, label: "Constraints", path: "/constraints" },
  { icon: DollarSign, label: "Finances", path: "/finances" },
  { icon: Heart, label: "Health", path: "/health" },
  { icon: FileText, label: "Proof Vault", path: "/proof" },
  { icon: ShoppingBag, label: "Reward Shop", path: "/rewards" },
  { icon: Upload, label: "Data Import", path: "/import" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col md:flex hidden">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">
          Performance Hub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Tesla Consultant Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/20 text-primary shadow-lg shadow-primary/10 border border-primary/30"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium mt-1">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </aside>
  );
}
