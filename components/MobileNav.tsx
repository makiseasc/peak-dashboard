import { BarChart3, Target, Activity, DollarSign, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const mobileMenuItems = [
  { icon: BarChart3, label: "Home", path: "/" },
  { icon: Target, label: "Revenue", path: "/revenue" },
  { icon: Activity, label: "HLA", path: "/hla" },
  { icon: DollarSign, label: "Finance", path: "/finances" },
  { icon: Heart, label: "Health", path: "/health" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[44px] min-h-[44px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
