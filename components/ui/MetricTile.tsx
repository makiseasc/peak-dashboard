import { ReactNode } from "react";

interface MetricTileProps {
  label: string;
  value: string | number;
  trend?: number;
  icon?: ReactNode;
}

export function MetricTile({ label, value, trend, icon }: MetricTileProps) {
  return (
    <div className="
      relative
      bg-gradient-to-br from-slate-900/60 to-slate-800/40
      backdrop-blur-sm
      border border-white/10
      rounded-xl
      p-4
      hover:border-purple-500/30
      hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]
      transition-all duration-300
      group
    ">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">
          {label}
        </span>
        {icon && (
          <div className="text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold font-mono text-white">
          {value}
        </span>
        
        {trend !== undefined && (
          <span className={`text-sm font-medium ${
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

