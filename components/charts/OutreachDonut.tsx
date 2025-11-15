"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface OutreachDonutProps {
  data: {
    positive: number;
    neutral: number;
    noResponse: number;
    responseRate: number;
  };
}

const COLORS = ['#10b981', '#06b6d4', '#64748b'];

export function OutreachDonut({ data }: OutreachDonutProps) {
  const chartData = [
    { name: 'Positive', value: data.positive },
    { name: 'Neutral', value: data.neutral },
    { name: 'No Response', value: data.noResponse },
  ].filter(item => item.value > 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15,18,42,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#F8FAFC'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{data.responseRate}%</div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Response Rate</div>
        </div>
      </div>
    </div>
  );
}

