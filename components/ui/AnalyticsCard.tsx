import { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AnalyticsCard({ title, subtitle, children, className = "" }: AnalyticsCardProps) {
  return (
    <div className={`
      relative overflow-hidden
      bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40
      backdrop-blur-xl
      border border-white/10
      rounded-2xl
      p-6
      shadow-[0_0_30px_rgba(0,0,0,0.45)]
      hover:shadow-[0_0_40px_rgba(147,51,234,0.15)]
      hover:border-purple-500/20
      transition-all duration-300
      group
      ${className}
    `}>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

