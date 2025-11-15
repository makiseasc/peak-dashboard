"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface XPLineChartProps {
  data: Array<{ date: string; xp: number }>;
}

export function XPLineChart({ data }: XPLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="date" 
          stroke="#AEB7D6"
          style={{ fontSize: '11px' }}
        />
        <YAxis 
          stroke="#AEB7D6"
          style={{ fontSize: '11px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(15,18,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#F8FAFC'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="xp" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#xpGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

