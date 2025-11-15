"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProductivityGaugeProps {
  score: number; // 0-100
}

export function ProductivityGauge({ score }: ProductivityGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const data = [
    { value: normalizedScore, fill: '#8B5CF6' },
    { value: 100 - normalizedScore, fill: 'rgba(255,255,255,0.05)' }
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">{normalizedScore}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Productivity</div>
        </div>
      </div>
    </div>
  );
}

