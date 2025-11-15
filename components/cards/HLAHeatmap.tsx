"use client";

import { useState } from "react";

interface HeatmapData {
  date: string;
  count: number;
}

interface HLAHeatmapProps {
  data: HeatmapData[];
}

export function HLAHeatmap({ data }: HLAHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Generate last 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    return date.toISOString().split('T')[0];
  });

  // Create data map
  const dataMap = new Map(data.map(d => [d.date, d.count]));
  
  // Get max count for intensity calculation
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    return Math.min((count / maxCount) * 100, 100);
  };

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-white/5';
    if (intensity < 25) return 'bg-purple-500/20';
    if (intensity < 50) return 'bg-purple-500/40';
    if (intensity < 75) return 'bg-purple-500/60';
    return 'bg-purple-500/80';
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const count = dataMap.get(date) || 0;
          const intensity = getIntensity(count);
          const color = getColor(intensity);
          const isHovered = hoveredDate === date;

          return (
            <div
              key={date}
              className={`
                aspect-square rounded border
                ${color}
                ${isHovered ? 'border-purple-400 scale-110' : 'border-white/10'}
                transition-all cursor-pointer
              `}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              title={`${new Date(date).toLocaleDateString()}: ${count} HLAs`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
          <div className="w-3 h-3 rounded bg-purple-500/20 border border-white/10" />
          <div className="w-3 h-3 rounded bg-purple-500/40 border border-white/10" />
          <div className="w-3 h-3 rounded bg-purple-500/60 border border-white/10" />
          <div className="w-3 h-3 rounded bg-purple-500/80 border border-white/10" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

